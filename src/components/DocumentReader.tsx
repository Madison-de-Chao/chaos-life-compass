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
            prose-headings:font-serif prose-headings:text-foreground
            prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:font-bold prose-h1:mt-12 prose-h1:mb-6 prose-h1:border-b prose-h1:border-border/50 prose-h1:pb-4
            prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:md:text-2xl prose-h3:font-medium prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-lg prose-p:md:text-xl prose-p:leading-relaxed prose-p:text-foreground/85 prose-p:mb-6 prose-p:font-serif
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-lg prose-li:text-foreground/85 prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-primary/60 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:bg-accent/30 prose-blockquote:rounded-r-lg prose-blockquote:italic
            prose-table:my-8 prose-table:w-full prose-table:border-collapse
            prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-border
            prose-td:p-3 prose-td:border prose-td:border-border
            prose-img:rounded-xl prose-img:shadow-soft prose-img:my-8
            prose-a:text-primary prose-a:underline prose-a:underline-offset-4"
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
