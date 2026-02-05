 /**
  * 頁面詳細文字內容區塊
  * 展示每個公開頁面的實際文字內容
  */
 
 // 入口網站 (PortalPage) 內容
 export function PortalPageContent() {
   return (
     <div className="space-y-6">
       <ContentBlock title="品牌標語">
         <p className="text-lg font-medium italic">「鏡子非劇本 / Mirror, Not Script」</p>
       </ContentBlock>
 
       <ContentBlock title="四大入口卡片">
         <table className="w-full text-sm border-collapse">
           <thead>
             <tr className="bg-muted/50 print:bg-gray-100">
               <th className="text-left p-2 border border-border print:border-gray-300">入口</th>
               <th className="text-left p-2 border border-border print:border-gray-300">副標題</th>
               <th className="text-left p-2 border border-border print:border-gray-300">描述文字</th>
               <th className="text-left p-2 border border-border print:border-gray-300">CTA 按鈕</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">虹靈御所</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">Rainbow Sanctuary</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">可驗證、可回看、可落地的自我探索工具鏈</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">進入虹靈御所</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">超烜創意</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">Maison de Chao</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">品牌策略與創意服務，讓你的獨特被看見</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">進入超烜創意</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">元壹宇宙</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">Yuan-Yi Universe</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">結合東方命理與決策邏輯的自我探索系統</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">進入元壹宇宙</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">默默超是誰</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">Who is MomoChao</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">一個把思考做成工具的人</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">認識默默超</td>
             </tr>
           </tbody>
         </table>
       </ContentBlock>
     </div>
   );
 }
 
 // 虹靈御所首頁 (HomePage) 內容
 export function HomePageContent() {
   return (
     <div className="space-y-6">
       <ContentBlock title="Hero 區塊">
         <div className="space-y-2">
           <p><span className="text-muted-foreground">品牌徽章：</span>「Rainbow Sanctuary × 知行如一的密法」</p>
           <p><span className="text-muted-foreground">主標題：</span><strong>虹靈御所</strong></p>
           <p><span className="text-muted-foreground">副標題：</span>可驗證、可回看、可落地的自我探索</p>
           <div className="mt-3 p-3 bg-muted/30 rounded print:bg-gray-100">
             <p className="text-muted-foreground print:text-gray-600">描述：</p>
             <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
               <li>不是算命，不是心靈雞湯，不是課程推銷。</li>
               <li>我們提供的不是「你是什麼人」的定論，</li>
               <li>而是「你可以怎麼做」的可執行路徑。</li>
             </ul>
           </div>
         </div>
       </ContentBlock>
 
       <ContentBlock title="六大內容區塊">
         <table className="w-full text-sm border-collapse">
           <thead>
             <tr className="bg-muted/50 print:bg-gray-100">
               <th className="text-left p-2 border border-border print:border-gray-300">區塊</th>
               <th className="text-left p-2 border border-border print:border-gray-300">副標題</th>
               <th className="text-left p-2 border border-border print:border-gray-300">描述</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">默默超全方位命理報告</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">可驗證、可回看、可落地</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">不是「你是什麼人」的定論，而是「你可以怎麼做」的可執行路徑。四系統交叉驗證，每個判斷都有回驗機制。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">元壹系統生態</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">旅程六站・各司其職</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">占卜決策、八字戰略、神話占星、思維訓練、療癒體驗、企業應用——你不需要用全部，只用你需要的。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">默默超的元壹筆記</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">有關命理，有關做人</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">命盤是一種語言，不是判決。這裡記錄著對命理與人生的思考與觀察。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">元壹宇宙 × 默默超思維</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">四維運作系統</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">情緒、行動、心智、價值——錯誤是材料，不是懲罰。完整不是沒有缺口，完整是不再害怕缺口。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">關於虹靈御所</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">Care & Truth</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">Care 給予溫度，Truth 給予方向。前者讓品牌有靈魂，後者讓品牌有脊椎。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">誰是默默超</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">一個把思考做成工具的人</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">我不是學霸，也不是天選之人。我只是比較固執：做事要有交代，做人要有底線。</td>
             </tr>
           </tbody>
         </table>
       </ContentBlock>
 
       <ContentBlock title="誰是默默超區塊">
         <div className="space-y-2 text-sm">
           <p><span className="text-muted-foreground">標題：</span>誰是默默超</p>
           <p><span className="text-muted-foreground">副標題：</span>一個正在學會凝視自己的人</p>
           <div className="mt-2 space-y-1">
             <p className="text-muted-foreground">圖片描述：</p>
             <ul className="list-disc list-inside text-xs">
               <li>彩虹花田中的守護者 — 用色彩點亮每一次相遇</li>
               <li>在宇宙中創造秩序的人 — 用思維照亮每一個決策</li>
             </ul>
           </div>
         </div>
       </ContentBlock>
     </div>
   );
 }
 
 // 超烜創意 (ChaoxuanPage) 內容
 export function ChaoxuanPageContent() {
   return (
     <div className="space-y-6">
       <ContentBlock title="Hero 區塊">
         <div className="space-y-2">
           <p><span className="text-muted-foreground">品牌徽章：</span>「Maison de Chao」</p>
           <p><span className="text-muted-foreground">主標題：</span><strong>超烜創意聖域</strong></p>
           <p><span className="text-muted-foreground">副標題：</span>Maison de Chao</p>
           <div className="mt-3 p-3 bg-muted/30 rounded print:bg-gray-100">
             <p className="text-muted-foreground print:text-gray-600">描述：</p>
             <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
               <li>我們將創意、藝術、身心療癒與資源整合匯聚一處</li>
               <li>為您打造一個獨一無二的靈魂聖域</li>
               <li>不僅是您靈感的孵化器，更是您個人品牌和事業夢想從構思到實現的全方位啟程之所</li>
             </ul>
           </div>
         </div>
       </ContentBlock>
 
       <ContentBlock title="品牌願景區塊">
         <div className="space-y-3">
           <p><span className="text-muted-foreground">標題：</span><strong>連結本質，創造不凡</strong></p>
           <div className="p-3 bg-muted/30 rounded print:bg-gray-100 text-sm space-y-2">
             <p>超烜創意聖域不僅是創意發想的溫床，更是心靈成長與品牌蛻變的孵化器。我們深信，真正能觸動人心的創意，源於品牌對自身靈魂與願景的深度探索，並透過整合性的表達，綻放出獨一無二的光芒。</p>
             <p>我們致力於打造一個匯聚多元專業的跨界創意平台，將<strong>美學設計</strong>、<strong>策略行銷</strong>、<strong>原創IP開發</strong>與<strong>靈性療癒</strong>融為一體。透過這四大核心支柱，為渴望突破的個人與企業，提供量身打造的品牌升級服務。</p>
           </div>
           <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground text-sm">
             「在超烜創意聖域，我們不僅創造超越想像的視覺語言，更深度塑造品牌的靈魂與識別；我們不僅精準傳遞市場訊息，更引導品牌與受眾產生深度共鳴。」
           </blockquote>
         </div>
       </ContentBlock>
 
       <ContentBlock title="六大服務場域">
         <table className="w-full text-sm border-collapse">
           <thead>
             <tr className="bg-muted/50 print:bg-gray-100">
               <th className="text-left p-2 border border-border print:border-gray-300">服務</th>
               <th className="text-left p-2 border border-border print:border-gray-300">副標題</th>
               <th className="text-left p-2 border border-border print:border-gray-300">描述</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">超烜·藝術之廊</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">AI智能繪圖∕原創IP設計∕藝術策展</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">將尖端AI智能繪圖技術與深厚的人文藝術底蘊相結合，為品牌量身打造獨一無二的視覺敘事。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">超烜·全能之門</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">全方位整合行銷顧問與活動策劃</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">深入剖析市場脈動與消費者行為，量身打造從品牌定位、內容策略到數位行銷的全方位整合方案。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">超烜·元素之庭</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">客製化行銷素材，整合圖文音樂規劃製作</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">集結設計、文案、音樂、影片等多元創意，為品牌製作全方位素材。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">超烜·創意之殿</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">原創IP開發∕角色設計∕週邊商品企劃</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">將您的創意點子轉化為具有市場價值的IP資產，為品牌開拓全新商機。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">超烜·虹靈御所</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">靈性療癒與人生定位服務</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">結合東方古老智慧與現代心理學精髓，提供客製化的深度療癒、命理諮詢與人生定位服務。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">超烜·養成之苑</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">行銷、公關與創新思維課程</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">提供一系列高品質專業課程與客製化企業內訓，協助企業與個人持續成長與升級。</td>
             </tr>
           </tbody>
         </table>
       </ContentBlock>
 
       <ContentBlock title="品牌精神 — 我們的真實價值主張">
         <table className="w-full text-sm border-collapse">
           <thead>
             <tr className="bg-muted/50 print:bg-gray-100">
               <th className="text-left p-2 border border-border print:border-gray-300">價值</th>
               <th className="text-left p-2 border border-border print:border-gray-300">描述</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">誠實且勇敢的真相探索者</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">透過客製化的品牌診斷與深層訪談，勇敢地觸及品牌核心，揭露其獨特的本質與潛藏的價值。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">細膩且深刻的文化融合者</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">將台灣豐富的在地文化元素，以當代美學視野進行轉化與創新，創造具備深厚文化底蘊的作品。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">跨界的整合共創者</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">將藝術創作的感性與品牌策略的理性相結合，提供從個人內在探索到組織文化建構的整合方案。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">永續陪伴與共振成長的夥伴</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">將客戶視為長期夥伴，提供持續性的諮詢與支持，與品牌一同經歷成長的陣痛與喜悅。</td>
             </tr>
           </tbody>
         </table>
       </ContentBlock>
 
       <ContentBlock title="合作過的客戶品牌">
         <p className="text-sm text-muted-foreground">Samsung, LINE, MediaTek, SEIKO, DIOR, COACH, 晶華酒店, 文華東方, 台灣啤酒</p>
       </ContentBlock>
     </div>
   );
 }
 
 // 元壹宇宙 (UniversePage) 內容
 export function UniversePageContent() {
   return (
     <div className="space-y-6">
       <ContentBlock title="Hero 區塊">
         <div className="space-y-2">
           <p><span className="text-muted-foreground">主標題：</span><strong>元壹宇宙</strong></p>
           <p><span className="text-muted-foreground">副標題：</span>Yuan-Yi Universe — A Civilization-Level Living Methodology</p>
           <div className="mt-3 p-3 bg-muted/30 rounded print:bg-gray-100">
             <p className="text-muted-foreground print:text-gray-600">描述：</p>
             <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
               <li>不是一套知識，而是一種活法。</li>
               <li>在複雜世界中，找到屬於自己的運作方式。</li>
             </ul>
           </div>
         </div>
       </ContentBlock>
 
       <ContentBlock title="四維運作框架">
         <table className="w-full text-sm border-collapse">
           <thead>
             <tr className="bg-muted/50 print:bg-gray-100">
               <th className="text-left p-2 border border-border print:border-gray-300">維度</th>
               <th className="text-left p-2 border border-border print:border-gray-300">英文</th>
               <th className="text-left p-2 border border-border print:border-gray-300">描述</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">情緒</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">Emotion</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">情緒不是敵人，而是訊號。它告訴你哪裡還沒被整合，哪裡還在呼喚你的注意力。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">行動</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">Action</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">行動是思維的延伸，不是思維的對立面。真正的行動來自整合後的清晰，而非逃避式的忙碌。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">心智</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">Mindset</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">心智是你觀看世界的透鏡。當透鏡改變，世界的模樣也隨之改變。這不是欺騙，而是創造。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">價值</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">Values</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">價值是你的內在羅盤。它不是外界給你的規則，而是你在選擇中逐漸發現的自己。</td>
             </tr>
           </tbody>
         </table>
       </ContentBlock>
 
       <ContentBlock title="核心理念">
         <table className="w-full text-sm border-collapse">
           <thead>
             <tr className="bg-muted/50 print:bg-gray-100">
               <th className="text-left p-2 border border-border print:border-gray-300">理念</th>
               <th className="text-left p-2 border border-border print:border-gray-300">英文</th>
               <th className="text-left p-2 border border-border print:border-gray-300">內容</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">整體性哲學</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">The Wholeness Philosophy</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">世界缺乏的並非「正確性」，而是「完整性」。錯誤不是廢棄物，而是材料。當錯誤被排除，它無法被理解、無法被整合、無法轉化。元壹宇宙相信：納入一切，才能超越一切。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">弧度模型</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">The Arc Model</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">以「弧度模型」取代「二元模型」。所有狀態都在圓周上的不同位置，所有碎片皆為未完成的弧線，每一段皆指向圓心。好與壞、對與錯，只是角度不同，而非本質對立。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">高度整合型思維</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">High-Integration Thinking</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">不以刪除錯誤來追求秩序，而是以「整合全部」來追求穩定。情緒是資訊、失誤是材料、幻覺是可能性、錯估是線索。一切皆有用，端看你如何使用。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">鏡子非劇本</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">Mirror, Not Script</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">我們不給答案，只給倒影。真理不在預言中，而在誠實地凝視自己。命運從來不是劇本，它只是一面鏡子——你看見什麼，取決於你願意承認什麼。</td>
             </tr>
           </tbody>
         </table>
       </ContentBlock>
 
       <ContentBlock title="旅程六站 — 產品矩陣">
         <table className="w-full text-sm border-collapse">
           <thead>
             <tr className="bg-muted/50 print:bg-gray-100">
               <th className="text-left p-2 border border-border print:border-gray-300">站</th>
               <th className="text-left p-2 border border-border print:border-gray-300">名稱</th>
               <th className="text-left p-2 border border-border print:border-gray-300">角色</th>
               <th className="text-left p-2 border border-border print:border-gray-300">哲學</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">1</td>
               <td className="p-2 border border-border print:border-gray-300">元壹占卜系統 YYDS</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">決策分流器</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">鏡子非劇本，真實即命運</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">2</td>
               <td className="p-2 border border-border print:border-gray-300">四時八字人生兵法 RSBZS</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">戰略盤點器</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">將軍是你，軍團也是你</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">3</td>
               <td className="p-2 border border-border print:border-gray-300">元壹宇宙神話占星系統</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">身分映射器</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">命運是起點，選擇是終點</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">4</td>
               <td className="p-2 border border-border print:border-gray-300">默默超思維訓練系統 MMCLS</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">能力訓練器</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">思維工具箱：八階思維循環</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">5</td>
               <td className="p-2 border border-border print:border-gray-300">弧度歸零 Arc Zero</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">體驗修復器</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">完整不是沒有缺口，完整是不再害怕缺口</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">6</td>
               <td className="p-2 border border-border print:border-gray-300">東方人因洞察系統 EHFIS</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">企業應用器</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">行為洞察工具，不是命運審判工具</td>
             </tr>
           </tbody>
         </table>
       </ContentBlock>
     </div>
   );
 }
 
 // 關於默默超 (AboutPage) 內容
 export function AboutPageContent() {
   return (
     <div className="space-y-6">
       <ContentBlock title="Hero 區塊">
         <div className="space-y-2">
           <p><span className="text-muted-foreground">主標題：</span><strong>關於默默超</strong></p>
           <p><span className="text-muted-foreground">副標題：</span>About MomoChao</p>
           <p className="mt-2 italic text-muted-foreground">「在人機協作的末法時代，你不需要被告知你是誰，你只需要一面夠清晰的鏡子。」</p>
         </div>
       </ContentBlock>
 
       <ContentBlock title="鏡子非劇本區塊">
         <div className="space-y-2 text-sm">
           <p><span className="text-muted-foreground">標題：</span>鏡子非劇本</p>
           <p><span className="text-muted-foreground">副標題：</span>Mirror, Not Script</p>
           <p className="mt-2">描述：我們不提供「命定結論」，我們提供「可驗證的下一步」。每個判斷都標註依據，區分事實/推導/假設。</p>
           <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground mt-3">
             「默默超思維一句話：把話說清楚，把事做完整；自由不是有選擇權，而是可以選擇不選。」— 創辦人故事
           </blockquote>
         </div>
       </ContentBlock>
 
       <ContentBlock title="三大方法論">
         <p className="text-sm mb-3 text-muted-foreground">喚醒 Awaken・篩選 Filter・賦能 Empower</p>
         <table className="w-full text-sm border-collapse">
           <thead>
             <tr className="bg-muted/50 print:bg-gray-100">
               <th className="text-left p-2 border border-border print:border-gray-300">方法</th>
               <th className="text-left p-2 border border-border print:border-gray-300">英文</th>
               <th className="text-left p-2 border border-border print:border-gray-300">內容</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">喚醒</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">Awaken</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">提醒你本來就有，請別放棄相信自己。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">篩選</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">Filter</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">分辨對自己真正有用的東西，而非盲從價值標籤。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">賦能</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">Empower</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground">幫你拿回你原本的權力，最終選擇權永遠在你手裡。</td>
             </tr>
           </tbody>
         </table>
       </ContentBlock>
 
       <ContentBlock title="品牌故事區塊">
         <div className="space-y-2 text-sm">
           <p><span className="text-muted-foreground">標題：</span>品牌的誕生</p>
           <p><span className="text-muted-foreground">副標題：</span>The Birth of Rainbow Sanctuary</p>
           <div className="mt-3 p-3 bg-muted/30 rounded print:bg-gray-100 space-y-2">
             <p>虹靈御所的誕生，源於一個簡單的信念：每個人都值得被好好理解。</p>
             <p>不是被貼標籤，不是被預測命運，而是被看見那些連自己都忽略的角落。</p>
             <p>默默超相信，當你真正理解自己的運作方式，你就不再需要外界的答案。</p>
             <p className="font-medium">因為最好的答案，從來都在你裡面。</p>
           </div>
         </div>
       </ContentBlock>
 
       <ContentBlock title="Care & Truth 區塊">
         <div className="grid md:grid-cols-2 gap-4 text-sm">
           <div className="p-3 bg-muted/30 rounded print:bg-gray-100">
             <p className="font-medium text-primary print:text-amber-700">Care（關懷）</p>
             <p className="text-muted-foreground mt-1">我們用心聆聽每一個故事，因為每個人都值得被溫柔對待。</p>
           </div>
           <div className="p-3 bg-muted/30 rounded print:bg-gray-100">
             <p className="font-medium text-primary print:text-amber-700">Truth（真相）</p>
             <p className="text-muted-foreground mt-1">我們誠實面對每一個議題，因為真相是自由的起點。</p>
           </div>
         </div>
       </ContentBlock>
     </div>
   );
 }
 
 // 命理報告 (ReportPage) 內容
 export function ReportPageContent() {
   return (
     <div className="space-y-6">
       <ContentBlock title="Hero 區塊">
         <div className="space-y-2">
           <p><span className="text-muted-foreground">品牌徽章：</span>「Rainbow Sanctuary × 專業命理報告」</p>
           <p><span className="text-muted-foreground">主標題：</span><strong>看見自己，是最深的修行</strong></p>
           <p><span className="text-muted-foreground">描述：</span>四系統命理分析・可驗證可落地</p>
         </div>
       </ContentBlock>
 
       <ContentBlock title="你可能正在經歷這些困境">
         <table className="w-full text-sm border-collapse">
           <thead>
             <tr className="bg-muted/50 print:bg-gray-100">
               <th className="text-left p-2 border border-border print:border-gray-300">困境</th>
               <th className="text-left p-2 border border-border print:border-gray-300">描述</th>
               <th className="text-left p-2 border border-border print:border-gray-300">詳情</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">人生迷茫</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">不知道自己的天賦和方向，感覺在原地打轉</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">缺乏對自己運作模式的清晰認知，優勢與盲點混在一起，無法有效發揮</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">關係困擾</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">總是遇到相似的關係模式，不知道問題出在哪</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">不了解自己在關係中的需求與投射，重複相同的互動劇本</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">事業瓶頸</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">工作不順利，不知道什麼環境真正適合自己</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">職涯發展停滯，缺乏對自身能量類型與適合策略的認知</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">決策困難</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">重要抉擇時猶豫不決，事後常感後悔</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">缺乏清晰的內在權威與決策機制，容易被外界聲音干擾</td>
             </tr>
           </tbody>
         </table>
       </ContentBlock>
 
       <ContentBlock title="四大命理系統交叉驗證">
         <table className="w-full text-sm border-collapse">
           <thead>
             <tr className="bg-muted/50 print:bg-gray-100">
               <th className="text-left p-2 border border-border print:border-gray-300">系統</th>
               <th className="text-left p-2 border border-border print:border-gray-300">意義</th>
               <th className="text-left p-2 border border-border print:border-gray-300">描述</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">紫微斗數</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">命宮格局</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">揭示你的先天人格結構、內在驅動力與一生運勢走向，如同靈魂的藍圖設計。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">八字</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">五行能量</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">解析你的能量組成與流動模式，呈現事業、財運、感情的時空週期。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">占星</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">星盤配置</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">透過行星相位與宮位，映照你的心理動態、關係模式與人生課題。</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">人類圖</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700">能量類型</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">定義你的決策權威與能量運作方式，找到最適合你的行動策略。</td>
             </tr>
           </tbody>
         </table>
       </ContentBlock>
 
       <ContentBlock title="常見問題">
         <div className="space-y-3">
           {[
             { q: "我不懂命理也能看懂嗎？", a: "可以。報告會把命盤語言轉成「你在生活裡看得到的現象」與「你做得到的建議」，完全不需要任何命理基礎。" },
             { q: "多久可以收到報告？", a: "依版本而定：基本版 5-9 天、標準版 7-12 天、旗艦版 12-18 個工作天。每份報告皆為人工精密解讀，確保品質。" },
             { q: "你會不會寫得很玄，或很像算命？", a: "不會。我們的核心是「鏡子，不是劇本」。拒絕預言式的結論，只呈現可驗證的模式與可執行的建議。" },
             { q: "與傳統算命有什麼不同？", a: "傳統算命告訴你「會發生什麼」，我們告訴你「你是如何運作的」。這是使用說明書，不是預言書。" },
           ].map((item, i) => (
             <div key={i} className="p-3 bg-muted/20 rounded print:bg-gray-50 print:border print:border-gray-200">
               <p className="font-medium text-sm">{item.q}</p>
               <p className="text-sm text-muted-foreground mt-1">{item.a}</p>
             </div>
           ))}
         </div>
       </ContentBlock>
     </div>
   );
 }
 
 // 超烜遊戲 (GamesPage) 內容
 export function GamesPageContent() {
   return (
     <div className="space-y-6">
       <ContentBlock title="Hero 區塊">
         <div className="space-y-2">
           <p><span className="text-muted-foreground">品牌徽章：</span>「元壹系統生態・旅程六站」</p>
           <p><span className="text-muted-foreground">主標題：</span><strong>互動式自我探索</strong></p>
           <div className="mt-3 p-3 bg-muted/30 rounded print:bg-gray-100">
             <p className="text-muted-foreground print:text-gray-600">描述：</p>
             <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
               <li>多站不是分散，是分工。每一站只解決一個特定階段的問題。</li>
               <li>你不需要用全部，只用你需要的。</li>
             </ul>
           </div>
           <div className="flex gap-2 mt-2">
             <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded print:bg-amber-100 print:text-amber-700">可驗證的下一步</span>
             <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded print:bg-amber-100 print:text-amber-700">可回看的機制</span>
           </div>
         </div>
       </ContentBlock>
 
       <ContentBlock title="分類篩選系統">
         <div className="flex flex-wrap gap-2 text-sm">
           {["全部站點", "命理類", "思維訓練類", "療癒類", "企業應用"].map((cat) => (
             <span key={cat} className="px-3 py-1 bg-muted/50 rounded print:bg-gray-100 print:border print:border-gray-300">
               {cat}
             </span>
           ))}
         </div>
       </ContentBlock>
 
       <ContentBlock title="六大遊戲站點">
         <table className="w-full text-sm border-collapse">
           <thead>
             <tr className="bg-muted/50 print:bg-gray-100">
               <th className="text-left p-2 border border-border print:border-gray-300">站</th>
               <th className="text-left p-2 border border-border print:border-gray-300">名稱</th>
               <th className="text-left p-2 border border-border print:border-gray-300">角色</th>
               <th className="text-left p-2 border border-border print:border-gray-300">分類</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">1</td>
               <td className="p-2 border border-border print:border-gray-300">元壹占卜系統 YYDS</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">決策分流器</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">命理類</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">2</td>
               <td className="p-2 border border-border print:border-gray-300">四時八字人生兵法 RSBZS</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">戰略盤點器</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">命理類</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">3</td>
               <td className="p-2 border border-border print:border-gray-300">元壹宇宙神話占星系統</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">身分映射器</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">命理類</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">4</td>
               <td className="p-2 border border-border print:border-gray-300">默默超思維訓練系統 MMCLS</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">能力訓練器</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">思維訓練類</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">5</td>
               <td className="p-2 border border-border print:border-gray-300">弧度歸零 Arc Zero</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">體驗修復器</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">療癒類</td>
             </tr>
             <tr>
               <td className="p-2 border border-border print:border-gray-300 font-medium">6</td>
               <td className="p-2 border border-border print:border-gray-300">東方人因洞察系統 EHFIS</td>
               <td className="p-2 border border-border print:border-gray-300 text-muted-foreground text-xs">企業應用器</td>
               <td className="p-2 border border-border print:border-gray-300 text-primary print:text-amber-700 text-xs">企業應用</td>
             </tr>
           </tbody>
         </table>
       </ContentBlock>
     </div>
   );
 }
 
 // Helper Component
 function ContentBlock({ title, children }: { title: string; children: React.ReactNode }) {
   return (
     <div className="border-l-2 border-primary/30 pl-4 print:border-amber-300">
       <h4 className="font-semibold text-foreground print:text-black mb-3">{title}</h4>
       {children}
     </div>
   );
 }