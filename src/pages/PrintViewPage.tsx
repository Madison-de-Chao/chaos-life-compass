import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getDocumentByShareLink, Document } from "@/hooks/useDocuments";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoChaoxuan from "@/assets/logo-chaoxuan.png";
import logoHongling from "@/assets/logo-hongling.png";
import reportLogo from "@/assets/report-logo.png";

// Parse markdown tables in HTML content
function parseMarkdownTables(html: string): string {
  const lines = html.split('\n');
  const result: string[] = [];
  let tableLines: string[] = [];
  let inTable = false;
  let pendingEmptyLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    const isTableRow = trimmed.includes('|') && (trimmed.match(/\|/g) || []).length >= 2;
    const isEmptyLine = trimmed === '' || /^[\s ]*$/.test(trimmed);
    
    if (isTableRow) {
      if (!inTable) {
        inTable = true;
        tableLines = [];
        pendingEmptyLines = [];
      }
      pendingEmptyLines = [];
      tableLines.push(trimmed);
    } else if (inTable && isEmptyLine) {
      pendingEmptyLines.push(line);
    } else {
      if (inTable && tableLines.length > 0) {
        result.push(convertToHtmlTable(tableLines));
        tableLines = [];
        inTable = false;
        result.push(...pendingEmptyLines);
        pendingEmptyLines = [];
      }
      result.push(line);
    }
  }
  
  if (inTable && tableLines.length > 0) {
    result.push(convertToHtmlTable(tableLines));
  }

  return result.join('\n');
}

// Convert markdown-style table rows to HTML table
function convertToHtmlTable(rows: string[]): string {
  if (rows.length === 0) return '';
  
  const dataRows = rows.filter(row => !row.match(/^\|?\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?\s*$/));
  
  if (dataRows.length === 0) return '';

  let tableHtml = '<table class="document-table">';
  
  dataRows.forEach((row, index) => {
    const cells = row.split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0);
    
    if (cells.length === 0) return;
    
    const isHeader = index === 0;
    const cellTag = isHeader ? 'th' : 'td';
    const rowClass = isHeader ? 'table-header' : '';
    
    tableHtml += `<tr class="${rowClass}">`;
    cells.forEach(cell => {
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
    .replace(/####\s*/g, '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
}

// Style title with first word/character enlarged
function styleTitle(title: string): string {
  if (!title.trim()) return title;
  
  const firstChar = title.trim()[0];
  const isChinese = /[\u4e00-\u9fff]/.test(firstChar);
  
  if (isChinese) {
    const rest = title.trim().slice(1);
    return `<span class="first-char">${firstChar}</span><span class="title-rest">${rest}</span>`;
  } else {
    const words = title.trim().split(/\s+/);
    if (words.length > 1) {
      return `<span class="first-char">${words[0]}</span> <span class="title-rest">${words.slice(1).join(' ')}</span>`;
    }
    return `<span class="first-char">${words[0]}</span>`;
  }
}

// Page break patterns
const markdownH2Pattern = /^(?<![#])##(?![#])\s+/;
const chapterPattern = /^第\s*\d+\s*章/;
const bracketTitlePattern = /^【[^】]+】/;

function isNewSectionStart(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length > 100) return false;
  
  if (markdownH2Pattern.test(trimmed)) return true;
  if (chapterPattern.test(trimmed)) return true;
  if (bracketTitlePattern.test(trimmed)) return true;
  
  return false;
}

// Parse HTML content into pages
function parseHtmlToPages(html: string, title: string): { title: string; styledTitle: string; content: string }[] {
  let processedHtml = parseMarkdownInHtml(html);
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(processedHtml, 'text/html');
  const elements = Array.from(doc.body.children);
  
  const pages: { title: string; styledTitle: string; content: string }[] = [];
  let currentPage = { title: title, styledTitle: styleTitle(title), content: '' };
  let isFirstPage = true;

  for (const element of elements) {
    const tagName = element.tagName.toLowerCase();
    const textContent = element.textContent?.trim() || '';
    
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
    const isKeywordMatch = isNewSectionStart(textContent);
    
    if ((isHeading || isKeywordMatch) && !isFirstPage) {
      if (currentPage.content.trim()) {
        pages.push(currentPage);
      }
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
  
  if (currentPage.content.trim()) {
    pages.push(currentPage);
  }

  if (pages.length === 0) {
    pages.push({ title, styledTitle: styleTitle(title), content: processedHtml });
  }

  return pages;
}

const PrintViewPage = () => {
  const { shareLink } = useParams<{ shareLink: string }>();
  const navigate = useNavigate();
  const [docData, setDocData] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      if (shareLink) {
        const doc = await getDocumentByShareLink(shareLink);
        if (doc) {
          // Check if password protected - redirect back if so
          if (doc.password) {
            navigate(`/view/${shareLink}`);
            return;
          }
          setDocData(doc);
        } else {
          setNotFound(true);
        }
      }
      setLoading(false);
    };

    fetchDocument();
  }, [shareLink, navigate]);

  const content = docData?.content as { title: string; htmlContent?: string; sections?: any[] } | null;

  // Set document title for PDF filename
  useEffect(() => {
    if (content?.title) {
      document.title = content.title;
    }
    return () => {
      document.title = "命理報告平台";
    };
  }, [content?.title]);

  const pages = useMemo(() => {
    if (!content) return [];
    if (content.htmlContent) {
      return parseHtmlToPages(content.htmlContent, content.title);
    }
    if (content.sections) {
      return content.sections.map((section, idx) => ({
        title: section.type === 'heading' ? section.content : `段落 ${idx + 1}`,
        styledTitle: styleTitle(section.type === 'heading' ? section.content : `段落 ${idx + 1}`),
        content: `<p>${section.content}</p>`,
      }));
    }
    return [{ title: content.title, styledTitle: styleTitle(content.title), content: '' }];
  }, [content]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">載入中...</div>
      </div>
    );
  }

  if (notFound || !docData || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">找不到文件</h1>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首頁
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .print-page {
            page-break-after: always;
            page-break-inside: avoid;
            min-height: 100vh;
            padding: 40px;
            box-sizing: border-box;
          }
          
          .print-page:last-child {
            page-break-after: auto;
          }
          
          .print-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #d4a574;
          }
          
          .print-header img {
            height: 50px;
            width: auto;
          }
          
          .print-title {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: #8b5a3c;
            margin-bottom: 30px;
            white-space: nowrap;
          }
          
          .first-char {
            font-size: 1.2em;
            font-weight: 900;
            color: #8b5a3c;
          }
          
          .title-rest {
            font-weight: bold;
          }
          
          .print-content {
            font-size: 14px;
            line-height: 1.8;
            color: #1a1a1a;
          }
          
          .print-content p {
            margin-bottom: 1em;
            text-indent: 2em;
          }
          
          .print-content h1,
          .print-content h2,
          .print-content h3 {
            font-weight: bold;
            margin: 1.5em 0 0.5em;
            color: #8b5a3c;
          }
          
          .print-content img {
            max-width: 100%;
            height: auto;
            margin: 1em auto;
            display: block;
          }
          
          .print-footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #d4a574;
          }
          
          .cover-logo {
            display: block;
            width: 200px;
            height: auto;
            margin: 40px auto;
          }
          
          .document-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            font-size: 12px;
            border: 2px solid #8b5a3c;
            border-radius: 4px;
            overflow: hidden;
          }
          
          .document-table th,
          .document-table td {
            border: 1px solid #d4a574;
            padding: 10px 14px;
            text-align: left;
            vertical-align: top;
          }
          
          .document-table th {
            background: linear-gradient(135deg, #f5e6d3 0%, #ede0cc 100%);
            font-weight: bold;
            color: #8b5a3c;
            border-bottom: 2px solid #8b5a3c;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
          }
          
          .document-table td {
            background-color: #fffcf7;
          }
          
          .document-table tr:nth-child(even) td {
            background-color: #faf5ed;
          }
          
          .document-table tr:hover td {
            background-color: #f5ebe0;
          }
        }
        
        @media screen {
          .print-page {
            max-width: 800px;
            margin: 0 auto 40px;
            padding: 40px;
            background: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border-radius: 8px;
          }
          
          .print-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #d4a574;
          }
          
          .print-header img {
            height: 50px;
            width: auto;
          }
          
          .print-title {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: hsl(var(--primary));
            margin-bottom: 30px;
            white-space: nowrap;
          }
          
          .first-char {
            font-size: 1.2em;
            font-weight: 900;
            color: hsl(var(--primary));
          }
          
          .title-rest {
            font-weight: bold;
          }
          
          .print-content {
            font-size: 16px;
            line-height: 1.8;
            color: hsl(var(--foreground));
          }
          
          .print-content p {
            margin-bottom: 1em;
          }
          
          .print-content h1,
          .print-content h2,
          .print-content h3 {
            font-weight: bold;
            margin: 1.5em 0 0.5em;
            color: hsl(var(--primary));
          }
          
          .print-content img {
            max-width: 100%;
            height: auto;
            margin: 1em auto;
            display: block;
          }
          
          .print-footer {
            text-align: center;
            font-size: 12px;
            color: hsl(var(--muted-foreground));
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid hsl(var(--border));
          }
          
          .cover-logo {
            display: block;
            width: 200px;
            height: auto;
            margin: 40px auto;
          }
          
          .document-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            font-size: 14px;
            border: 2px solid hsl(var(--primary));
            border-radius: 8px;
            overflow: hidden;
          }
          
          .document-table th,
          .document-table td {
            border: 1px solid hsl(var(--primary) / 0.3);
            padding: 12px 16px;
            text-align: left;
            vertical-align: top;
          }
          
          .document-table th {
            background: linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--muted) / 0.8) 100%);
            font-weight: bold;
            color: hsl(var(--primary));
            border-bottom: 2px solid hsl(var(--primary));
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
          }
          
          .document-table td {
            background-color: hsl(var(--card));
          }
          
          .document-table tr:nth-child(even) td {
            background-color: hsl(var(--muted) / 0.3);
          }
          
          .document-table tr:hover td {
            background-color: hsl(var(--muted) / 0.5);
          }
        }
      `}</style>

      {/* Toolbar - hidden when printing */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/view/${shareLink}`)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回閱讀
          </Button>
          
          <div className="text-sm text-muted-foreground">
            列印預覽 - 共 {pages.length} 頁
          </div>
          
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            列印 / 下載 PDF
          </Button>
        </div>
      </div>

      {/* Print Content */}
      <div className="pt-20 pb-10 px-4 bg-muted/30 min-h-screen no-print-bg">
        {pages.map((page, index) => (
          <div key={index} className="print-page">
            {/* Header with logos */}
            <div className="print-header">
              <img src={logoChaoxuan} alt="超烜創意" />
              <img src={logoHongling} alt="虹靈御所" />
            </div>
            
            {/* Cover logo only on first page */}
            {index === 0 && (
              <img src={reportLogo} alt="報告標誌" className="cover-logo" />
            )}
            
            {/* Page title */}
            <h1 
              className="print-title"
              dangerouslySetInnerHTML={{ __html: page.styledTitle }}
            />
            
            {/* Content */}
            <div 
              className="print-content"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
            
            {/* Footer on last page */}
            {index === pages.length - 1 && (
              <div className="print-footer">
                © {new Date().getFullYear()} MOMO CHAO / 超烜創意 / 虹靈御所 版權所有
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default PrintViewPage;
