import { useState, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Loader2, Home } from "lucide-react";
import { supabase, FunctionsHttpError } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

// Chinese section keywords that indicate a new page
const sectionKeywords = [
  /^第[一二三四五六七八九十百千]+[章節篇部回]/,  // 第一章、第二節
  /^[壹貳參肆伍陸柒捌玖拾][\s、．.]/,           // 壹、貳、
  /^[一二三四五六七八九十]+[\s、．.]/,           // 一、二、
  /^[（(][一二三四五六七八九十壹貳參肆伍陸柒捌玖拾]+[）)]/,  // (一)、（二）
  /^[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ][\s、．.]/,                // Ⅰ、Ⅱ、
  // Custom section titles for astrological reports
  /^開場自序/,
  /^使用說明/,
  /^基本資料/,
  /^人生羅盤/,
  /^內在個性/,
  /^外在性格/,
  /^思考方式/,
  /^行事風格/,
  /^事業解析/,
  /^愛情解析/,
  /^金錢解析/,
  /^特別注意/,
  /^各系統特殊提醒/,
  /^圓滿的你/,
  /^你為什麼需要默默超思維/,
  /^結語大總結/,
  /^Bonus[：:]/,  // Matches Bonus: or Bonus：
  /^完成註記/,
];

function isNewSectionStart(text: string): boolean {
  const trimmed = text.trim();
  return sectionKeywords.some(regex => regex.test(trimmed));
}

// Parse HTML content into pages (each major section = 1 page)
function parseHtmlToPages(html: string, title: string): { title: string; content: string }[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const elements = Array.from(doc.body.children);
  
  const pages: { title: string; content: string }[] = [];
  let currentPage = { title: title, content: '' };
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
        content: element.outerHTML 
      };
      continue;
    }
    
    // Start new page on H1, H2, H3, or keyword match
    const isHeading = tagName === 'h1' || tagName === 'h2' || tagName === 'h3';
    const isKeywordMatch = (tagName === 'p' || tagName === 'strong' || tagName === 'b') && 
                           isNewSectionStart(textContent);
    
    if ((isHeading || isKeywordMatch) && !isFirstPage) {
      if (currentPage.content.trim()) {
        pages.push(currentPage);
      }
      currentPage = { 
        title: textContent || '章節',
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
    pages.push({ title, content: html });
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
        content: `<p>${section.content}</p>`,
      }));
    }
    return [{ title: content.title, content: '' }];
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
      
      {/* Page Counter */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft border border-border/50">
        <span className="text-sm font-medium text-muted-foreground">
          {currentPage + 1} / {pages.length}
        </span>
      </div>

      {/* Top Controls */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-3">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="rounded-full bg-card/80 backdrop-blur-sm shadow-soft"
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
          className="rounded-full bg-card/80 backdrop-blur-sm shadow-soft"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground font-serif leading-tight tracking-tight">
            {page.title}
          </h1>
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
