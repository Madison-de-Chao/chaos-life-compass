import { useState, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Loader2, Home, Download } from "lucide-react";
import { supabase, FunctionsHttpError } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";
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

// Parse markdown tables in HTML content
function parseMarkdownTables(html: string): string {
  // Split content by line to find table patterns
  const lines = html.split('\n');
  const result: string[] = [];
  let tableLines: string[] = [];
  let inTable = false;
  let pendingEmptyLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if line contains pipe-separated content (table row)
    // Remove HTML tags and &nbsp; for checking
    const trimmed = line.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    const isTableRow = trimmed.includes('|') && (trimmed.match(/\|/g) || []).length >= 2;
    
    // Check if line is empty or just whitespace/nbsp
    const isEmptyLine = trimmed === '' || /^[\s ]*$/.test(trimmed);
    
    if (isTableRow) {
      if (!inTable) {
        inTable = true;
        tableLines = [];
        pendingEmptyLines = [];
      }
      // Discard pending empty lines within table
      pendingEmptyLines = [];
      tableLines.push(trimmed);
    } else if (inTable && isEmptyLine) {
      // If we're in a table and hit an empty line, keep it pending
      // (don't break the table yet, might be spacing between rows)
      pendingEmptyLines.push(line);
    } else {
      if (inTable && tableLines.length > 0) {
        // Convert collected table lines to HTML table
        result.push(convertToHtmlTable(tableLines));
        tableLines = [];
        inTable = false;
        // Add any pending empty lines after the table
        result.push(...pendingEmptyLines);
        pendingEmptyLines = [];
      }
      result.push(line);
    }
  }
  
  // Handle table at end of content
  if (inTable && tableLines.length > 0) {
    result.push(convertToHtmlTable(tableLines));
  }

  return result.join('\n');
}

// Convert markdown-style table rows to HTML table
function convertToHtmlTable(rows: string[]): string {
  if (rows.length === 0) return '';
  
  // Filter out separator rows (like |---|---|)
  const dataRows = rows.filter(row => !row.match(/^\|?\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?\s*$/));
  
  if (dataRows.length === 0) return '';

  let tableHtml = '<table class="document-table">';
  
  dataRows.forEach((row, index) => {
    // Split by | and clean up
    const cells = row.split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0);
    
    if (cells.length === 0) return;
    
    const isHeader = index === 0;
    const cellTag = isHeader ? 'th' : 'td';
    const rowClass = isHeader ? 'table-header' : '';
    
    tableHtml += `<tr class="${rowClass}">`;
    cells.forEach(cell => {
      // Parse bold text in cells
      const parsedCell = cell
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.+?)__/g, '<strong>$1</strong>');
      tableHtml += `<${cellTag}>${parsedCell}</${cellTag}>`;
    });
    tableHtml += '</tr>';
  });
  
  tableHtml += '</table>';
  return tableHtml;
}

// Parse markdown in HTML content
function parseMarkdownInHtml(html: string): string {
  // First parse tables
  let result = parseMarkdownTables(html);
  
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

// Parse HTML content into pages (each major section = 1 page)
function parseHtmlToPages(html: string, title: string): { title: string; styledTitle: string; content: string }[] {
  // First apply markdown parsing
  let processedHtml = parseMarkdownInHtml(html);
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
    
    const isHeading = tagName === 'h1' || tagName === 'h2';
    // Check for keyword match in any element type (not just p, strong, b)
    const isKeywordMatch = isNewSectionStart(textContent);
    
    if ((isHeading || isKeywordMatch) && !isFirstPage) {
      if (currentPage.content.trim()) {
        pages.push(currentPage);
      }
      // Don't include the title element in content (avoid duplication)
      currentPage = { 
        title: textContent || '章節',
        styledTitle: styleTitle(textContent || '章節'),
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

export function PagedDocumentReader({ content, className, documentId }: PagedDocumentReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
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
    if (page >= 0 && page < pages.length && !isAnimating) {
      // Determine direction based on page difference if not specified
      const dir = direction || (page > currentPage ? 'right' : 'left');
      setFlipDirection(dir);
      setIsAnimating(true);
      
      // Small delay for exit animation
      setTimeout(() => {
        setCurrentPage(page);
        // Stop audio when changing pages
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
          setIsPlaying(false);
        }
        // Reset animation state after enter animation
        setTimeout(() => setIsAnimating(false), 400);
      }, 50);
    }
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

  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = async () => {
    setIsExporting(true);
    try {
      // Create a container for the full document - must be visible for html2canvas
      const container = document.createElement('div');
      container.id = 'pdf-export-container';
      container.style.width = '794px'; // A4 width at 96dpi
      container.style.padding = '40px';
      container.style.fontFamily = "'Noto Serif TC', Georgia, serif";
      container.style.fontSize = '14px';
      container.style.lineHeight = '1.8';
      container.style.color = '#1a1a1a';
      container.style.backgroundColor = '#ffffff';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.zIndex = '-1';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';

      // Add dual logos header
      const logoHeader = document.createElement('div');
      logoHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #d4a574;';

      const leftLogo = document.createElement('img');
      leftLogo.src = logoChaoxuan;
      leftLogo.alt = '超烜創意';
      leftLogo.style.cssText = 'height: 50px; width: auto;';
      leftLogo.crossOrigin = 'anonymous';
      
      const rightLogo = document.createElement('img');
      rightLogo.src = logoHongling;
      rightLogo.alt = '虹靈御所';
      rightLogo.style.cssText = 'height: 50px; width: auto;';
      rightLogo.crossOrigin = 'anonymous';

      logoHeader.appendChild(leftLogo);
      logoHeader.appendChild(rightLogo);
      container.appendChild(logoHeader);

      // Add title
      const titleEl = document.createElement('h1');
      titleEl.textContent = content.title;
      titleEl.style.cssText = 'font-size: 28px; font-weight: bold; text-align: center; margin-bottom: 30px; color: #8b4513;';
      container.appendChild(titleEl);

      // Collect all content from pages
      let hasContent = false;
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        // Add section title for pages after the first
        if (i > 0 && page.title) {
          const sectionTitle = document.createElement('h2');
          sectionTitle.textContent = page.title;
          sectionTitle.style.cssText = 'font-size: 20px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #8b4513; border-bottom: 2px solid #d4a574; padding-bottom: 8px;';
          container.appendChild(sectionTitle);
        }

        // Add content
        if (page.content && page.content.trim()) {
          hasContent = true;
          const contentDiv = document.createElement('div');
          contentDiv.innerHTML = page.content;
          
          // Style all paragraphs
          contentDiv.querySelectorAll('p').forEach(p => {
            (p as HTMLElement).style.cssText = 'margin-bottom: 10px; text-indent: 2em; color: #1a1a1a;';
          });

          // Style headings
          contentDiv.querySelectorAll('h1, h2, h3').forEach(h => {
            (h as HTMLElement).style.cssText = 'color: #8b4513; margin-top: 15px; margin-bottom: 10px;';
          });

          // Style strong/bold text
          contentDiv.querySelectorAll('strong, b').forEach(el => {
            (el as HTMLElement).style.cssText = 'color: #d35400; font-weight: bold;';
          });

          // Style images
          contentDiv.querySelectorAll('img').forEach(img => {
            (img as HTMLElement).style.cssText = 'max-width: 100%; height: auto; margin: 15px auto; display: block;';
            (img as HTMLImageElement).crossOrigin = 'anonymous';
          });

          container.appendChild(contentDiv);
        }
      }

      // If no content, add placeholder
      if (!hasContent) {
        const placeholder = document.createElement('p');
        placeholder.textContent = '此報告無內容';
        placeholder.style.cssText = 'text-align: center; color: #666; margin-top: 50px;';
        container.appendChild(placeholder);
      }

      // Add copyright footer
      const copyrightFooter = document.createElement('div');
      copyrightFooter.style.cssText = 'margin-top: 40px; padding-top: 15px; border-top: 1px solid #d4a574; text-align: center; font-size: 11px; color: #666666;';
      copyrightFooter.textContent = `© ${new Date().getFullYear()} MOMO CHAO / 超烜創意 / 虹靈御所 版權所有`;
      container.appendChild(copyrightFooter);

      // Append to body
      document.body.appendChild(container);

      // Make container visible for html2canvas
      container.style.opacity = '1';
      container.style.zIndex = '9999';

      // Wait for images to load
      const allImages = container.querySelectorAll('img');
      if (allImages.length > 0) {
        await Promise.all(
          Array.from(allImages).map(img => {
            if ((img as HTMLImageElement).complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          })
        );
      }

      // Give browser time to render
      await new Promise(resolve => setTimeout(resolve, 300));

      const opt = {
        margin: 10,
        filename: `${content.title}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: true, // Enable logging for debugging
          backgroundColor: '#ffffff',
          windowWidth: 794
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      console.log('Starting PDF export with', pages.length, 'pages');
      console.log('Container has content:', container.innerHTML.length, 'characters');

      await html2pdf().set(opt).from(container).save();

      // Clean up
      document.body.removeChild(container);

      toast({
        title: "匯出成功",
        description: "PDF 檔案已下載",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "匯出失敗",
        description: `無法匯出 PDF: ${error instanceof Error ? error.message : '未知錯誤'}`,
        variant: "destructive",
      });
      // Try to clean up container if it exists
      const existingContainer = document.getElementById('pdf-export-container');
      if (existingContainer) {
        document.body.removeChild(existingContainer);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const page = pages[currentPage];
  const patternIndex = currentPage % patterns.length;
  
  // Animation class based on flip direction
  const pageAnimationClass = flipDirection === 'right' 
    ? 'animate-page-flip-in-right' 
    : 'animate-page-flip-in-left';

  return (
    <div 
      className={cn("min-h-screen relative", className)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Decorative Background */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{ background: patterns[patternIndex] }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz4KPC9zdmc+')] opacity-50" />
      
      {/* Header with Logos */}
      <div className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-none">
        {/* Left Logo - 超烜創意 */}
        <div className="pointer-events-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <img 
            src={logoChaoxuan} 
            alt="超烜創意" 
            className="h-10 md:h-12 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
          />
        </div>
        
        {/* Page Counter */}
        <div className="pointer-events-auto bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft border border-border/50">
          <span className="text-sm font-medium text-muted-foreground">
            {currentPage + 1} / {pages.length}
          </span>
        </div>
        
        {/* Right Logo - 虹靈御所 */}
        <div className="pointer-events-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <img 
            src={logoHongling} 
            alt="虹靈御所" 
            className="h-10 md:h-12 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
          />
        </div>
      </div>

      {/* Bottom Left Controls - smaller on mobile */}
      <div className="fixed bottom-28 md:bottom-24 left-3 md:left-6 z-50 flex flex-col items-center gap-2 md:gap-4">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="rounded-full w-10 h-10 md:w-14 md:h-14 bg-card/80 backdrop-blur-sm shadow-soft hover:scale-110 transition-transform"
        >
          <Link to="/">
            <Home className="w-4 h-4 md:w-6 md:h-6" />
          </Link>
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
        <Button
          variant="outline"
          size="icon"
          onClick={exportToPdf}
          disabled={isExporting}
          className="rounded-full w-10 h-10 md:w-14 md:h-14 bg-card/80 backdrop-blur-sm shadow-soft hover:scale-110 transition-transform"
          title="匯出 PDF"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 md:w-6 md:h-6 animate-spin" />
          ) : (
            <Download className="w-4 h-4 md:w-6 md:h-6" />
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div 
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-32"
        style={{ perspective: '1200px' }}
      >
        {/* Page Title */}
        <header 
          className={cn("text-center mb-16", pageAnimationClass)}
          key={`header-${currentPage}`}
        >
          {currentPage === 0 && (
            <div className="inline-block mb-4">
              <span className="text-primary/70 text-xs tracking-[0.4em] uppercase font-sans">
                命理報告
              </span>
            </div>
          )}
          <h1 
            className="text-[28px] md:text-[30px] lg:text-[32px] font-bold text-primary font-serif leading-tight tracking-tight"
            dangerouslySetInnerHTML={{ __html: page.styledTitle }}
          />
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/30 animate-pulse" />
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
        </header>

        {/* Cover Logo - only on first page */}
        {currentPage === 0 && (
          <div className="flex justify-center items-center my-16 md:my-24 perspective-1000">
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
              <img 
                src={reportLogo} 
                alt="報告標誌" 
                className="relative z-10 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl animate-float"
                style={{
                  filter: 'drop-shadow(0 20px 40px hsl(var(--primary) / 0.25))',
                }}
              />
            </div>
          </div>
        )}

        {/* Page Content */}
        <div 
          key={`content-${currentPage}`}
          className={cn(
            "document-page-content font-serif text-foreground/85 leading-[2.1] tracking-wide text-[20px] md:text-[21px] lg:text-[22px]",
            pageAnimationClass
          )}
          style={{ animationDelay: '0.08s' }}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-6 md:pb-8 px-4">
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <Button
            variant="outline"
            size="default"
            onClick={() => goToPage(currentPage - 1, 'left')}
            disabled={currentPage === 0 || isAnimating}
            className="rounded-full bg-card/90 backdrop-blur-sm shadow-elevated border-border/50 px-3 md:px-6 transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
            上一頁
          </Button>
          
          {/* Page Dots - hide on mobile when too many pages */}
          <div className="hidden md:flex items-center gap-2 px-4 max-w-xs overflow-x-auto">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToPage(idx)}
                disabled={isAnimating}
                className={cn(
                  "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 flex-shrink-0",
                  idx === currentPage 
                    ? "bg-primary scale-125" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={() => goToPage(currentPage + 1, 'right')}
            disabled={currentPage === pages.length - 1 || isAnimating}
            className="rounded-full bg-card/90 backdrop-blur-sm shadow-elevated border-border/50 px-3 md:px-6 transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
          >
            下一頁
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2" />
          </Button>
        </div>
        
        {/* Copyright */}
        <div className="text-center mt-4 text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} MOMO CHAO / 超烜創意 / 虹靈御所 版權所有
        </div>
      </div>
    </div>
  );
}
