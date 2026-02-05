 import { useEffect } from "react";
 import { Button } from "@/components/ui/button";
 import { ArrowLeft, Printer, FileDown } from "lucide-react";
 import { Link } from "react-router-dom";
 
 const DocumentationPage = () => {
   useEffect(() => {
     document.title = "網站架構文件 | 默默超完整性哲學官方入口網站";
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
           <Button onClick={handlePrint} className="gap-2">
             <Printer className="w-4 h-4" />
             列印 / 匯出 PDF
           </Button>
         </div>
       </header>
 
       {/* Content */}
       <main className="container mx-auto px-4 py-8 max-w-4xl print:max-w-none print:px-0">
         <article className="prose prose-invert max-w-none print:prose-neutral print:text-black">
           
           {/* Title */}
           <div className="text-center mb-12 print:mb-8">
             <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground print:text-black mb-4">
               默默超完整性哲學官方入口網站
             </h1>
             <p className="text-xl text-primary print:text-gray-600">網站架構與內容說明</p>
             <p className="text-sm text-muted-foreground mt-4">最後更新：2026-02-05</p>
           </div>
 
           <hr className="border-border print:border-gray-300 my-8" />
 
           {/* 目錄 */}
           <section className="mb-12 p-6 bg-muted/30 rounded-lg print:bg-gray-100 print:p-4">
             <h2 className="text-xl font-bold mb-4 print:text-black">📋 目錄</h2>
             <ol className="list-decimal list-inside space-y-1 text-muted-foreground print:text-gray-700">
               <li><a href="#overview" className="hover:text-primary">網站總覽</a></li>
               <li><a href="#public" className="hover:text-primary">公開頁面</a></li>
               <li><a href="#member" className="hover:text-primary">會員系統</a></li>
               <li><a href="#admin" className="hover:text-primary">管理後台</a></li>
               <li><a href="#documents" className="hover:text-primary">文件分享系統</a></li>
               <li><a href="#tech" className="hover:text-primary">技術架構</a></li>
               <li><a href="#routes" className="hover:text-primary">頁面路由對照表</a></li>
             </ol>
           </section>
 
           {/* 網站總覽 */}
           <section id="overview" className="mb-12">
             <h2 className="text-2xl font-bold text-foreground print:text-black border-b border-border pb-2 mb-6">
               網站總覽
             </h2>
             <div className="space-y-4">
               <div className="grid md:grid-cols-2 gap-4">
                 <div className="p-4 bg-muted/20 rounded-lg print:bg-gray-50 print:border print:border-gray-200">
                   <p className="text-sm text-muted-foreground print:text-gray-500">網站名稱</p>
                   <p className="font-semibold text-foreground print:text-black">默默超完整性哲學官方入口網站</p>
                 </div>
                 <div className="p-4 bg-muted/20 rounded-lg print:bg-gray-50 print:border print:border-gray-200">
                   <p className="text-sm text-muted-foreground print:text-gray-500">品牌標語</p>
                   <p className="font-semibold text-foreground print:text-black">關懷與真相 — 永恆的關懷與真誠</p>
                 </div>
               </div>
               <div className="p-4 bg-muted/20 rounded-lg print:bg-gray-50 print:border print:border-gray-200">
                 <p className="text-sm text-muted-foreground print:text-gray-500 mb-2">網站定位</p>
                 <p className="text-foreground print:text-black">
                   可驗證、可回看、可落地的自我探索工具鏈，結合東方命理與決策邏輯的自我探索系統。
                 </p>
               </div>
               <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 print:bg-amber-50 print:border-amber-200">
                 <p className="text-sm text-primary print:text-amber-700 mb-2">核心哲學</p>
                 <p className="text-foreground print:text-black font-medium">
                   「鏡子，非劇本」(Mirror, not Script) — 我們不是算命，不是心靈雞湯，不是課程推銷，不是宗教。我們是工具，是鏡子，是你的操作手冊。
                 </p>
               </div>
             </div>
           </section>
 
           {/* 公開頁面 */}
           <section id="public" className="mb-12">
             <h2 className="text-2xl font-bold text-foreground print:text-black border-b border-border pb-2 mb-6">
               公開頁面
             </h2>
             
             <div className="space-y-6">
               <PageCard
                 number={1}
                 title="入口網站 (PortalPage)"
                 path="/ 或 /portal"
                 description="品牌核心入口，採用宇宙星空風格設計。展示四大入口卡片：虹靈御所、超烜創意、元壹宇宙、默默超是誰。核心標語：「我們不販賣預言，我們打造鏡子」。四維度操作系統介紹：情緒、行動、心智、價值。環境音樂功能與動態粒子效果。"
                 links={[
                   { path: "/home", label: "虹靈御所首頁" },
                   { path: "/chaoxuan", label: "超烜創意" },
                   { path: "/universe", label: "元壹宇宙" },
                   { path: "/about", label: "關於默默超" },
                   { path: "/auth/login", label: "會員登入" },
                 ]}
               />
 
               <PageCard
                 number={2}
                 title="虹靈御所首頁 (HomePage)"
                 path="/home"
                 description="Rainbow Sanctuary 品牌主頁。命理報告服務介紹與服務項目導覽。"
                 links={[
                   { path: "/reports", label: "命理報告" },
                   { path: "/games", label: "超烜遊戲" },
                   { path: "/universe", label: "元壹宇宙" },
                 ]}
               />
 
               <PageCard
                 number={3}
                 title="超烜創意 (ChaoxuanPage)"
                 path="/chaoxuan"
                 description="Maison de Chao 品牌頁面。品牌策略與創意服務介紹。六大服務領域：🎨 藝術之廊、🚪 全能之門、🌿 元素之庭、🏛️ 創意之殿、🌈 虹靈御所、🌱 養成之苑。"
               />
 
               <PageCard
                 number={4}
                 title="命理報告 (ReportPage)"
                 path="/reports"
                 description="三層服務體系：1. 基礎報告（標準命理分析）、2. 進階解讀（深度諮詢服務）、3. VIP 定制（專屬個人化報告）。包含服務流程說明與報告預覽範例。"
               />
 
               <PageCard
                 number={5}
                 title="超烜遊戲 (GamesPage)"
                 path="/games"
                 description="互動式命理遊戲集。遊戲項目：🎴 八字探秘（八字命理入門）、🧩 邏輯測試（思維方式分析）、🪞 鏡像探索（自我認知遊戲）。支援分類篩選系統。"
               />
 
               <PageCard
                 number={6}
                 title="元壹宇宙 (UniversePage)"
                 path="/universe"
                 description="Yuan-Yi Universe 哲學理念中心。旅程六站系統：1. YYDS 元壹神諭、2. RSBZS 人生避難指南、3. 神話占星、4. MMCLS 默默超邏輯學、5. 零式弧線 Arc Zero、6. EHFIS 東方人因洞察。"
               />
 
               <PageCard
                 number={7}
                 title="關於默默超 (AboutPage)"
                 path="/about"
                 description="MomoChao 品牌故事。Rainbow Sanctuary 理念。「鏡子非劇本」溝通哲學。創辦人介紹與願景。"
               />
 
               <PageCard
                 number={8}
                 title="隱私政策 / 服務條款"
                 path="/privacy、/terms"
                 description="隱私政策：資料收集說明、隱私保護政策、Cookie 使用說明。服務條款：使用條款、服務範圍說明、責任限制。"
               />
             </div>
           </section>
 
           {/* 會員系統 */}
           <section id="member" className="mb-12 print:break-before-page">
             <h2 className="text-2xl font-bold text-foreground print:text-black border-b border-border pb-2 mb-6">
               會員系統
             </h2>
             
             <div className="space-y-6">
               <PageCard
                 title="統一會員登入"
                 path="/auth/login"
                 description="電子郵件登入/註冊。密碼驗證。會員身份驗證。"
               />
 
               <PageCard
                 title="會員中心 (UnifiedDashboard)"
                 path="/account"
                 description="會員個人儀表板。文件閱讀記錄。產品權限查看。快速功能入口。"
                 links={[
                   { path: "/account/profile", label: "個人資料編輯" },
                   { path: "/account/products", label: "已購產品" },
                   { path: "/", label: "返回首頁" },
                 ]}
               />
 
               <PageCard
                 title="會員資料 (UnifiedProfilePage)"
                 path="/account/profile"
                 description="個人資料編輯。顯示名稱設定。出生資料管理（用於命理服務）。頭像設定。"
               />
 
               <PageCard
                 title="已購產品 (ProductsPage)"
                 path="/account/products"
                 description="查看已購買的產品與服務。訂閱狀態管理。產品權限期限。"
               />
 
               <PageCard
                 title="OAuth 授權"
                 path="/oauth/authorize"
                 description="第三方應用授權。OAuth 2.0 標準流程。"
               />
             </div>
           </section>
 
           {/* 管理後台 */}
           <section id="admin" className="mb-12 print:break-before-page">
             <h2 className="text-2xl font-bold text-foreground print:text-black border-b border-border pb-2 mb-6">
               管理後台
             </h2>
             <p className="text-muted-foreground print:text-gray-600 mb-6 text-sm">
               ⚠️ 以下頁面需要管理員 (Admin) 或助手 (Helper) 權限
             </p>
             
             <div className="overflow-x-auto">
               <table className="w-full text-sm border-collapse">
                 <thead>
                   <tr className="bg-muted/50 print:bg-gray-100">
                     <th className="text-left p-3 border border-border print:border-gray-300 font-semibold">路徑</th>
                     <th className="text-left p-3 border border-border print:border-gray-300 font-semibold">頁面名稱</th>
                     <th className="text-left p-3 border border-border print:border-gray-300 font-semibold">功能說明</th>
                   </tr>
                 </thead>
                 <tbody>
                   <AdminRow path="/dashboard" name="管理儀表板" desc="系統總覽統計、快速操作入口" />
                   <AdminRow path="/upload" name="文件上傳" desc="Word 文件 (.docx) 上傳、自動解析與轉換" />
                   <AdminRow path="/files" name="檔案管理" desc="已上傳文件列表、分享連結管理、密碼設定與期限管理" />
                   <AdminRow path="/edit" name="文件編輯" desc="文件內容編輯、章節結構調整、樣式設定" />
                   <AdminRow path="/customers" name="客戶管理 (CRM)" desc="客戶資料建檔、標籤分類、互動記錄、待辦跟進" />
                   <AdminRow path="/feedbacks" name="回饋管理" desc="讀者回饋列表、回饋狀態追蹤、跟進處理記錄" />
                   <AdminRow path="/members" name="會員管理" desc="會員列表管理、角色權限設定、文件授權管理" />
                   <AdminRow path="/notes" name="筆記系統" desc="筆記文章管理、發布狀態控制、分享連結生成" />
                   <AdminRow path="/admin/entitlements" name="產品權限" desc="產品權限授予、訂閱期限管理" />
                   <AdminRow path="/admin/api-keys" name="API 金鑰" desc="API 金鑰生成、權限設定、使用量追蹤" />
                   <AdminRow path="/admin/oauth-clients" name="OAuth 應用" desc="OAuth 客戶端註冊、回調網址設定" />
                   <AdminRow path="/admin/logs" name="系統日誌" desc="操作日誌查看、安全事件追蹤" />
                   <AdminRow path="/admin/ip-blacklist" name="IP 黑名單" desc="可疑 IP 封鎖、安全防護管理" />
                 </tbody>
               </table>
             </div>
           </section>
 
           {/* 文件分享系統 */}
           <section id="documents" className="mb-12">
             <h2 className="text-2xl font-bold text-foreground print:text-black border-b border-border pb-2 mb-6">
               文件分享系統
             </h2>
             
             <div className="space-y-6">
               <PageCard
                 title="文件閱讀頁"
                 path="/view/:shareLink"
                 description="透過分享連結閱讀文件。密碼驗證（如設定）。瀏覽次數記錄。回饋提交。"
               />
 
               <PageCard
                 title="列印預覽"
                 path="/print/:shareLink"
                 description="文件列印格式化。PDF 下載準備。使用瀏覽器原生列印功能。"
               />
 
               <PageCard
                 title="筆記閱讀頁"
                 path="/notes/:shareLink"
                 description="公開筆記閱讀。根據可見性設定控制存取（公開/會員/付費會員）。"
               />
             </div>
           </section>
 
           {/* 技術架構 */}
           <section id="tech" className="mb-12 print:break-before-page">
             <h2 className="text-2xl font-bold text-foreground print:text-black border-b border-border pb-2 mb-6">
               技術架構
             </h2>
             
             <div className="grid md:grid-cols-2 gap-6">
               <div>
                 <h3 className="text-lg font-semibold mb-4 text-foreground print:text-black">前端技術</h3>
                 <table className="w-full text-sm border-collapse">
                   <tbody>
                     <TechRow tech="React 18" desc="UI 框架" />
                     <TechRow tech="TypeScript" desc="型別安全" />
                     <TechRow tech="Vite" desc="建構工具" />
                     <TechRow tech="Tailwind CSS" desc="樣式系統" />
                     <TechRow tech="shadcn/ui" desc="元件庫" />
                     <TechRow tech="Framer Motion" desc="動畫效果" />
                     <TechRow tech="TanStack Query" desc="資料管理" />
                     <TechRow tech="React Router" desc="路由管理" />
                   </tbody>
                 </table>
               </div>
 
               <div>
                 <h3 className="text-lg font-semibold mb-4 text-foreground print:text-black">後端服務</h3>
                 <table className="w-full text-sm border-collapse">
                   <tbody>
                     <TechRow tech="PostgreSQL" desc="資料庫" />
                     <TechRow tech="Supabase Auth" desc="身份驗證" />
                     <TechRow tech="Supabase Storage" desc="檔案儲存" />
                     <TechRow tech="Edge Functions" desc="後端函數" />
                   </tbody>
                 </table>
               </div>
             </div>
 
             <h3 className="text-lg font-semibold mt-8 mb-4 text-foreground print:text-black">資料表結構</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {[
                 { name: "documents", desc: "文件資料" },
                 { name: "profiles", desc: "會員檔案" },
                 { name: "entitlements", desc: "產品權限" },
                 { name: "customers", desc: "CRM 客戶" },
                 { name: "notes", desc: "筆記系統" },
                 { name: "feedbacks", desc: "回饋追蹤" },
                 { name: "oauth_clients", desc: "OAuth 應用" },
                 { name: "user_roles", desc: "使用者角色" },
               ].map((table) => (
                 <div key={table.name} className="p-3 bg-muted/30 rounded print:bg-gray-100 print:border print:border-gray-200">
                   <code className="text-xs text-primary print:text-amber-700">{table.name}</code>
                   <p className="text-xs text-muted-foreground print:text-gray-600 mt-1">{table.desc}</p>
                 </div>
               ))}
             </div>
           </section>
 
           {/* 使用者角色 */}
           <section className="mb-12">
             <h2 className="text-2xl font-bold text-foreground print:text-black border-b border-border pb-2 mb-6">
               使用者角色
             </h2>
             
             <table className="w-full text-sm border-collapse">
               <thead>
                 <tr className="bg-muted/50 print:bg-gray-100">
                   <th className="text-left p-3 border border-border print:border-gray-300 font-semibold">角色</th>
                   <th className="text-left p-3 border border-border print:border-gray-300 font-semibold">說明</th>
                   <th className="text-left p-3 border border-border print:border-gray-300 font-semibold">權限</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td className="p-3 border border-border print:border-gray-300 font-medium">Admin</td>
                   <td className="p-3 border border-border print:border-gray-300 text-muted-foreground print:text-gray-600">管理員</td>
                   <td className="p-3 border border-border print:border-gray-300 text-muted-foreground print:text-gray-600">完整系統權限</td>
                 </tr>
                 <tr>
                   <td className="p-3 border border-border print:border-gray-300 font-medium">Helper</td>
                   <td className="p-3 border border-border print:border-gray-300 text-muted-foreground print:text-gray-600">助手</td>
                   <td className="p-3 border border-border print:border-gray-300 text-muted-foreground print:text-gray-600">協助管理，部分功能需審核</td>
                 </tr>
                 <tr>
                   <td className="p-3 border border-border print:border-gray-300 font-medium">User</td>
                   <td className="p-3 border border-border print:border-gray-300 text-muted-foreground print:text-gray-600">一般會員</td>
                   <td className="p-3 border border-border print:border-gray-300 text-muted-foreground print:text-gray-600">閱讀授權文件、管理個人資料</td>
                 </tr>
                 <tr>
                   <td className="p-3 border border-border print:border-gray-300 font-medium">訪客</td>
                   <td className="p-3 border border-border print:border-gray-300 text-muted-foreground print:text-gray-600">未登入用戶</td>
                   <td className="p-3 border border-border print:border-gray-300 text-muted-foreground print:text-gray-600">透過分享連結閱讀、瀏覽公開頁面</td>
                 </tr>
               </tbody>
             </table>
           </section>
 
           {/* 頁面路由對照表 */}
           <section id="routes" className="mb-12 print:break-before-page">
             <h2 className="text-2xl font-bold text-foreground print:text-black border-b border-border pb-2 mb-6">
               頁面路由對照表
             </h2>
             
             <h3 className="text-lg font-semibold mt-6 mb-4 text-foreground print:text-black">公開頁面</h3>
             <RouteTable routes={[
               { path: "/", name: "入口網站", component: "PortalPage" },
               { path: "/portal", name: "入口網站（別名）", component: "PortalPage" },
               { path: "/home", name: "虹靈御所首頁", component: "HomePage" },
               { path: "/chaoxuan", name: "超烜創意", component: "ChaoxuanPage" },
               { path: "/reports", name: "命理報告", component: "ReportPage" },
               { path: "/games", name: "超烜遊戲", component: "GamesPage" },
               { path: "/universe", name: "元壹宇宙", component: "UniversePage" },
               { path: "/about", name: "關於默默超", component: "AboutPage" },
               { path: "/privacy", name: "隱私政策", component: "PrivacyPolicyPage" },
               { path: "/terms", name: "服務條款", component: "TermsOfServicePage" },
             ]} />
 
             <h3 className="text-lg font-semibold mt-8 mb-4 text-foreground print:text-black">會員頁面</h3>
             <RouteTable routes={[
               { path: "/auth/login", name: "統一登入", component: "UnifiedAuthPage" },
               { path: "/account", name: "會員中心", component: "UnifiedDashboard" },
               { path: "/account/profile", name: "個人資料", component: "UnifiedProfilePage" },
               { path: "/account/products", name: "已購產品", component: "ProductsPage" },
               { path: "/oauth/authorize", name: "OAuth 授權", component: "OAuthAuthorizePage" },
             ]} />
 
             <h3 className="text-lg font-semibold mt-8 mb-4 text-foreground print:text-black">文件分享</h3>
             <RouteTable routes={[
               { path: "/view/:shareLink", name: "文件閱讀", component: "ViewPage" },
               { path: "/print/:shareLink", name: "列印預覽", component: "PrintViewPage" },
               { path: "/notes/:shareLink", name: "筆記閱讀", component: "NotePage" },
             ]} />
           </section>
 
           {/* Footer */}
           <footer className="text-center text-sm text-muted-foreground print:text-gray-500 pt-8 border-t border-border print:border-gray-300">
             <p>此文件由系統生成，反映 2026 年 2 月版本狀態。</p>
             <p className="mt-2">© 默默超完整性哲學官方入口網站</p>
           </footer>
         </article>
       </main>
 
       {/* Print styles */}
       <style>{`
         @media print {
           @page {
             margin: 2cm;
             size: A4;
           }
           body {
             -webkit-print-color-adjust: exact;
             print-color-adjust: exact;
           }
         }
       `}</style>
     </div>
   );
 };
 
 // Helper Components
 function PageCard({ 
   number, 
   title, 
   path, 
   description, 
   links 
 }: { 
   number?: number; 
   title: string; 
   path: string; 
   description: string;
   links?: { path: string; label: string }[];
 }) {
   return (
     <div className="p-5 bg-muted/20 rounded-lg border border-border/50 print:bg-gray-50 print:border-gray-200">
       <div className="flex items-start gap-3">
         {number && (
           <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center print:bg-amber-100 print:text-amber-700">
             {number}
           </span>
         )}
         <div className="flex-1">
           <h3 className="font-semibold text-foreground print:text-black">{title}</h3>
           <code className="text-xs text-primary/80 print:text-amber-600">{path}</code>
           <p className="mt-2 text-sm text-muted-foreground print:text-gray-600">{description}</p>
           {links && links.length > 0 && (
             <div className="mt-3 flex flex-wrap gap-2">
               <span className="text-xs text-muted-foreground print:text-gray-500">連結至：</span>
               {links.map((link) => (
                 <span key={link.path} className="text-xs px-2 py-1 bg-background rounded border border-border print:bg-white print:border-gray-300">
                   {link.label} <code className="text-primary/70 print:text-amber-600">{link.path}</code>
                 </span>
               ))}
             </div>
           )}
         </div>
       </div>
     </div>
   );
 }
 
 function AdminRow({ path, name, desc }: { path: string; name: string; desc: string }) {
   return (
     <tr>
       <td className="p-3 border border-border print:border-gray-300">
         <code className="text-xs text-primary print:text-amber-700">{path}</code>
       </td>
       <td className="p-3 border border-border print:border-gray-300 font-medium">{name}</td>
       <td className="p-3 border border-border print:border-gray-300 text-muted-foreground print:text-gray-600">{desc}</td>
     </tr>
   );
 }
 
 function TechRow({ tech, desc }: { tech: string; desc: string }) {
   return (
     <tr>
       <td className="p-2 border border-border print:border-gray-300 font-medium">{tech}</td>
       <td className="p-2 border border-border print:border-gray-300 text-muted-foreground print:text-gray-600">{desc}</td>
     </tr>
   );
 }
 
 function RouteTable({ routes }: { routes: { path: string; name: string; component: string }[] }) {
   return (
     <table className="w-full text-sm border-collapse">
       <thead>
         <tr className="bg-muted/50 print:bg-gray-100">
           <th className="text-left p-2 border border-border print:border-gray-300 font-semibold">路徑</th>
           <th className="text-left p-2 border border-border print:border-gray-300 font-semibold">頁面名稱</th>
           <th className="text-left p-2 border border-border print:border-gray-300 font-semibold">元件</th>
         </tr>
       </thead>
       <tbody>
         {routes.map((route) => (
           <tr key={route.path}>
             <td className="p-2 border border-border print:border-gray-300">
               <code className="text-xs text-primary print:text-amber-700">{route.path}</code>
             </td>
             <td className="p-2 border border-border print:border-gray-300">{route.name}</td>
             <td className="p-2 border border-border print:border-gray-300 text-muted-foreground print:text-gray-600">{route.component}</td>
           </tr>
         ))}
       </tbody>
     </table>
   );
 }
 
 export default DocumentationPage;