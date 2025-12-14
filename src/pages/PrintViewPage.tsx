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

// Calculate font size based on title length
function getTitleFontSize(title: string): string {
  const len = title.length;
  if (len <= 10) return '28px';
  if (len <= 15) return '24px';
  if (len <= 20) return '20px';
  if (len <= 30) return '18px';
  return '16px';
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
          
          .print-container {
            padding: 0;
            background: white;
          }
          
          .print-page {
            page-break-after: always;
            page-break-inside: avoid;
            min-height: 100vh;
            padding: 50px;
            box-sizing: border-box;
            position: relative;
          }
          
          .print-page:last-child {
            page-break-after: auto;
          }
          
          .page-corner {
            display: none;
          }
          
          .print-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #d4a574;
          }
          
          .header-divider {
            display: none;
          }
          
          .print-header img {
            height: 50px;
            width: auto;
          }
          
          .cover-section {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 40px 0;
          }
          
          .cover-logo {
            width: 200px;
            height: auto;
            display: block;
            margin: 0 auto;
          }
          
          .print-title {
            text-align: center;
            font-weight: bold;
            color: #8b5a3c;
            margin: 20px 0;
            line-height: 1.3;
          }
          
          .title-divider {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 25px;
          }
          
          .divider-line {
            width: 60px;
            height: 1px;
            background: linear-gradient(to right, transparent, #d4a574, transparent);
          }
          
          .divider-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #d4a574;
          }
          
          .first-char {
            font-size: 1.15em;
            font-weight: 900;
            color: #8b5a3c;
          }
          
          .title-rest {
            font-weight: bold;
          }
          
          .print-content {
            font-size: 14px;
            line-height: 1.9;
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
          
          .page-number {
            position: absolute;
            bottom: 30px;
            right: 50px;
            font-size: 11px;
            color: #999;
          }
          
          .print-footer {
            text-align: center;
            font-size: 11px;
            color: #666;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #d4a574;
          }
          
          .document-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            font-size: 11px;
            border: 2px solid #8b5a3c;
            page-break-inside: avoid;
          }
          
          .document-table th,
          .document-table td {
            border: 1px solid #d4a574;
            padding: 8px 12px;
            text-align: left;
            vertical-align: top;
          }
          
          .document-table th {
            background: #f5e6d3;
            font-weight: bold;
            color: #8b5a3c;
            border-bottom: 2px solid #8b5a3c;
            white-space: nowrap;
          }
          
          .document-table td {
            background-color: #fffcf7;
          }
          
          .document-table tr:nth-child(even) td {
            background-color: #faf5ed;
          }
          
          .document-table tr {
            page-break-inside: avoid;
          }
          
          .print-content p,
          .print-content h1,
          .print-content h2,
          .print-content h3 {
            page-break-inside: avoid;
          }
          
          .print-content img {
            page-break-inside: avoid;
            page-break-before: auto;
            page-break-after: auto;
          }
        }
        
        @media screen {
          .print-container {
            background: linear-gradient(135deg, hsl(var(--muted) / 0.3) 0%, hsl(var(--background)) 50%, hsl(var(--muted) / 0.3) 100%);
          }
          
          .print-page {
            max-width: 850px;
            margin: 0 auto 50px;
            padding: 50px;
            background: linear-gradient(to bottom, #fffdf9, #fff);
            box-shadow: 
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 20px 40px -10px rgba(139, 90, 60, 0.15),
              0 0 0 1px rgba(212, 165, 116, 0.2);
            border-radius: 12px;
            position: relative;
            overflow: hidden;
          }
          
          .page-corner {
            position: absolute;
            width: 40px;
            height: 40px;
            border-color: hsl(var(--primary) / 0.3);
            border-style: solid;
          }
          
          .page-corner.top-left {
            top: 15px;
            left: 15px;
            border-width: 2px 0 0 2px;
            border-radius: 8px 0 0 0;
          }
          
          .page-corner.top-right {
            top: 15px;
            right: 15px;
            border-width: 2px 2px 0 0;
            border-radius: 0 8px 0 0;
          }
          
          .page-corner.bottom-left {
            bottom: 15px;
            left: 15px;
            border-width: 0 0 2px 2px;
            border-radius: 0 0 0 8px;
          }
          
          .page-corner.bottom-right {
            bottom: 15px;
            right: 15px;
            border-width: 0 2px 2px 0;
            border-radius: 0 0 8px 0;
          }
          
          .print-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid hsl(var(--primary) / 0.3);
          }
          
          .header-divider {
            flex: 1;
            height: 1px;
            background: linear-gradient(to right, transparent, hsl(var(--primary) / 0.2), transparent);
            margin: 0 20px;
          }
          
          .print-header img {
            height: 55px;
            width: auto;
            transition: transform 0.3s ease;
          }
          
          .print-header img:hover {
            transform: scale(1.05);
          }
          
          .cover-section {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 50px 0;
            animation: fadeIn 0.8s ease-out;
          }
          
          .cover-logo {
            width: 220px;
            height: auto;
            display: block;
            margin: 0 auto;
            filter: drop-shadow(0 10px 20px rgba(139, 90, 60, 0.2));
            animation: float 4s ease-in-out infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .print-title {
            text-align: center;
            font-weight: bold;
            color: hsl(var(--primary));
            margin: 25px 0 15px;
            line-height: 1.3;
          }
          
          .title-divider {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 30px;
          }
          
          .divider-line {
            width: 80px;
            height: 1px;
            background: linear-gradient(to right, transparent, hsl(var(--primary) / 0.4), transparent);
          }
          
          .divider-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: hsl(var(--primary) / 0.4);
            animation: pulse 2s ease-in-out infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          
          .first-char {
            font-size: 1.15em;
            font-weight: 900;
            color: hsl(var(--primary));
          }
          
          .title-rest {
            font-weight: bold;
          }
          
          .print-content {
            font-size: 16px;
            line-height: 1.9;
            color: hsl(var(--foreground));
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
            color: hsl(var(--primary));
          }
          
          .print-content img {
            max-width: 100%;
            height: auto;
            margin: 1.5em auto;
            display: block;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          
          .page-number {
            text-align: center;
            font-size: 12px;
            color: hsl(var(--muted-foreground));
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid hsl(var(--border) / 0.5);
          }
          
          .print-footer {
            text-align: center;
            font-size: 12px;
            color: hsl(var(--muted-foreground));
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid hsl(var(--primary) / 0.3);
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
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-card via-card/98 to-card backdrop-blur-md border-b border-primary/20 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/view/${shareLink}`)}
            className="gap-2 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">返回閱讀</span>
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              {content?.title}
            </span>
            <div className="hidden sm:block w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
          </div>
          
          <Button onClick={handlePrint} className="gap-2 shadow-md hover:shadow-lg transition-all">
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">列印 / 下載 PDF</span>
            <span className="sm:hidden">列印</span>
          </Button>
        </div>
        <div className="text-center text-xs text-muted-foreground pb-2">
          共 {pages.length} 頁
        </div>
      </div>

      {/* Print Content */}
      <div className="pt-24 pb-10 px-4 min-h-screen print-container">
        {pages.map((page, index) => (
          <div key={index} className="print-page">
            {/* Decorative corner accents */}
            <div className="page-corner top-left" />
            <div className="page-corner top-right" />
            <div className="page-corner bottom-left" />
            <div className="page-corner bottom-right" />
            
            {/* Header with logos */}
            <div className="print-header">
              <img src={logoChaoxuan} alt="超烜創意" />
              <div className="header-divider" />
              <img src={logoHongling} alt="虹靈御所" />
            </div>
            
            {/* Page title with dynamic font size */}
            <h1 
              className="print-title"
              style={{ fontSize: getTitleFontSize(page.title) }}
              dangerouslySetInnerHTML={{ __html: page.styledTitle }}
            />
            
            {/* Decorative divider */}
            <div className="title-divider">
              <span className="divider-line" />
              <span className="divider-dot" />
              <span className="divider-line" />
            </div>
            
            {/* Cover logo only on first page - after title */}
            {index === 0 && (
              <div className="cover-section">
                <img src={reportLogo} alt="報告標誌" className="cover-logo" />
              </div>
            )}
            
            {/* Content */}
            <div 
              className="print-content"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
            
            {/* Page number */}
            <div className="page-number">
              {index + 1} / {pages.length}
            </div>
            
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
