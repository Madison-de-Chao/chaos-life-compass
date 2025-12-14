import { DocumentContent, DocumentSection } from "@/types/document";
import { cn } from "@/lib/utils";

interface DocumentReaderProps {
  content: DocumentContent;
  className?: string;
}

export function DocumentReader({ content, className }: DocumentReaderProps) {
  const renderSection = (section: DocumentSection, index: number) => {
    const delay = Math.min(index * 0.1, 1);
    const baseClass = "animate-slide-up";
    const style = { animationDelay: `${delay}s`, opacity: 0 };

    switch (section.type) {
      case "heading":
        const HeadingTag = `h${section.level || 1}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          1: "text-3xl md:text-4xl font-bold mt-16 mb-6 text-foreground border-b border-border/50 pb-4",
          2: "text-2xl md:text-3xl font-semibold mt-12 mb-4 text-foreground",
          3: "text-xl md:text-2xl font-medium mt-8 mb-3 text-foreground/90",
        };
        return (
          <HeadingTag
            key={section.id}
            className={cn(headingClasses[section.level as 1 | 2 | 3] || headingClasses[1], baseClass)}
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
        {content.sections.map((section, index) => renderSection(section, index))}
      </div>
    </article>
  );
}
