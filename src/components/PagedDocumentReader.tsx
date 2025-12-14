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
}

// Page break patterns
// Check if text contains ## (but NOT ###) - markdown heading level 2 only
const markdownH2Pattern = /(?<![#])##(?![#])\s+/;

// Check if text contains 第X章 pattern (chapter indicator)
const chapterPattern = /第\s*\d+\s*章/;

// Check if text contains 【...】 bracket pattern (section titles)
const bracketTitlePattern = /【[^】]+】/;

function isNewSectionStart(text: string): boolean {
  const trimmed = text.trim();
  
  // Skip if the line is too long (likely a regular paragraph)
  if (trimmed.length > 100) return false;
  
  // Check for markdown ## heading pattern
  if (markdownH2Pattern.test(trimmed)) {
    return true;
  }
  
  // Check for 第X章 chapter pattern
  if (chapterPattern.test(trimmed)) {
    return true;
  }
  
  // Check for 【...】 bracket pattern
  if (bracketTitlePattern.test(trimmed)) {
    return true;
  }
  
  return false;
}

// Style title with first word/character enlarged and colored
function styleTitle(title: string): string {
  if (!title.trim()) return title;
  
  // Check if starts with Chinese character
  const firstChar = title.trim()[0];
  const isChinese = /[\u4e00-\u9fff]/.test(firstChar);
  
  if (isChinese) {
    // For Chinese: first character enlarged
    const rest = title.trim().slice(1);
    return `<span class="text-primary text-[1.2em] font-black">${firstChar}</span>${rest}`;
  } else {
    // For English: first word enlarged
    const words = title.trim().split(/\s+/);
    if (words.length > 1) {
      return `<span class="text-primary text-[1.2em] font-black">${words[0]}</span> ${words.slice(1).join(' ')}`;
    }
    return `<span class="text-primary text-[1.2em] font-black">${words[0]}</span>`;
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
    
    // Start new page on H1, H2, H3, or keyword match
    const isHeading = tagName === 'h1' || tagName === 'h2' || tagName === 'h3';
    // Check for keyword match in any element type (not just p, strong, b)
    const isKeywordMatch = isNewSectionStart(textContent);
    
    if ((isHeading || isKeywordMatch) && !isFirstPage) {
      if (currentPage.content.trim()) {
        pages.push(currentPage);
      }
      currentPage = { 
        title: textContent || '章節',
        styledTitle: styleTitle(textContent || '章節'),
        content: element.outerHTML 
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

export function PagedDocumentReader({ content, className }: PagedDocumentReaderProps) {
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
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text: textToSpeak.substring(0, 4000), voice: 'onyx' },
      });

      if (error) {
        let errorMessage = '語音合成失敗';
        if (error instanceof FunctionsHttpError) {
          const errorData = await error.context.json();
          console.error('Function returned an error', errorData);
          errorMessage = errorData?.error || errorMessage;
        } else {
          errorMessage = error.message;
        }
        throw new Error(errorMessage);
      }

      const audioBlob = new Blob([data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
        URL.revokeObjectURL(audioUrl);
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
      // Create a container for the full document
      const container = document.createElement('div');
      container.style.width = '210mm';
      container.style.padding = '20mm';
      container.style.fontFamily = "'Noto Serif TC', Georgia, serif";
      container.style.fontSize = '12pt';
      container.style.lineHeight = '1.8';
      container.style.color = '#1a1a1a';
      container.style.backgroundColor = '#ffffff';

      // Add dual logos header
      const logoHeader = document.createElement('div');
      logoHeader.style.display = 'flex';
      logoHeader.style.justifyContent = 'space-between';
      logoHeader.style.alignItems = 'center';
      logoHeader.style.marginBottom = '30px';
      logoHeader.style.paddingBottom = '20px';
      logoHeader.style.borderBottom = '1px solid #d4a574';

      const leftLogo = document.createElement('img');
      leftLogo.src = logoChaoxuan;
      leftLogo.alt = '超烜創意';
      leftLogo.style.height = '50px';
      leftLogo.style.width = 'auto';
      
      const rightLogo = document.createElement('img');
      rightLogo.src = logoHongling;
      rightLogo.alt = '虹靈御所';
      rightLogo.style.height = '50px';
      rightLogo.style.width = 'auto';

      logoHeader.appendChild(leftLogo);
      logoHeader.appendChild(rightLogo);
      container.appendChild(logoHeader);

      // Add title
      const titleEl = document.createElement('h1');
      titleEl.textContent = content.title;
      titleEl.style.fontSize = '24pt';
      titleEl.style.fontWeight = 'bold';
      titleEl.style.textAlign = 'center';
      titleEl.style.marginBottom = '30px';
      titleEl.style.color = '#8b4513';
      container.appendChild(titleEl);

      // Add each page content
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        // Add section title
        if (i > 0) {
          const sectionTitle = document.createElement('h2');
          sectionTitle.textContent = page.title;
          sectionTitle.style.fontSize = '18pt';
          sectionTitle.style.fontWeight = 'bold';
          sectionTitle.style.marginTop = '40px';
          sectionTitle.style.marginBottom = '20px';
          sectionTitle.style.color = '#8b4513';
          sectionTitle.style.borderBottom = '2px solid #d4a574';
          sectionTitle.style.paddingBottom = '10px';
          container.appendChild(sectionTitle);
        }

        // Add content
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = page.content;
        
        // Style the content
        const paragraphs = contentDiv.querySelectorAll('p');
        paragraphs.forEach(p => {
          (p as HTMLElement).style.marginBottom = '12px';
          (p as HTMLElement).style.textIndent = '2em';
        });

        const headings = contentDiv.querySelectorAll('h1, h2, h3');
        headings.forEach(h => {
          (h as HTMLElement).style.color = '#8b4513';
          (h as HTMLElement).style.marginTop = '20px';
          (h as HTMLElement).style.marginBottom = '10px';
        });

        const images = contentDiv.querySelectorAll('img');
        images.forEach(img => {
          (img as HTMLElement).style.maxWidth = '100%';
          (img as HTMLElement).style.height = 'auto';
          (img as HTMLElement).style.margin = '20px auto';
          (img as HTMLElement).style.display = 'block';
        });

        container.appendChild(contentDiv);
      }

      // Append to body temporarily
      document.body.appendChild(container);

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${content.title}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true 
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: 'avoid-all' }
      };

      await html2pdf().set(opt).from(container).save();

      // Remove the temporary container
      document.body.removeChild(container);

      toast({
        title: "匯出成功",
        description: "PDF 檔案已下載",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "匯出失敗",
        description: "無法匯出 PDF，請重試",
        variant: "destructive",
      });
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

      {/* Bottom Left Controls */}
      <div className="fixed bottom-24 left-6 z-50 flex flex-col items-center gap-3">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="rounded-full bg-card/80 backdrop-blur-sm shadow-soft hover:scale-110 transition-transform"
        >
          <Link to="/">
            <Home className="w-5 h-5" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAudio}
          disabled={isLoading}
          className="rounded-full bg-card/80 backdrop-blur-sm shadow-soft hover:scale-110 transition-transform"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={exportToPdf}
          disabled={isExporting}
          className="rounded-full bg-card/80 backdrop-blur-sm shadow-soft hover:scale-110 transition-transform"
          title="匯出 PDF"
        >
          {isExporting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
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
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground font-serif leading-tight tracking-tight"
            dangerouslySetInnerHTML={{ __html: page.styledTitle }}
          />
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/30 animate-pulse" />
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
        </header>

        {/* Page Content */}
        <div 
          key={`content-${currentPage}`}
          className={cn(
            "document-page-content font-serif text-foreground/85 leading-[2.4] tracking-wide text-lg md:text-xl lg:text-2xl",
            pageAnimationClass
          )}
          style={{ animationDelay: '0.08s' }}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-8">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => goToPage(currentPage - 1, 'left')}
            disabled={currentPage === 0 || isAnimating}
            className="rounded-full bg-card/90 backdrop-blur-sm shadow-elevated border-border/50 px-6 transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            上一頁
          </Button>
          
          {/* Page Dots */}
          <div className="flex items-center gap-2 px-4">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToPage(idx)}
                disabled={isAnimating}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  idx === currentPage 
                    ? "bg-primary scale-125" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={() => goToPage(currentPage + 1, 'right')}
            disabled={currentPage === pages.length - 1 || isAnimating}
            className="rounded-full bg-card/90 backdrop-blur-sm shadow-elevated border-border/50 px-6 transition-all hover:scale-105 active:scale-95"
          >
            下一頁
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
