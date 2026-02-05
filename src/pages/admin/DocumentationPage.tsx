 import { useEffect, useState } from "react";
 import { Button } from "@/components/ui/button";
 import { ArrowLeft, Printer, Loader2 } from "lucide-react";
 import { Link } from "react-router-dom";
 import ReactMarkdown from "react-markdown";
 import remarkGfm from "remark-gfm";
 
 const DocumentationPage = () => {
   const [content, setContent] = useState<string>("");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   useEffect(() => {
     document.title = "網站架構文件 | 默默超完整性哲學官方入口網站";
     
     // 動態載入 markdown 檔案
     fetch("/docs/WEBSITE_STRUCTURE.md")
       .then((res) => {
         if (!res.ok) throw new Error("無法載入文件");
         return res.text();
       })
       .then((text) => {
         setContent(text);
         setLoading(false);
       })
       .catch((err) => {
         setError(err.message);
         setLoading(false);
       });
   }, []);
 
   const handlePrint = () => {
     window.print();
   };
 
   return (
     <div className="min-h-screen bg-background">
       {/* Header - hidden in print */}
       <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border print:hidden">
         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
           <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
             <ArrowLeft className="w-4 h-4" />
             <span>返回後台</span>
           </Link>
           <Button onClick={handlePrint} className="gap-2" disabled={loading}>
             <Printer className="w-4 h-4" />
             列印 / 匯出 PDF
           </Button>
         </div>
       </header>
 
       {/* Content */}
       <main className="container mx-auto px-4 py-8 max-w-4xl print:max-w-none print:px-0">
         {loading ? (
           <div className="flex items-center justify-center py-20">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
             <span className="ml-3 text-muted-foreground">載入文件中...</span>
           </div>
         ) : error ? (
           <div className="text-center py-20">
             <p className="text-destructive mb-4">❌ {error}</p>
             <p className="text-muted-foreground text-sm">請確認 public/docs/WEBSITE_STRUCTURE.md 檔案存在</p>
           </div>
         ) : (
           <article className="prose prose-invert max-w-none 
             print:prose-neutral print:text-black
             prose-headings:text-foreground print:prose-headings:text-black
             prose-h1:text-3xl prose-h1:font-serif prose-h1:text-center prose-h1:mb-8
             prose-h2:text-2xl prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h2:mt-12
             prose-h3:text-lg prose-h3:mt-8
             prose-h4:text-base prose-h4:mt-6
             prose-p:text-muted-foreground print:prose-p:text-gray-700
             prose-a:text-primary prose-a:no-underline hover:prose-a:underline
             prose-strong:text-foreground print:prose-strong:text-black
             prose-code:text-primary prose-code:bg-muted/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
             prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border
             prose-table:w-full prose-table:text-sm
             prose-thead:bg-muted/50 print:prose-thead:bg-gray-100
             prose-th:p-3 prose-th:border prose-th:border-border prose-th:text-left prose-th:font-semibold prose-th:text-foreground
             print:prose-th:border-gray-300 print:prose-th:text-black
             prose-td:p-3 prose-td:border prose-td:border-border prose-td:text-muted-foreground
             print:prose-td:border-gray-300 print:prose-td:text-gray-600
             prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r prose-blockquote:not-italic
             prose-hr:border-border print:prose-hr:border-gray-300
             prose-ul:text-muted-foreground prose-ol:text-muted-foreground
             print:prose-ul:text-gray-700 print:prose-ol:text-gray-700
             prose-li:marker:text-primary
           ">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
               {content}
             </ReactMarkdown>
           </article>
         )}
       </main>
 
       {/* Print Styles */}
       <style>{`
         @media print {
           body {
             -webkit-print-color-adjust: exact;
             print-color-adjust: exact;
           }
           @page {
             size: A4;
             margin: 15mm;
           }
           .prose h2 {
             page-break-after: avoid;
           }
           .prose table {
             page-break-inside: avoid;
           }
         }
       `}</style>
     </div>
   );
 };
 
 export default DocumentationPage;