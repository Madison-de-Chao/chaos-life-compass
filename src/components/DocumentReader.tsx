import { cn } from "@/lib/utils";

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

export function DocumentReader({ content, className }: DocumentReaderProps) {
  // If we have HTML content (from mammoth), render it directly
  if (content.htmlContent) {
    return (
      <article className={cn("max-w-3xl mx-auto", className)}>
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-serif leading-tight">
            {content.title}
          </h1>
          <div className="w-24 h-1 bg-primary/60 mx-auto rounded-full" />
        </header>

        <div 
          className="prose prose-lg max-w-none animate-fade-in
            prose-headings:font-serif prose-headings:text-foreground prose-headings:tracking-tight
            prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:lg:text-5xl prose-h1:font-bold prose-h1:mt-16 prose-h1:mb-8 prose-h1:border-b-2 prose-h1:border-primary/30 prose-h1:pb-6 prose-h1:text-primary
            prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:font-semibold prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-foreground prose-h2:relative prose-h2:pl-4 prose-h2:border-l-4 prose-h2:border-primary/50
            prose-h3:text-xl prose-h3:md:text-2xl prose-h3:font-medium prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-foreground/90
            prose-h4:text-lg prose-h4:md:text-xl prose-h4:font-medium prose-h4:mt-8 prose-h4:mb-3 prose-h4:text-primary/80
            prose-p:text-base prose-p:md:text-lg prose-p:lg:text-xl prose-p:leading-loose prose-p:text-foreground/80 prose-p:mb-6 prose-p:font-serif prose-p:tracking-wide
            prose-strong:text-primary prose-strong:font-bold
            prose-em:text-foreground/90 prose-em:font-serif prose-em:not-italic prose-em:border-b prose-em:border-primary/30
            prose-ul:my-8 prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-3
            prose-ol:my-8 prose-ol:list-decimal prose-ol:pl-8 prose-ol:space-y-3
            prose-li:text-base prose-li:md:text-lg prose-li:text-foreground/80 prose-li:pl-6 prose-li:relative prose-li:before:content-['◆'] prose-li:before:absolute prose-li:before:left-0 prose-li:before:text-primary/60 prose-li:before:text-sm
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-8 prose-blockquote:py-6 prose-blockquote:my-10 prose-blockquote:bg-gradient-to-r prose-blockquote:from-accent/40 prose-blockquote:to-transparent prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-foreground/70 prose-blockquote:font-serif prose-blockquote:text-lg
            prose-table:my-10 prose-table:w-full prose-table:border-collapse prose-table:rounded-xl prose-table:overflow-hidden prose-table:shadow-soft
            prose-th:bg-primary/10 prose-th:p-4 prose-th:text-left prose-th:border prose-th:border-border/50 prose-th:font-semibold prose-th:text-foreground
            prose-td:p-4 prose-td:border prose-td:border-border/30 prose-td:text-foreground/80
            prose-img:rounded-2xl prose-img:shadow-soft prose-img:my-10
            prose-a:text-primary prose-a:font-medium prose-a:underline prose-a:underline-offset-4 prose-a:decoration-primary/50 hover:prose-a:decoration-primary
            prose-hr:my-12 prose-hr:border-t-2 prose-hr:border-primary/20"
          dangerouslySetInnerHTML={{ __html: content.htmlContent }}
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
