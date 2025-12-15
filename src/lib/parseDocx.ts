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
// Merge consecutive paragraphs until encountering a sentence-ending punctuation (。)
function htmlToSections(html: string): DocumentSection[] {
  const sections: DocumentSection[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const elements = doc.body.children;

  let sectionId = 0;
  let pendingParagraph = ''; // Buffer for merging paragraphs

  // Helper to flush pending paragraph content
  const flushParagraph = () => {
    if (pendingParagraph.trim()) {
      sections.push({
        id: `section-${sectionId++}`,
        type: 'paragraph',
        content: pendingParagraph.trim(),
      });
      pendingParagraph = '';
    }
  };

  for (const element of Array.from(elements)) {
    const tagName = element.tagName.toLowerCase();
    const content = cleanText(element.textContent || '');
    
    if (!content) continue;

    if (tagName.match(/^h[1-6]$/)) {
      // Flush any pending paragraph before heading
      flushParagraph();
      
      const level = parseInt(tagName.charAt(1));
      sections.push({
        id: `section-${sectionId++}`,
        type: 'heading',
        level: Math.min(level, 3),
        content,
      });
    } else if (tagName === 'blockquote') {
      // Flush any pending paragraph before blockquote
      flushParagraph();
      
      sections.push({
        id: `section-${sectionId++}`,
        type: 'quote',
        content,
      });
    } else if (tagName === 'p' || tagName === 'div') {
      // Accumulate paragraph content
      if (pendingParagraph) {
        pendingParagraph += '\n' + content;
      } else {
        pendingParagraph = content;
      }
      
      // Only flush when content ends with sentence-ending punctuation (。！？)
      if (/[。！？]$/.test(content)) {
        flushParagraph();
      }
    } else if (tagName === 'ul' || tagName === 'ol') {
      // Flush any pending paragraph before list
      flushParagraph();
      
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

  // Flush any remaining content
  flushParagraph();

  return sections;
}

// Parse markdown-like syntax
function parseMarkdown(text: string): string {
  return text
    // Bold: **text** or __text__
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic: *text* or _text_
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Headings: ### text
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
}

// Generate disclaimer HTML
function generateDisclaimer(): string {
  const year = new Date().getFullYear();
  return `
<div class="document-disclaimer" data-system-generated="true">
  <hr />
  <p><strong>免責聲明</strong></p>
  <p>本報告內容僅供個人參考使用，不構成任何形式的專業建議（包括但不限於醫療、法律、財務或心理諮詢）。報告中的分析與解讀基於命理學原理，旨在提供自我探索的參考方向，實際情況可能因個人選擇、環境變化及多重因素而有所不同。</p>
  <p>本報告為付費授權內容，僅供購買者本人閱讀使用。未經書面授權，禁止以任何形式轉載、複製、傳播或用於商業用途。</p>
  <p>© ${year} MOMO CHAO / 超烜創意 / 虹靈御所 版權所有</p>
</div>`;
}

// Generate version metadata HTML
function generateVersionMeta(version?: number): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const versionNum = version || 1;
  
  return `
<div class="document-version-meta" data-system-generated="true" data-version="${versionNum}">
  <p class="version-info">版本 ${versionNum}.0 ・ 完成於 ${dateStr} ${timeStr}</p>
</div>`;
}

// Convert sections back to HTML for display
export function sectionsToHtml(sections: DocumentSection[], options?: { includeSystemMeta?: boolean; version?: number }): string {
  const includeSystemMeta = options?.includeSystemMeta !== false; // Default to true
  
  const contentHtml = sections
    .map((section) => {
      // Handle page break
      if (section.type === 'pagebreak') {
        return `<div class="page-break" data-page-break="true"></div>`;
      }

      // Handle image
      if (section.type === 'image' && section.imageUrl) {
        return `<figure class="document-image"><img src="${section.imageUrl}" alt="${section.content || '圖片'}" />${section.content ? `<figcaption>${section.content}</figcaption>` : ''}</figure>`;
      }

      let content = section.content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      // Parse markdown syntax
      content = parseMarkdown(content);
      
      // Convert newlines to br
      content = content.replace(/\n/g, '<br>');

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
  
  // Add system-generated metadata at the end if enabled
  if (includeSystemMeta) {
    return contentHtml + generateVersionMeta(options?.version) + generateDisclaimer();
  }
  
  return contentHtml;
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
