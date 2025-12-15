import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { getDocumentByShareLink, Document } from "@/hooks/useDocuments";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Printer, Droplets, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { isBefore, parseISO } from "date-fns";
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
  if (len <= 10) return '22px';
  if (len <= 15) return '18px';
  if (len <= 20) return '16px';
  if (len <= 30) return '14px';
  return '12px';
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
  // Sanitize HTML to prevent XSS
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ADD_TAGS: ['table', 'tr', 'td', 'th', 'thead', 'tbody'],
    ADD_ATTR: ['data-page-break', 'class'],
  });
  let processedHtml = parseMarkdownInHtml(sanitizedHtml);
  
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [docData, setDocData] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [showWatermark, setShowWatermark] = useState(searchParams.get('watermark') === 'true');
  const [customerName, setCustomerName] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (shareLink) {
        const doc = await getDocumentByShareLink(shareLink);
        if (doc) {
          // Check if document is public
          if (doc.is_public === false) {
            setNotFound(true);
            setLoading(false);
            return;
          }
          
          // Check if link has expired
          if (doc.expires_at) {
            const expirationDate = parseISO(doc.expires_at);
            if (isBefore(expirationDate, new Date())) {
              setIsExpired(true);
              setLoading(false);
              return;
            }
          }
          
          // Check if password protected - use server-side check
          const { data: hasPassword } = await supabase.rpc('document_has_password', { 
            doc_share_link: shareLink 
          });
          if (hasPassword) {
            // Check if already authenticated via sessionStorage
            const authKey = `doc_auth_${shareLink}`;
            const isAlreadyAuth = sessionStorage.getItem(authKey) === 'true';
            if (!isAlreadyAuth) {
              // Redirect to view page for password entry
              navigate(`/view/${shareLink}`);
              return;
            }
          }
          
          // Fetch customer name if customer_id exists
          if (doc.customer_id) {
            const { data: customer } = await supabase
              .from('customers')
              .select('name')
              .eq('id', doc.customer_id)
              .single();
            if (customer) {
              setCustomerName(customer.name);
            }
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

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-100 flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4 font-serif">連結已過期</h1>
          <p className="text-lg text-muted-foreground mb-8">此分享連結已超過有效期限，請聯繫報告提供者獲取新連結。</p>
          <Button asChild variant="hero">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首頁
            </Link>
          </Button>
        </div>
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
          
          @page {
            margin: 15mm 15mm 30mm 15mm;
            size: A4;
          }
          
          @page :first {
            margin-bottom: 15mm;
          }
          
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-container {
            padding: 0;
            background: white;
          }
          
          .cover-page {
            page-break-after: always;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 50px;
            box-sizing: border-box;
            position: relative;
          }
          
          .cover-page .print-header {
            position: absolute;
            top: 30px;
            left: 50px;
            right: 50px;
          }
          
          .cover-main {
            text-align: center;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          
          .cover-main .cover-logo {
            width: 180px;
            height: auto;
            margin-bottom: 40px;
            filter: drop-shadow(0 8px 16px rgba(139, 90, 60, 0.25));
          }
          
          .cover-main .cover-title-main {
            font-size: 32px;
            font-weight: bold;
            color: #5a2d0a;
            margin-bottom: 20px;
            line-height: 1.3;
          }
          
          .cover-main .cover-customer {
            font-size: 20px;
            color: #8b5a3c;
            margin-bottom: 30px;
          }
          
          .cover-main .cover-date {
            font-size: 14px;
            color: #666;
            margin-bottom: 60px;
          }
          
          .cover-disclaimer {
            position: absolute;
            bottom: 50px;
            left: 50px;
            right: 50px;
            font-size: 8px;
            color: #999;
            text-align: center;
            line-height: 1.5;
            border-top: 1px solid #d4a574;
            padding-top: 12px;
          }
          
          .cover-disclaimer p {
            margin: 2px 0;
          }
          
          /* TOC Page Styles */
          .toc-page {
            page-break-after: always;
            min-height: 100vh;
            padding: 50px;
            box-sizing: border-box;
            position: relative;
          }
          
          .toc-title {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #5a2d0a;
            margin: 30px 0 40px;
          }
          
          .toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .toc-item {
            display: flex;
            align-items: baseline;
            margin-bottom: 12px;
            font-size: 12px;
            color: #333;
          }
          
          .toc-item-title {
            flex-shrink: 0;
            max-width: 80%;
          }
          
          .toc-item-dots {
            flex: 1;
            border-bottom: 1px dotted #d4a574;
            margin: 0 8px;
            min-width: 20px;
          }
          
          .toc-item-page {
            flex-shrink: 0;
            color: #8b5a3c;
            font-weight: bold;
          }
          
          .print-page {
            page-break-after: always;
            page-break-inside: avoid;
            min-height: 100vh;
            padding: 50px 50px 80px 50px;
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
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #d4a574;
          }
          
          .header-divider {
            flex: 1;
            height: 1px;
            background: linear-gradient(to right, transparent, #d4a574, transparent);
            margin: 0 15px;
          }
          
          .print-header img {
            height: 40px;
            width: auto;
          }
          
          .cover-section {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 50px auto 40px;
            padding: 20px 0;
          }
          
          .cover-logo {
            width: 200px;
            height: auto;
            display: block;
            margin: 0 auto;
            filter: drop-shadow(0 8px 16px rgba(139, 90, 60, 0.25));
          }
          
          .print-title {
            text-align: center;
            font-weight: bold;
            color: #6b3a1a;
            margin: 25px 0 15px;
            line-height: 1.35;
          }
          
          .print-title.cover-title {
            font-size: 26px !important;
            color: #5a2d0a;
            margin: 30px 0 20px;
            text-shadow: 1px 1px 2px rgba(139, 90, 60, 0.15);
          }
          
          .title-divider {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 15px;
          }
          
          .title-divider.cover-divider {
            gap: 16px;
            margin-bottom: 10px;
          }
          
          .cover-divider .divider-line {
            width: 80px;
          }
          
          .cover-divider .divider-dot {
            width: 10px;
            height: 10px;
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
            font-size: 1.2em;
            font-weight: 900;
            color: #5a2d0a;
          }
          
          .cover-title .first-char {
            font-size: 1.3em;
            color: #4a1d00;
          }
          
          .title-rest {
            font-weight: bold;
          }
          
          .print-content {
            font-size: 12px;
            line-height: 1.6;
            color: #1a1a1a;
          }
          
          .print-content p {
            margin-bottom: 0.6em;
            text-indent: 2em;
          }
          
          .print-content h1,
          .print-content h2,
          .print-content h3 {
            font-weight: bold;
            margin: 1em 0 0.3em;
            color: #8b5a3c;
          }
          
          .print-content img {
            max-width: 100%;
            height: auto;
            margin: 0.8em auto;
            display: block;
          }
          
          .page-number {
            display: none;
          }
          
          .print-footer {
            display: none;
          }
          
          .global-footer {
            position: fixed;
            bottom: 10mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8px;
            color: #888;
            background: white;
          }
          
          .print-page-counter {
            position: fixed;
            bottom: 10mm;
            right: 15mm;
            font-size: 10px;
            color: #666;
            background: white;
            padding: 2px 6px;
          }
          
          .cover-page .print-page-counter,
          .toc-page .print-page-counter {
            display: none;
          }
          
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 60px;
            color: rgba(212, 165, 116, 0.15);
            font-weight: bold;
            white-space: nowrap;
            pointer-events: none;
            z-index: 1000;
          }
          
          .document-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.2em 0;
            font-size: 10px;
            border: 2px solid #8b5a3c;
            page-break-inside: avoid;
          }
          
          .document-table th,
          .document-table td {
            border: 1px solid #d4a574;
            padding: 6px 10px;
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
          
          .cover-page {
            max-width: 850px;
            margin: 0 auto 50px;
            padding: 50px;
            background: linear-gradient(to bottom, #fffdf9, #fff);
            box-shadow: 
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 20px 40px -10px rgba(139, 90, 60, 0.15),
              0 0 0 1px rgba(212, 165, 116, 0.2);
            border-radius: 12px;
            min-height: 600px;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
          }
          
          .cover-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 40px 20px;
          }
          
          .cover-main .cover-logo {
            width: 180px;
            height: auto;
            margin-bottom: 40px;
            filter: drop-shadow(0 10px 20px rgba(139, 90, 60, 0.2));
            animation: float 4s ease-in-out infinite;
          }
          
          .cover-main .cover-title-main {
            font-size: 36px;
            font-weight: bold;
            color: hsl(var(--primary));
            margin-bottom: 20px;
            line-height: 1.3;
          }
          
          .cover-main .cover-customer {
            font-size: 22px;
            color: hsl(var(--primary) / 0.8);
            margin-bottom: 30px;
          }
          
          .cover-main .cover-date {
            font-size: 14px;
            color: hsl(var(--muted-foreground));
            margin-bottom: 40px;
          }
          
          .cover-disclaimer {
            font-size: 10px;
            color: hsl(var(--muted-foreground));
            text-align: center;
            line-height: 1.6;
            border-top: 1px solid hsl(var(--primary) / 0.3);
            padding-top: 20px;
            margin-top: auto;
          }
          
          .cover-disclaimer p {
            margin: 3px 0;
          }
          
          /* TOC Page Styles - Screen */
          .toc-page {
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
          
          .toc-title {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: hsl(var(--primary));
            margin: 30px 0 40px;
          }
          
          .toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .toc-item {
            display: flex;
            align-items: baseline;
            margin-bottom: 16px;
            font-size: 15px;
            color: hsl(var(--foreground));
            transition: all 0.2s ease;
          }
          
          .toc-item:hover {
            color: hsl(var(--primary));
          }
          
          .toc-item-title {
            flex-shrink: 0;
            max-width: 80%;
          }
          
          .toc-item-dots {
            flex: 1;
            border-bottom: 1px dotted hsl(var(--primary) / 0.4);
            margin: 0 12px;
            min-width: 20px;
          }
          
          .toc-item-page {
            flex-shrink: 0;
            color: hsl(var(--primary));
            font-weight: bold;
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
          
          .print-title.cover-title {
            font-size: 36px !important;
            color: hsl(var(--primary));
            margin: 30px 0 20px;
          }
          
          .title-divider {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 30px;
          }
          
          .title-divider.cover-divider {
            gap: 16px;
            margin-bottom: 20px;
          }
          
          .cover-divider .divider-line {
            width: 100px;
          }
          
          .cover-divider .divider-dot {
            width: 12px;
            height: 12px;
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
          
          .global-footer {
            display: none;
          }
          
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 48px;
            color: hsl(var(--primary) / 0.08);
            font-weight: bold;
            white-space: nowrap;
            pointer-events: none;
            z-index: 1000;
          }
          
          .page-number-footer {
            display: none;
          }
          
          .print-page-counter {
            display: none;
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
          
          <div className="flex items-center gap-4">
            {/* Watermark toggle */}
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="watermark-toggle" className="text-sm text-muted-foreground hidden sm:inline">
                浮水印
              </Label>
              <Switch
                id="watermark-toggle"
                checked={showWatermark}
                onCheckedChange={setShowWatermark}
              />
            </div>
            
            <Button onClick={handlePrint} className="gap-2 shadow-md hover:shadow-lg transition-all">
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">列印 / 下載 PDF</span>
              <span className="sm:hidden">列印</span>
            </Button>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground pb-2">
          封面 + 目錄 + {pages.length} 頁內容
        </div>
      </div>

      {/* Print Content */}
      <div className="pt-24 pb-10 px-4 min-h-screen print-container">
        {/* Watermark */}
        {showWatermark && (
          <div className="watermark">
            {customerName || content?.title || '機密文件'}
          </div>
        )}
        
        {/* Cover Page */}
        <div className="cover-page">
          {/* Header with logos */}
          <div className="print-header">
            <img src={logoChaoxuan} alt="超烜創意" />
            <div className="header-divider" />
            <img src={logoHongling} alt="虹靈御所" />
          </div>
          
          {/* Cover main content */}
          <div className="cover-main">
            <img src={reportLogo} alt="報告標誌" className="cover-logo" />
            <h1 className="cover-title-main">{content?.title}</h1>
            {customerName && (
              <p className="cover-customer">—— {customerName} 專屬報告 ——</p>
            )}
            <p className="cover-date">
              完成日期：{new Date(docData?.created_at || '').toLocaleDateString('zh-TW', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          {/* Disclaimer */}
          <div className="cover-disclaimer">
            <p><strong>免責聲明</strong></p>
            <p>本報告內容僅供個人參考使用，不構成任何形式的專業建議（包括但不限於醫療、法律、財務或心理諮詢）。</p>
            <p>報告中的分析與解讀基於命理學原理，旨在提供自我探索的參考方向，實際情況可能因個人選擇、環境變化及多重因素而有所不同。</p>
            <p>本報告為付費授權內容，僅供購買者本人閱讀使用。未經書面授權，禁止以任何形式轉載、複製、傳播或用於商業用途。</p>
            <p>© {new Date().getFullYear()} MOMO CHAO / 超烜創意 / 虹靈御所 版權所有</p>
          </div>
        </div>
        
        {/* Table of Contents Page */}
        <div className="toc-page">
          {/* Header with logos */}
          <div className="print-header">
            <img src={logoChaoxuan} alt="超烜創意" />
            <div className="header-divider" />
            <img src={logoHongling} alt="虹靈御所" />
          </div>
          
          <h2 className="toc-title">目 錄</h2>
          
          <ul className="toc-list">
            {pages.map((page, index) => (
              <li key={index} className="toc-item">
                <span className="toc-item-title">{page.title}</span>
                <span className="toc-item-dots" />
                <span className="toc-item-page">{index + 1}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Content Pages */}
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
              className={`print-title ${index === 0 ? 'cover-title' : ''}`}
              style={{ fontSize: index === 0 ? undefined : getTitleFontSize(page.title) }}
              dangerouslySetInnerHTML={{ __html: page.styledTitle }}
            />
            
            {/* Decorative divider */}
            <div className={`title-divider ${index === 0 ? 'cover-divider' : ''}`}>
              <span className="divider-line" />
              <span className="divider-dot" />
              <span className="divider-line" />
            </div>
            
            {/* Content */}
            <div 
              className="print-content"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
            
            {/* Page counter for print */}
            <div className="print-page-counter">
              第 {index + 1} / {pages.length} 頁
            </div>
            
            {/* Page number - screen only */}
            <div className="page-number">
              {index + 1} / {pages.length}
            </div>
            
            {/* Footer on last page - screen only */}
            {index === pages.length - 1 && (
              <div className="print-footer">
                © {new Date().getFullYear()} MOMO CHAO / 超烜創意 / 虹靈御所 版權所有
              </div>
            )}
          </div>
        ))}
        
        {/* Global footer for print - appears on every page */}
        <div className="global-footer">
          © {new Date().getFullYear()} MOMO CHAO / 超烜創意 / 虹靈御所 版權所有
        </div>
      </div>
    </>
  );
};

export default PrintViewPage;
