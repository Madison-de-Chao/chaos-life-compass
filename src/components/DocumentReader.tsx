import { cn } from "@/lib/utils";
import { useMemo } from "react";
import DOMPurify from "dompurify";

interface DocumentReaderProps {
  content: {
    title: string;
    htmlContent?: string;
    sections?: Array<{
      id: string;
      type: string;
      level?: number;
      content: string;
      imageUrl?: string;
    }>;
  };
  className?: string;
}

// Clean up extra punctuation and formatting issues
function cleanHtmlContent(html: string): string {
  return html
    // Remove multiple consecutive punctuation
    .replace(/([。，、；：！？])\1+/g, '$1')
    // Remove spaces before punctuation
    .replace(/\s+([。，、；：！？）」』】])/g, '$1')
    // Remove spaces after opening brackets
    .replace(/([（「『【])\s+/g, '$1')
    // Clean up multiple line breaks
    .replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>')
    // Remove empty paragraphs
    .replace(/<p>\s*<\/p>/gi, '')
    // Clean up multiple spaces
    .replace(/\s{2,}/g, ' ')
    // Remove lonely punctuation paragraphs
    .replace(/<p>\s*[。，、；：！？]\s*<\/p>/gi, '');
}

export function DocumentReader({ content, className }: DocumentReaderProps) {
  const cleanedHtml = useMemo(() => {
    if (content.htmlContent) {
      const cleaned = cleanHtmlContent(content.htmlContent);
      // Sanitize HTML to prevent XSS attacks
      return DOMPurify.sanitize(cleaned, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                       'table', 'tr', 'td', 'th', 'thead', 'tbody', 'blockquote', 
                       'ul', 'ol', 'li', 'a', 'span', 'div', 'img', 'figure', 'figcaption'],
        ALLOWED_ATTR: ['class', 'style', 'href', 'target', 'src', 'alt', 'data-page-break'],
        ALLOW_DATA_ATTR: true
      });
    }
    return '';
  }, [content.htmlContent]);

  // If we have HTML content (from mammoth), render it directly
  if (content.htmlContent) {
    return (
      <article className={cn("max-w-4xl mx-auto px-4 md:px-8", className)}>
        <header className="text-center mb-20 animate-fade-in pt-8">
          <div className="inline-block mb-6">
            <span className="text-primary/60 text-sm tracking-[0.3em] uppercase font-sans">命理報告</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 font-serif leading-tight tracking-tight">
            {content.title}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
        </header>

        <div 
          className="document-content animate-fade-in font-serif text-foreground/85 leading-[2.2] tracking-wide text-base md:text-lg"
          dangerouslySetInnerHTML={{ __html: cleanedHtml }}
        />
      </article>
    );
  }

  // Fallback for old structured content format
  const renderSection = (section: any, index: number) => {
    const delay = Math.min(index * 0.1, 1);
    const baseClass = "animate-slide-up";
    const style = { animationDelay: `${delay}s`, opacity: 0 };

    switch (section.type) {
      case "heading":
        const HeadingTag = `h${section.level || 1}` as keyof JSX.IntrinsicElements;
        const headingClasses: Record<number, string> = {
          1: "text-3xl md:text-4xl font-bold mt-16 mb-6 text-foreground border-b border-border/50 pb-4",
          2: "text-2xl md:text-3xl font-semibold mt-12 mb-4 text-foreground",
          3: "text-xl md:text-2xl font-medium mt-8 mb-3 text-foreground/90",
        };
        return (
          <HeadingTag
            key={section.id}
            className={cn(headingClasses[section.level as number] || headingClasses[1], baseClass)}
            style={style}
          >
            {section.content}
          </HeadingTag>
        );

      case "paragraph":
        return (
          <p
            key={section.id}
            className={cn(
              "text-lg md:text-xl leading-relaxed text-foreground/85 mb-6 font-serif",
              baseClass
            )}
            style={style}
          >
            {section.content}
          </p>
        );

      case "quote":
        return (
          <blockquote
            key={section.id}
            className={cn(
              "border-l-4 border-primary/60 pl-6 py-4 my-8 bg-accent/30 rounded-r-lg italic text-lg text-foreground/80 font-serif",
              baseClass
            )}
            style={style}
          >
            {section.content}
          </blockquote>
        );

      case "image":
        return (
          <figure
            key={section.id}
            className={cn("my-8", baseClass)}
            style={style}
          >
            <img
              src={section.imageUrl}
              alt={section.content}
              className="w-full rounded-xl shadow-soft"
            />
            {section.content && (
              <figcaption className="text-center text-muted-foreground mt-3 text-sm">
                {section.content}
              </figcaption>
            )}
          </figure>
        );

      default:
        return (
          <p key={section.id} className={cn("mb-4", baseClass)} style={style}>
            {section.content}
          </p>
        );
    }
  };

  return (
    <article className={cn("prose-reading max-w-3xl mx-auto", className)}>
      <header className="text-center mb-16 animate-fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-serif leading-tight">
          {content.title}
        </h1>
        <div className="w-24 h-1 bg-primary/60 mx-auto rounded-full" />
      </header>

      <div className="space-y-2">
        {content.sections?.map((section, index) => renderSection(section, index))}
      </div>
    </article>
  );
}
