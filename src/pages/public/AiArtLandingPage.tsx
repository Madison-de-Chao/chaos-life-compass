import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { useSEO } from "@/hooks/useSEO";

const ART_URL = "https://designs.momo-chao.com/";

const mainLines = [
  {
    name: "東方原創 Oriental Originals",
    tagline: "在花與墨之間，找到屬於東方的視覺語言。",
    body: "花開若夢（花與人的平等對視）、水墨武俠（劍客與巨龍）、國風星座（東方美學重繪十二星座）、粉墨乾坤（京劇乾旦，男身演繹旦角之美——講的是「成為」）、坤儀星河（降臨星河尺度的女性神格——講的是「本是」）。一個向上扮成，一個向下降臨；一個問「我能成為誰」，一個答「我本是誰」。",
  },
  {
    name: "IP 文化轉譯 Cultural Reimagination",
    tagline: "經典故事的另一種面貌。",
    body: "以東方語彙重新詮釋西方經典——國風美女與野獸、灰姑娘、魔髮奇緣。不是翻譯，是用另一套文化語言重新說同一個故事。",
  },
  {
    name: "概念企劃 Concept Projects",
    tagline: "不只是圖，是可以展開的世界。",
    body: "遺忘水母（普通女孩仰望天空的23張側臉）、少年魔法師、雨天小可愛（繡球花雨中的療癒小貓）、實驗品 XX3123（暗夜花雨中的藍眼少年）、時空之門（少女站在古今交界的圓環前）。每個企劃都不只是一張圖——是一個有角色、有世界觀、可以繼續長出東西的起點。",
  },
];

const styleLines = [
  { title: "東方美學", body: "花、墨、京劇、神格。" },
  { title: "西方奇幻", body: "童話與經典 IP 的再詮釋。" },
  { title: "日系動畫", body: "概念企劃中的角色與世界觀。" },
];

const services = [
  { title: "成品圖授權", body: "個人使用 NT$300–600／張，商業使用 NT$1,500–3,500／張，獨家買斷另議。" },
  { title: "客製化委託", body: "基礎款 NT$1,500–2,500（3–5 張選圖）、標準款 NT$3,500–6,000（6–10 張選圖）、精品款 NT$8,000 起（完整系列 6–12 張）。" },
  { title: "系列創作合作", body: "品牌視覺 NT$15,000 起（品牌 IP、系列插畫、概念美術）。" },
];

const faqs = [
  { q: "這些圖是 AI 生成的嗎？", a: "是。所有作品以 AI 工具輔助生成，但創作方向、視覺策略、系列概念與品質篩選由 MOMO 全程主導。" },
  { q: "我可以直接下載使用嗎？", a: "頁面上的圖片為瀏覽用低解析度版本。購買授權後提供高解析度原檔。" },
  { q: "委託作品的版權歸誰？", a: "預設由 MOMO 保留著作權，客戶取得使用授權。如需買斷，費用另計。" },
];

const AiArtLandingPage = () => {
  useSEO({
    title: "超烜創意 Maison de Chao｜AI 是畫筆，不是畫家",
    description: "AI 視覺創作品牌。三條風格線橫跨東方美學、西方奇幻、日系動畫。創作方向、視覺策略、系列概念與品質篩選全部由人主導。",
    keywords: "超烜創意, Maison de Chao, AI 繪圖, AI 視覺, MomoChao, 東方原創",
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
          <header className="mb-14 text-center">
            <p className="text-amber-400/80 font-mono text-sm tracking-widest mb-3">AI ART · MAISON DE CHAO</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                超烜創意 Maison de Chao
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70">AI 是畫筆，不是畫家。</p>
          </header>

          {/* 開場段 */}
          <section className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 mb-10">
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>這裡的每一張圖都是 AI 生成的。</p>
              <p>但創作方向、視覺策略、系列概念跟最後的品質篩選，全部是人做的。MOMO（默默超）做的。</p>
              <p className="text-white/90">AI 負責畫。人負責決定畫什麼、為什麼畫、夠不夠好。畫筆跟畫家的差別就在這裡——畫筆不會自己決定要不要收手，人會。</p>
            </div>
          </section>

          {/* 核心視角 */}
          <section className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-2xl p-6 md:p-8 border border-amber-500/20 mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">核心視角</h2>
            <div className="space-y-3 text-white/70 leading-relaxed">
              <p>所有系列都有一個反覆出現的東西：<span className="text-amber-400">人在比自己更大的存在面前，保持姿態但承認渺小。</span></p>
              <p>花開若夢裡花與人的平等對視是這個。水墨武俠裡劍客面對巨龍的背影是這個。遺忘水母裡普通女孩仰望天空的側臉也是這個。</p>
              <p className="text-white/90 italic">這不是刻意經營的風格，是 MOMO 看世界的方式。</p>
            </div>
          </section>

          {/* 三條主線 */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-6">三條主線</h2>
            <div className="space-y-4">
              {mainLines.map((line) => (
                <div key={line.name} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-amber-400 font-bold text-lg mb-1">{line.name}</h3>
                  <p className="text-white/80 mb-3 italic">{line.tagline}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{line.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 三條風格線 */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">三條風格線</h2>
            <p className="text-white/50 mb-6">所有作品橫跨三條風格線：</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {styleLines.map((s) => (
                <div key={s.title} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-amber-400 font-bold mb-2">{s.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-sm italic">這三條線不互斥。有些系列同時踩兩條甚至三條。風格不是框架，是材料。</p>
          </section>

          {/* 服務概覽 */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-6">服務概覽</h2>
            <div className="space-y-3 mb-4">
              {services.map((s) => (
                <div key={s.title} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-amber-400 font-bold mb-2">{s.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-sm">製作週期確認需求後 7–14 個工作天交件。急件加收 30%。</p>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-6">FAQ 精選</h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <div key={f.q} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-white font-bold mb-2">{f.q}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-amber-500/15 to-amber-600/5 rounded-2xl p-8 border border-amber-500/30 mb-10 text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold">
              <a href={ART_URL} target="_blank" rel="noopener noreferrer">
                進入超烜創意，看完整作品集
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </section>

          <p className="text-center text-white/30 text-xs">
            超烜創意 Maison de Chao · MOMO's Visual Universe
          </p>

          <div className="flex justify-center mt-10">
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />回到入口</Link>
            </Button>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default AiArtLandingPage;
