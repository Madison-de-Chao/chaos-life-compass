import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { useSEO } from "@/hooks/useSEO";

const thinkingMoves = [
  { title: "動機先行", body: "面對任何事，第一個問題不是「對不對」，是「他為什麼這樣做」。分析的起點是動機，不是結論。" },
  { title: "三層分開講", body: "所有資訊自動分成三層：可查證的事實、合理的推論、立場和價值判斷。三者不混在一起說。" },
  { title: "不接受循環驗證", body: "不拿 AI 上一輪的輸出來驗證這一輪的判斷。不把「很多人都同意」當作事情是真的。不把別人轉述你觀點之後的認同，當作獨立的外部確認。" },
  { title: "結構映射", body: "在不同領域之間看見結構上的同構關係。他操作的不是七套知識，是它們之間的映射。" },
  { title: "目的函數優先", body: "做決策前先問：「好的標準是什麼？」允許多個答案並存，但不接受混在一起的答案。" },
  { title: "命題不可偷換", body: "有效不等於合理。正確不等於讓人舒服。需要理解不等於需要修改。情境問題不等於人格問題。" },
];

const products = [
  { name: "虹靈御所", body: "四系統交叉比對的命理報告（紫微斗數、八字、西洋占星、人類圖）。不算命、不給答案、不做心靈雞湯。翻結構、問問題、給選項。", href: "/home" },
  { name: "元壹宇宙", body: "完整性導向的思維操作系統。八層架構從哲學基底到人機協作規格。核心命題：完整不是沒有缺口，是不再害怕缺口。", href: "/universe" },
  { name: "逗福 Tofu", body: "架在你和 AI 之間的認知中間層。先確認你真正要什麼、把你漏掉的面向問回來、標清楚哪句是事實哪句是猜的，確認了才動手。", href: "/tofu" },
  { name: "超烜創意 Maison de Chao", body: "AI 視覺創作品牌。三條風格線橫跨東方美學、西方奇幻、日系動畫。AI 是畫筆，不是畫家。", href: "/ai-art" },
  { name: "弧度歸零", body: "四部系列小說。用故事去講完整性哲學講不到的地方。", href: "/library" },
  { name: "AI 時代的人生避險基金", body: "把上面所有東西教給別人的課程。目標不是讓你懂命理或懂 AI，是讓你學會一套拆解問題的方式，然後不再需要我們。", href: "/momochao-system" },
];

const baselines = [
  { title: "說真話", body: "確定的說確定，不確定的標出來。不用「可能」「大概」來模糊界線。" },
  { title: "說人話", body: "不說場面話，每一段都有實際內容。像值得信任的朋友，不像客服。" },
  { title: "守住邊界", body: "分清事實、推測、立場。不替你做選擇，不承接不屬於自己的責任。" },
];

const MomochaoLandingPage = () => {
  useSEO({
    title: "默默超 MOMO CHAO｜把四十年做人的方式，變成一套別人用得上的工具",
    description: "趙偉辰，做了十六年品牌行銷與公關策略，把這些年學到的東西重新組裝成命理報告、思維操作系統、AI 認知中間層與視覺品牌。",
    keywords: "默默超, MomoChao, 趙偉辰, 完整性哲學, 元壹宇宙, 虹靈御所, 逗福 Tofu, 超烜創意",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-amber-400 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            回到入口
          </Link>

          {/* Hero */}
          <header className="mb-16 text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                默默超 MOMO CHAO
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
              把四十年做人的方式，變成一套別人用得上的工具。
            </p>
          </header>

          {/* 第一段 */}
          <section className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-400 mb-4">他做什麼</h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>趙偉辰，做了十六年品牌行銷與公關策略，服務過 Samsung、LINE、肯德基、SEIKO。</p>
              <p>然後他把這些年學到的東西拆開來，重新組裝成不一樣的東西：一套命理報告系統（虹靈御所）、一個哲學架構（元壹宇宙）、一層 AI 認知中間層（逗福 Tofu）、一個 AI 視覺創作品牌（超烜創意）。</p>
              <p className="text-white/80">這些東西看起來跨了很多領域。但在他的邏輯裡，它們共用同一套底層——他叫它「完整性哲學」：不追求正確或完美，追求的是每一個判斷都能被追溯、被修正、被承擔。</p>
            </div>
          </section>

          {/* 第二段 */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">怎麼想的</h2>
            <p className="text-white/50 mb-6">他處理問題有幾個固定的動作：</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {thinkingMoves.map((m) => (
                <div key={m.title} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-amber-400 font-bold mb-2">{m.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{m.body}</p>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-sm leading-relaxed mt-6">
              這些不是他設計出來的方法論。是分析他三年間超過兩萬則 AI 對話之後，從裡面找出來的——他一直在這樣思考，只是後來才把它們寫成文件。
            </p>
          </section>

          {/* 第三段 */}
          <section className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-2xl p-6 md:p-8 border border-amber-500/20 mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">怎麼走過來的</h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>2025 年一月，他在一段親密關係的衝突裡逐句拆解對方的邏輯。到十二月，他用品牌語言發表了完整性哲學的世界觀。</p>
              <p>中間發生的事不少：他從關係裡練出來的結構化拆解能力，後來被用在命理報告的品質流程上。在療癒過程中建立的邊界意識，後來寫進了 AI 協作協議的硬底線裡。</p>
              <p>2026 年二月，第一次系統性提煉自己的思維模式。三月把元壹宇宙放在道德經旁邊做深度比較。四月把逗福 Tofu 從概念推到產品。五月因為肺炎引發敗血性休克住院——恢復期間還在寫《弧度歸零四》。六月啟動了把這一切教給別人的課程。</p>
              <p className="text-white/90 italic">他不是先有完整的體系再去執行。他是走著走著，回頭一看，弧度長出來了。</p>
            </div>
          </section>

          {/* 第四段 做出來的東西 */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-6">做出來的東西</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((p) => (
                <Link key={p.name} to={p.href} className="block bg-white/5 hover:bg-white/10 rounded-xl p-5 border border-white/10 hover:border-amber-400/30 transition-all">
                  <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                    {p.name}
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">{p.body}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* 三條底線 */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">三條底線</h2>
            <p className="text-white/50 mb-6">所有品牌、所有產品、所有合作，共用同一套底線：</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {baselines.map((b) => (
                <div key={b.title} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-amber-400 font-bold mb-2">{b.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{b.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 收束 */}
          <section className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 mb-12">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">收束</h2>
            <div className="space-y-3 text-white/70 leading-relaxed">
              <p>他最精準的能力描述不是某個職稱。</p>
              <p className="text-white/90">是：把不同領域的東西轉換成同一套可追溯、可修正、可落地的認知操作流程。</p>
              <p>符號變成結構，結構變成工具，工具變成產品，產品變成別人用得上的東西。</p>
              <p className="text-amber-400 italic">而這套流程的成功標準只有一個——使用者最終不再需要鷹架。</p>
            </div>
          </section>

          {/* CTA */}
          <section className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold">
              <Link to="/home">進入虹靈御所<ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/ai-art">進入超烜創意</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/tofu">開啟逗福</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/library">進入藏書閣</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/universe">認識元壹宇宙</Link>
            </Button>
          </section>

          <p className="text-center text-white/30 text-xs mt-12">
            超烜創意 Maison de Chao · Based on MomoChao Thinking
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default MomochaoLandingPage;
