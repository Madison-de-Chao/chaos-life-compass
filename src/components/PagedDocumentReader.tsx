import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Loader2, MessageSquare, Printer, Send, LayoutDashboard, List, X } from "lucide-react";
import { supabase, FunctionsHttpError } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useDrag } from "@use-gesture/react";
import { TypewriterText } from "@/components/TypewriterText";
import { OptimizedImage } from "@/components/ui/optimized-image";
import logoChaoxuan from "@/assets/logo-chaoxuan.png";
import logoHongling from "@/assets/logo-hongling.png";
import reportLogo from "@/assets/report-logo.png";

interface DocumentSection {
  id: string;
  type: string;
  content: string;
  level?: number;
}

interface PagedDocumentReaderProps {
  content: {
    title: string;
    htmlContent?: string;
    sections?: DocumentSection[];
  };
  className?: string;
  documentId?: string;
  shareLink?: string;
  isAdmin?: boolean;
}

// Page break patterns
// Check if text contains ## (but NOT ###) - markdown heading level 2 only
// Check if text STARTS with ## (but NOT ###) - markdown heading level 2 only
const markdownH2Pattern = /^(?<![#])##(?![#])\s+/;

// Check if text STARTS with 第X章 pattern (chapter indicator)
const chapterPattern = /^第\s*\d+\s*章/;

// Check if text STARTS with 【...】 bracket pattern (section titles)
const bracketTitlePattern = /^【[^】]+】/;

function isNewSectionStart(text: string): boolean {
  const trimmed = text.trim();
  
  // Skip if the line is too long (likely a regular paragraph)
  if (trimmed.length > 100) return false;
  
  // Check for markdown ## heading pattern at start
  if (markdownH2Pattern.test(trimmed)) {
    return true;
  }
  
  // Check for 第X章 chapter pattern at start
  if (chapterPattern.test(trimmed)) {
    return true;
  }
  
  // Check for 【...】 bracket pattern at start
  if (bracketTitlePattern.test(trimmed)) {
    return true;
  }
  
  return false;
}

// Style title with first word/character enlarged, all text bold
function styleTitle(title: string): string {
  if (!title.trim()) return title;
  
  // Check if starts with Chinese character
  const firstChar = title.trim()[0];
  const isChinese = /[\u4e00-\u9fff]/.test(firstChar);
  
  if (isChinese) {
    // For Chinese: first character enlarged, rest bold
    const rest = title.trim().slice(1);
    return `<span class="text-[1.2em] font-black">${firstChar}</span><span class="font-bold">${rest}</span>`;
  } else {
    // For English: first word enlarged, rest bold
    const words = title.trim().split(/\s+/);
    if (words.length > 1) {
      return `<span class="text-[1.2em] font-black">${words[0]}</span> <span class="font-bold">${words.slice(1).join(' ')}</span>`;
    }
    return `<span class="text-[1.2em] font-black">${words[0]}</span>`;
  }
}

// Apply bold styling to section keyword lines
function styleSectionKeywords(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const elements = Array.from(doc.body.children);
  
  for (const element of elements) {
    const textContent = element.textContent?.trim() || '';
    if (isNewSectionStart(textContent)) {
      // Make the entire element bold
      element.classList.add('font-bold');
      if (element.tagName.toLowerCase() === 'p') {
        const strong = doc.createElement('strong');
        strong.innerHTML = element.innerHTML;
        element.innerHTML = '';
        element.appendChild(strong);
      }
    }
  }
  
  return doc.body.innerHTML;
}

// Split a line with multiple table rows into separate rows
function splitTableRowsInLine(text: string): string[] {
  // This handles cases where multiple table rows are in a single line
  // e.g., "| A | B || C | D |" or "| A | B | | C | D |"
  
  // First, check if this looks like multiple rows combined
  // Pattern: content ends with | and then starts again with |
  // Split by patterns like "| |" or "||" that indicate row boundaries
  
  // More reliable: split by detecting where one row ends and another begins
  // A row typically ends with | followed by another | starting a new row
  const rows: string[] = [];
  
  // Split the text by <br> tags first (common in parsed HTML)
  const brParts = text.split(/<br\s*\/?>/gi);
  
  for (const part of brParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    
    // Check if this part contains multiple rows (multiple header-like patterns)
    // Count pairs of pipes that indicate columns
    const pipeCount = (trimmed.match(/\|/g) || []).length;
    
    if (pipeCount > 10) {
      // Likely multiple rows in one line
      // Try to split by finding row boundaries
      // A row boundary is typically where we have a cell ending and new cell header starting
      // e.g., "建議關鍵 || 紫微斗數" or "建議 | | 紫微"
      
      // Find the column structure from the first apparent row
      // Split by looking for patterns where content ends and a system name starts
      const systemKeywords = ['紫微斗數', '八字', '占星', '人類圖', '系統'];
      let currentPos = 0;
      let rowStart = 0;
      
      for (let i = 0; i < trimmed.length; i++) {
        for (const keyword of systemKeywords) {
          if (trimmed.substring(i).startsWith(`| ${keyword}`) || 
              trimmed.substring(i).startsWith(`|${keyword}`)) {
            // Check if this is not the very beginning
            if (i > 10) {
              // This is likely a new row
              const row = trimmed.substring(rowStart, i).trim();
              if (row && (row.match(/\|/g) || []).length >= 2) {
                rows.push(row);
              }
              rowStart = i;
            }
          }
        }
      }
      // Push remaining content
      const remaining = trimmed.substring(rowStart).trim();
      if (remaining && (remaining.match(/\|/g) || []).length >= 2) {
        rows.push(remaining);
      }
      
      // If splitting didn't work well, just use the original
      if (rows.length === 0) {
        rows.push(trimmed);
      }
    } else if (pipeCount >= 2) {
      rows.push(trimmed);
    }
  }
  
  return rows;
}

// Parse markdown tables in HTML content
function parseMarkdownTables(html: string): string {
  // First, handle the case where table content is all in one line or paragraph
  // This is common when Word/HTML preserves tables as pipe-separated text
  
  // Look for patterns like "| header1 | header2 | ... | headerN |" in the content
  // These need to be properly parsed even if on single lines
  
  // Split content by HTML block elements
  const lines = html.split(/(<\/?(?:p|div|br)[^>]*>|\n)/gi);
  const result: string[] = [];
  let tableRows: string[] = [];
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip empty lines and HTML tags
    if (!line.trim() || /^<\/?(?:p|div|br)[^>]*>$/i.test(line.trim())) {
      if (!inTable) {
        result.push(line);
      }
      continue;
    }
    
    // Remove HTML tags for content checking
    const textContent = line.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    
    // Check if this line contains table-like content
    const pipeCount = (textContent.match(/\|/g) || []).length;
    const hasTableContent = pipeCount >= 4; // At least a few pipes for table
    
    if (hasTableContent) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      
      // Split this line into individual rows if needed
      const extractedRows = splitTableRowsInLine(textContent);
      tableRows.push(...extractedRows);
    } else {
      if (inTable && tableRows.length > 0) {
        // End of table, convert collected rows
        result.push(convertToHtmlTable(tableRows));
        tableRows = [];
        inTable = false;
      }
      result.push(line);
    }
  }
  
  // Handle table at end of content
  if (inTable && tableRows.length > 0) {
    result.push(convertToHtmlTable(tableRows));
  }

  return result.join('');
}

// Convert markdown-style table rows to HTML table
function convertToHtmlTable(rows: string[]): string {
  if (rows.length === 0) return '';
  
  // Filter out separator rows (like |---|---|) but keep data rows
  const dataRows = rows.filter(row => !row.match(/^\|?\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?\s*$/));
  
  if (dataRows.length === 0) return '';

  // Determine the expected column count from the first row (header)
  const headerCells = dataRows[0].split('|')
    .map(cell => cell.trim())
    .filter(cell => cell.length > 0);
  
  const expectedColCount = headerCells.length;
  
  if (expectedColCount === 0) return '';

  let tableHtml = '<div class="table-wrapper"><table class="document-table"><thead><tr>';
  
  // Add header row
  headerCells.forEach(cell => {
    const parsedCell = cell
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>');
    tableHtml += `<th>${parsedCell}</th>`;
  });
  tableHtml += '</tr></thead>';
  
  // Add body rows
  if (dataRows.length > 1) {
    tableHtml += '<tbody>';
    
    for (let i = 1; i < dataRows.length; i++) {
      const row = dataRows[i];
      const cells = row.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0);
      
      if (cells.length === 0) continue;
      
      tableHtml += '<tr>';
      
      // Ensure we have the right number of columns
      for (let j = 0; j < expectedColCount; j++) {
        const cellContent = cells[j] || '';
        const parsedCell = cellContent
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/__(.+?)__/g, '<strong>$1</strong>');
        tableHtml += `<td>${parsedCell}</td>`;
      }
      
      tableHtml += '</tr>';
    }
    
    tableHtml += '</tbody>';
  }
  
  tableHtml += '</table></div>';
  return tableHtml;
}

// Wrap existing HTML tables with scrollable container (skip already wrapped ones)
function wrapTablesWithScroller(html: string): string {
  // Only wrap <table> elements that are NOT already inside a table-wrapper
  // Match tables that are NOT preceded by <div class="table-wrapper">
  return html.replace(/(?<!<div class="table-wrapper">)\s*<table(?![^>]*class="document-table")([^>]*)>/gi, '<div class="table-wrapper"><table$1>').replace(/<\/table>(?!\s*<\/div>)/gi, '</table></div>');
}

// Parse markdown in HTML content
function parseMarkdownInHtml(html: string): string {
  // First parse markdown tables
  let result = parseMarkdownTables(html);
  
  // Wrap all tables with scrollable container
  result = wrapTablesWithScroller(result);
  
  return result
    // Remove #### (4 consecutive hash marks) but keep the text
    .replace(/####\s*/g, '')
    // Bold: **text** or __text__
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic: *text* or _text_
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Headings: ### text (only at start of line)
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
}

// Check if element contains a heading as first child (nested heading)
function getNestedHeading(element: Element): Element | null {
  const firstChild = element.firstElementChild;
  if (!firstChild) return null;
  
  const tagName = firstChild.tagName.toLowerCase();
  if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
    return firstChild;
  }
  // Check if first child contains a heading (e.g., <strong><h2>...</h2></strong>)
  const nestedHeading = firstChild.querySelector('h1, h2, h3');
  return nestedHeading;
}

// Extract title text from element, cleaning up nested tags
function extractTitleText(element: Element): string {
  // Try to get text from nested heading first
  const nestedHeading = getNestedHeading(element);
  if (nestedHeading) {
    return nestedHeading.textContent?.trim() || '';
  }
  return element.textContent?.trim() || '';
}

// Parse HTML content into pages (each major section = 1 page)
function parseHtmlToPages(html: string, title: string): { title: string; styledTitle: string; content: string }[] {
  // First sanitize the HTML to prevent XSS
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ADD_TAGS: ['table', 'tr', 'td', 'th', 'thead', 'tbody'],
    ADD_ATTR: ['data-page-break', 'class'],
  });
  // Apply markdown parsing
  let processedHtml = parseMarkdownInHtml(sanitizedHtml);
  // Then apply section keyword styling
  processedHtml = styleSectionKeywords(processedHtml);
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(processedHtml, 'text/html');
  const elements = Array.from(doc.body.children);
  
  const pages: { title: string; styledTitle: string; content: string }[] = [];
  let currentPage = { title: title, styledTitle: styleTitle(title), content: '' };
  let isFirstPage = true;

  for (const element of elements) {
    const tagName = element.tagName.toLowerCase();
    const textContent = element.textContent?.trim() || '';
    
    // Check for page break marker
    if (element.getAttribute('data-page-break') === 'true' || 
        element.classList.contains('page-break')) {
      if (currentPage.content.trim()) {
        pages.push(currentPage);
      }
      currentPage = { 
        title: textContent || '新頁面',
        styledTitle: styleTitle(textContent || '新頁面'),
        content: element.outerHTML 
      };
      continue;
    }
    
    // Check if it's a direct heading tag
    const isDirectHeading = tagName === 'h1' || tagName === 'h2';
    
    // Check for nested heading inside paragraph or other elements
    const nestedHeading = getNestedHeading(element);
    const hasNestedHeading = nestedHeading !== null;
    
    // Check for keyword match in any element type
    const isKeywordMatch = isNewSectionStart(textContent);
    
    // Determine if this is a section break
    const isSectionBreak = isDirectHeading || hasNestedHeading || isKeywordMatch;
    
    if (isSectionBreak && !isFirstPage) {
      if (currentPage.content.trim()) {
        pages.push(currentPage);
      }
      
      // Extract the section title
      const sectionTitle = extractTitleText(element) || '章節';
      
      // Don't include the title element in content (avoid duplication)
      currentPage = { 
        title: sectionTitle,
        styledTitle: styleTitle(sectionTitle),
        content: '' 
      };
    } else {
      currentPage.content += element.outerHTML;
      isFirstPage = false;
    }
  }
  
  // Add the last page
  if (currentPage.content.trim()) {
    pages.push(currentPage);
  }

  // If no pages were created, return the whole content as one page
  if (pages.length === 0) {
    pages.push({ title, styledTitle: styleTitle(title), content: processedHtml });
  }

  return pages;
}

// Decorative patterns for backgrounds
const patterns = [
  'radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.08) 0%, transparent 50%)',
  'radial-gradient(circle at 80% 20%, hsl(var(--accent) / 0.12) 0%, transparent 50%)',
  'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.05) 0%, transparent 70%)',
];

export function PagedDocumentReader({ content, className, documentId, shareLink, isAdmin }: PagedDocumentReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const pages = useMemo(() => {
    if (content.htmlContent) {
      return parseHtmlToPages(content.htmlContent, content.title);
    }
    // Fallback for sections format
    if (content.sections) {
      return content.sections.map((section, idx) => ({
        title: section.type === 'heading' ? section.content : `段落 ${idx + 1}`,
        styledTitle: styleTitle(section.type === 'heading' ? section.content : `段落 ${idx + 1}`),
        content: `<p>${section.content}</p>`,
      }));
    }
    return [{ title: content.title, styledTitle: styleTitle(content.title), content: '' }];
  }, [content]);

  const goToPage = useCallback((page: number, direction?: 'left' | 'right') => {
    // Validate page range first
    if (page < 0 || page >= pages.length) return;
    // Skip if same page or already animating
    if (page === currentPage || isAnimating) return;
    
    // Determine direction based on page difference if not specified
    const dir = direction || (page > currentPage ? 'right' : 'left');
    setFlipDirection(dir);
    setIsAnimating(true);
    
    // Update page immediately
    setCurrentPage(page);
    
    // Stop audio when changing pages
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 450);
  }, [pages.length, currentPage, isAnimating]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      goToPage(currentPage + 1, 'right');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPage(currentPage - 1, 'left');
    }
  }, [currentPage, goToPage]);

  // Extract text from HTML for TTS
  const getPageText = useCallback((html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }, []);

  const toggleAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }

    const pageContent = pages[currentPage];
    const textToSpeak = getPageText(pageContent.content);
    
    if (!textToSpeak.trim()) {
      toast({
        title: "無法朗讀",
        description: "此頁沒有可朗讀的內容",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: textToSpeak.substring(0, 4000), 
          voice: 'onyx',
          documentId,
          pageIndex: currentPage,
        },
      });

      if (response.error) {
        let errorMessage = '語音合成失敗';
        if (response.error instanceof FunctionsHttpError) {
          const errorData = await response.error.context.json();
          console.error('Function returned an error', errorData);
          errorMessage = errorData?.error || errorMessage;
        } else {
          errorMessage = response.error.message;
        }
        throw new Error(errorMessage);
      }

      let audioUrl: string;
      const { audioContent, audioUrl: cachedUrl, cached } = response.data;
      
      if (cachedUrl) {
        // Use cached audio URL directly
        audioUrl = cachedUrl;
        if (cached) {
          console.log('Using cached audio from storage');
        } else {
          console.log('Audio generated and cached');
        }
      } else if (audioContent) {
        // Fallback: decode base64 audio
        const binaryString = atob(audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        audioUrl = URL.createObjectURL(audioBlob);
      } else {
        throw new Error('No audio content received');
      }
      
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
        // Only revoke if it's a blob URL (not a cached URL)
        if (audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
      };
      audio.onerror = () => {
        setIsPlaying(false);
        audioRef.current = null;
        toast({
          title: "播放失敗",
          description: "無法播放語音",
          variant: "destructive",
        });
      };
      
      audioRef.current = audio;
      await audio.play();
      setIsPlaying(true);
    } catch (error: unknown) {
      console.error('TTS error:', error);
      const errorMessage = error instanceof Error ? error.message : '語音合成失敗';
      toast({
        title: "語音錯誤",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const page = pages[currentPage];
  const patternIndex = currentPage % patterns.length;
  
  // Animation class based on flip direction
  const pageAnimationClass = flipDirection === 'right' 
    ? 'animate-page-flip-in-right' 
    : 'animate-page-flip-in-left';
  
  // Swipe gesture for mobile navigation
  const containerRef = useRef<HTMLDivElement>(null);
  const bind = useDrag(
    ({ movement: [mx], direction: [xDir], velocity: [vx], last, cancel }) => {
      // Only trigger on horizontal swipes with enough velocity
      if (last && Math.abs(mx) > 50 && vx > 0.2) {
        if (xDir < 0 && currentPage < pages.length - 1) {
          // Swipe left = next page
          goToPage(currentPage + 1, 'right');
        } else if (xDir > 0 && currentPage > 0) {
          // Swipe right = previous page
          goToPage(currentPage - 1, 'left');
        }
      }
    },
    { axis: 'x', filterTaps: true, threshold: 10 }
  );

  return (
    <div 
      ref={containerRef}
      {...bind()}
      className={cn("min-h-screen relative touch-pan-y", className)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Decorative Background with animation */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-700 ease-out"
        style={{ background: patterns[patternIndex] }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz4KPC9zdmc+')] opacity-40" />
      
      {/* Animated gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 animate-breathe"
        style={{ 
          background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.15) 0%, transparent 60%)',
        }}
      />
      
      {/* Header with Logos - optimized for mobile */}
      <div className="fixed top-3 sm:top-6 left-3 sm:left-6 right-3 sm:right-6 z-50 flex items-center justify-between pointer-events-none">
        {/* Left Logo - 超烜創意 */}
        <div className="pointer-events-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <OptimizedImage 
            src={logoChaoxuan} 
            alt="超烜創意" 
            className="h-8 sm:h-10 md:h-12 w-auto hover:scale-105 transition-transform duration-300 drop-shadow-md"
            priority
          />
        </div>
        
        {/* Page Counter */}
        <div className="pointer-events-auto bg-card/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-soft border border-border/50">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">
            {currentPage + 1} / {pages.length}
          </span>
        </div>
        
        {/* Right Logo - 虹靈御所 */}
        <div className="pointer-events-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <OptimizedImage 
            src={logoHongling} 
            alt="虹靈御所" 
            className="h-8 sm:h-10 md:h-12 w-auto hover:scale-105 transition-transform duration-300 drop-shadow-md"
            priority
          />
        </div>
      </div>

      {/* Admin Dashboard Button - Top Right below logo */}
      {isAdmin && (
        <div className="fixed top-14 sm:top-20 right-3 sm:right-6 z-50">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="bg-card/80 backdrop-blur-sm shadow-soft hover:scale-105 transition-transform text-xs sm:text-sm h-8 sm:h-9"
          >
            <Link to="/files">
              <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">返回主控台</span>
              <span className="sm:hidden">主控台</span>
            </Link>
          </Button>
        </div>
      )}

      {/* Bottom Left Controls - smaller on mobile */}
      <div className="fixed bottom-28 md:bottom-24 left-3 md:left-6 z-50 flex flex-col items-center gap-2 md:gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFeedbackDialog(true)}
          className="rounded-full w-10 h-10 md:w-14 md:h-14 bg-card/80 backdrop-blur-sm shadow-soft hover:scale-110 transition-transform"
          title="反饋意見"
        >
          <MessageSquare className="w-4 h-4 md:w-6 md:h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAudio}
          disabled={isLoading}
          className="rounded-full w-10 h-10 md:w-14 md:h-14 bg-card/80 backdrop-blur-sm shadow-soft hover:scale-110 transition-transform"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 md:w-6 md:h-6 animate-spin" />
          ) : isPlaying ? (
            <VolumeX className="w-4 h-4 md:w-6 md:h-6" />
          ) : (
            <Volume2 className="w-4 h-4 md:w-6 md:h-6" />
          )}
        </Button>
        {shareLink && (
          <Button
            variant="outline"
            size="icon"
            asChild
            className="rounded-full w-10 h-10 md:w-14 md:h-14 bg-card/80 backdrop-blur-sm shadow-soft hover:scale-110 transition-transform"
            title="列印 / 下載 PDF"
          >
            <Link to={`/print/${shareLink}`}>
              <Printer className="w-4 h-4 md:w-6 md:h-6" />
            </Link>
          </Button>
        )}
        {/* TOC Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowToc(!showToc)}
          className="rounded-full w-10 h-10 md:w-14 md:h-14 bg-card/80 backdrop-blur-sm shadow-soft hover:scale-110 transition-transform"
          title="章節目錄"
        >
          <List className="w-4 h-4 md:w-6 md:h-6" />
        </Button>
      </div>

      {/* Table of Contents Sidebar */}
      {showToc && (
        <div className="fixed inset-0 z-[60] md:inset-auto md:top-0 md:left-0 md:bottom-0 md:w-80">
          {/* Mobile overlay backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setShowToc(false)}
          />
          
          {/* TOC Panel */}
          <div className="absolute inset-x-4 top-16 bottom-20 md:inset-0 md:relative bg-card/95 backdrop-blur-md md:bg-card shadow-2xl md:shadow-xl border border-border/50 rounded-2xl md:rounded-none overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h3 className="font-serif font-bold text-lg text-primary">章節目錄</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowToc(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {pages.map((p, index) => (
                <button
                  key={index}
                  onClick={() => {
                    goToPage(index);
                    setShowToc(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-start gap-3 group",
                    currentPage === index
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50 text-foreground/80 hover:text-foreground"
                  )}
                >
                  <span className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    currentPage === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/20"
                  )}>
                    {index + 1}
                  </span>
                  <span className="text-sm leading-relaxed line-clamp-2">{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div 
        className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-20 sm:py-24 md:py-32 pb-40 sm:pb-44"
        style={{ perspective: '1200px' }}
      >
        {/* Page Title */}
        <header 
          className={cn("text-center", currentPage === 0 ? "mb-8 sm:mb-12 md:mb-16" : "mb-12 sm:mb-16 md:mb-20", pageAnimationClass)}
          key={`header-${currentPage}`}
        >
          {currentPage === 0 && (
            <div className="inline-block mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <span className="text-primary/60 text-[11px] tracking-[0.5em] uppercase font-sans border border-primary/20 px-4 py-1.5 rounded-full bg-primary/5">
                命理報告
              </span>
            </div>
          )}
          <h1 
            className="text-[26px] sm:text-[30px] md:text-[34px] lg:text-[38px] font-bold text-primary font-serif leading-[1.3] tracking-tight px-4"
          >
            {currentPage === 0 ? (
              <TypewriterText 
                text={page.title} 
                speed={100} 
                delay={600}
              />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: page.styledTitle }} />
            )}
          </h1>
          <div 
            className={cn(
              "flex items-center justify-center gap-5 mt-8 md:mt-10",
              currentPage === 0 ? "opacity-0 animate-fade-in" : ""
            )}
            style={currentPage === 0 ? { animationDelay: '2s', animationFillMode: 'forwards' } : {}}
          >
            <div className="w-20 md:w-28 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-primary/25" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary/40 animate-ping" />
            </div>
            <div className="w-20 md:w-28 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
        </header>

        {/* Cover Logo - only on first page */}
        {currentPage === 0 && (
          <div className="flex justify-center items-center my-12 md:my-20 lg:my-24 perspective-1000">
            <div className="relative animate-cover-reveal">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/30 to-primary/20 rounded-full blur-3xl animate-glow-pulse" />
              
              {/* Shimmer overlay */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-40 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s linear infinite',
                }}
              />
              
              {/* Main image with float animation */}
              <OptimizedImage 
                src={reportLogo} 
                alt="報告標誌" 
                className="relative z-10 w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 drop-shadow-2xl animate-float"
                priority
              />
            </div>
          </div>
        )}

        {/* Page Content Card */}
        <div 
          key={`content-${currentPage}`}
          className={cn(
            "relative",
            pageAnimationClass
          )}
          style={{ animationDelay: '0.08s' }}
        >
          {/* Content background card */}
          <div className="absolute -inset-6 sm:-inset-8 md:-inset-10 bg-card/40 backdrop-blur-sm rounded-3xl border border-border/20 shadow-lg -z-10" />
          
          {/* Decorative corner elements */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />
          
          <div 
            className="document-page-content font-serif text-foreground/90 leading-[2.0] sm:leading-[2.2] tracking-wide text-[18px] sm:text-[20px] md:text-[21px] lg:text-[22px]"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-5 md:pb-6 px-4">
        {/* Gradient backdrop for navigation */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
        
        <div className="relative flex items-center justify-center gap-3 md:gap-6">
          <Button
            variant="outline"
            size="default"
            onClick={() => goToPage(currentPage - 1, 'left')}
            disabled={currentPage === 0 || isAnimating}
            className="rounded-full bg-card/95 backdrop-blur-md shadow-elevated border-primary/20 px-4 md:px-8 py-5 md:py-6 transition-all duration-300 hover:scale-105 hover:shadow-glow hover:border-primary/40 active:scale-95 text-sm md:text-base group"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 transition-transform group-hover:-translate-x-1" />
            上一頁
          </Button>
          
          {/* Progress indicator - shows on all devices */}
          <div className="flex items-center gap-1.5 md:gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border/30">
            <span className="text-sm md:text-base font-medium text-primary">{currentPage + 1}</span>
            <span className="text-muted-foreground/60">/</span>
            <span className="text-sm md:text-base text-muted-foreground">{pages.length}</span>
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={() => goToPage(currentPage + 1, 'right')}
            disabled={currentPage === pages.length - 1 || isAnimating}
            className="rounded-full bg-card/95 backdrop-blur-md shadow-elevated border-primary/20 px-4 md:px-8 py-5 md:py-6 transition-all duration-300 hover:scale-105 hover:shadow-glow hover:border-primary/40 active:scale-95 text-sm md:text-base group"
          >
            下一頁
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-1.5 md:ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        
        {/* Copyright */}
        <div className="relative text-center mt-3 text-[10px] md:text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} MOMO CHAO / 超烜創意 / 虹靈御所 版權所有
        </div>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">反饋意見</DialogTitle>
            <DialogDescription>
              您對「{content.title}」有任何意見或建議嗎？
            </DialogDescription>
          </DialogHeader>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              if (!feedbackMessage.trim()) {
                toast({
                  title: "請輸入反饋內容",
                  variant: "destructive",
                });
                return;
              }
              
              setIsSendingFeedback(true);
              try {
                const { data, error } = await supabase.functions.invoke("submit-feedback", {
                  body: {
                    documentId: documentId,
                    documentTitle: content.title,
                    customerName: feedbackName.trim() || null,
                    message: feedbackMessage.trim(),
                  },
                });

                if (error) {
                  throw error;
                }
                
                toast({
                  title: "感謝您的反饋",
                  description: "您的意見已成功送出",
                });
                setShowFeedbackDialog(false);
                setFeedbackName("");
                setFeedbackMessage("");
              } catch (error: any) {
                console.error("Feedback submission error:", error);
                toast({
                  title: "發送失敗",
                  description: error.message || "請稍後再試",
                  variant: "destructive",
                });
              } finally {
                setIsSendingFeedback(false);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="feedback-name">您的姓名（選填）</Label>
              <Input
                id="feedback-name"
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                placeholder="請輸入姓名"
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-message">反饋內容 *</Label>
              <Textarea
                id="feedback-message"
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="請輸入您的意見或建議..."
                className="min-h-[120px] resize-none"
                maxLength={1000}
                required
              />
              <p className="text-xs text-muted-foreground text-right">
                {feedbackMessage.length}/1000
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFeedbackDialog(false)}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSendingFeedback} className="gap-2">
                {isSendingFeedback ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                發送反饋
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
