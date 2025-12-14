import mammoth from "mammoth";
import type { DocumentSection } from "@/components/DocumentEditor";

interface ParsedDocument {
  title: string;
  htmlContent: string;
  sections: DocumentSection[];
}

// Clean up extra punctuation and formatting issues
function cleanText(text: string): string {
  return text
    // Remove multiple consecutive punctuation
    .replace(/([。，、；：！？])\1+/g, '$1')
    // Remove spaces before punctuation
    .replace(/\s+([。，、；：！？）」』】])/g, '$1')
    // Remove spaces after opening brackets
    .replace(/([（「『【])\s+/g, '$1')
    // Clean up multiple spaces
    .replace(/\s{2,}/g, ' ')
    // Trim
    .trim();
}

// Parse HTML content into structured sections
function htmlToSections(html: string): DocumentSection[] {
  const sections: DocumentSection[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const elements = doc.body.children;

  let sectionId = 0;

  for (const element of Array.from(elements)) {
    const tagName = element.tagName.toLowerCase();
    const content = cleanText(element.textContent || '');
    
    if (!content) continue;

    if (tagName.match(/^h[1-6]$/)) {
      const level = parseInt(tagName.charAt(1));
      sections.push({
        id: `section-${sectionId++}`,
        type: 'heading',
        level: Math.min(level, 3),
        content,
      });
    } else if (tagName === 'blockquote') {
      sections.push({
        id: `section-${sectionId++}`,
        type: 'quote',
        content,
      });
    } else if (tagName === 'p' || tagName === 'div') {
      // Merge short paragraphs or treat as separate
      sections.push({
        id: `section-${sectionId++}`,
        type: 'paragraph',
        content,
      });
    } else if (tagName === 'ul' || tagName === 'ol') {
      // Convert list to paragraph with bullet points
      const items = Array.from(element.querySelectorAll('li'))
        .map(li => `• ${cleanText(li.textContent || '')}`)
        .join('\n');
      if (items) {
        sections.push({
          id: `section-${sectionId++}`,
          type: 'paragraph',
          content: items,
        });
      }
    }
  }

  return sections;
}

// Convert sections back to HTML for display
export function sectionsToHtml(sections: DocumentSection[]): string {
  return sections
    .map((section) => {
      const content = section.content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');

      switch (section.type) {
        case 'heading':
          const tag = `h${section.level || 2}`;
          return `<${tag}>${content}</${tag}>`;
        case 'quote':
          return `<blockquote>${content}</blockquote>`;
        case 'paragraph':
        default:
          return `<p>${content}</p>`;
      }
    })
    .join('\n');
}

export async function parseDocxFile(file: File): Promise<ParsedDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  
  // Extract title from filename (remove extension)
  const title = file.name.replace(/\.[^/.]+$/, "");
  
  // Parse HTML into sections
  const sections = htmlToSections(result.value);
  
  return {
    title,
    htmlContent: result.value,
    sections,
  };
}
