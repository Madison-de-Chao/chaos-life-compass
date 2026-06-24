import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { useSEO } from "@/hooks/useSEO";

const TOFU_URL = "https://tofu.maisondechao.com/";
const TOFU_GITHUB = "https://github.com/madison-de-chao/tofu";

const baselines = [
  { title: "說真話", body: "回答分成事實、推測、建議三層，標清楚。不把猜的當成真的。" },
  { title: "說人話", body: "先復述、先補洞、再執行。不堆術語，不裝高深。" },
  { title: "守住邊界", body: "問夠了就停，不無限追問。情緒升溫先冷卻。危險就中止。" },
];

const modes = [
  { tag: "直接打字", name: "補位模式", body: "預設模式。它先用自己的話復述一遍你的需求，把你可能漏掉的關鍵面向問回來，等你確認了才執行。有一件事要規劃或處理、但細節還沒完全想清楚的時候用。" },
  { tag: "/free", name: "直接給建議", body: "背後一樣會想清楚，但不反問你，直接給建議。想快速聽看法、不想被一句句反問的時候用。" },
  { tag: "/risk", name: "風險評估", body: "輸出一份風險清單，並標出每個風險的觸發條件。要做一個有後果的決定、想先知道哪裡可能出問題的時候用。" },
  { tag: "/propose", name: "完整提案", body: "逗福自問自答五輪，最後給你一份四段式完整提案。需要結構完整、想得比較深的方案時用。" },
  { tag: "/check", name: "事實查核", body: "把一段內容丟給它，分階段拆解、查核這段說法可不可信。收到來路不明的消息、或聽起來太好的優惠時用。" },
];

const stats = [
  { label: "實測互動", value: "244 筆，零錯誤" },
  { label: "總費用", value: "US$2.57（約 NT$80）" },
  { label: "每次互動成本", value: "約 US$0.01（約 NT$0.3）" },
  { label: "測試通過", value: "656 項" },
  { label: "推薦模型", value: "Claude Haiku（最便宜）" },
];

const trust = [
  { title: "離線也能用", body: "沒設 API key 也能用——逗福會自動進入離線模式，復述確認、補位提問、端點紀錄照常運作，只是不呼叫 AI。" },
  { title: "記憶留在你本機", body: "儲存在你電腦的 data/ 資料夾，不上傳。換電腦只要複製 data/，換 AI 模型不丟記憶。" },
  { title: "模型中立", body: "內建 Claude（Anthropic）後端，底層採 BaseLLMClient 抽象介面，能自行串接 OpenAI、DeepSeek 或任何相容後端。" },
  { title: "開源 Apache 2.0", body: "原始碼與白皮書都在 GitHub。自由使用、修改、散布、商用。" },
  { title: "公測中（Public Beta）", body: "已知限制公開不隱藏：偏好提取率偏低、長記憶會被壓縮、目前是 CLI／網頁版介面，桌面版製作中。" },
];

const TofuLandingPage = () => {
  useSEO({
    title: "逗福 Tofu｜先確認、再動手 — AI 認知中間層",
    description: "架在你和 AI 之間的一層認知中間層。不是另一個聊天機器人，是幫你把話想清楚再送出去的那個人。",
    keywords: "逗福, Tofu, AI 中間層, 認知中間層, MomoChao, Maison de Chao",
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
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                逗福 Tofu
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70">先確認、再動手。</p>
          </header>

          {/* 開場段 */}
          <section className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 mb-10">
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>AI 很會講話。問題是，你拿它的答案去做事，常常不能用。</p>
              <p>它會自己跟自己辯論、會在同一段話裡先承認再否認、會把猜測當成你的指令。你問它「幫我規劃一趟旅行」，它直接丟一份行程給你——沒問你去幾天、跟誰去、預算多少。看起來很完整，用起來全是洞。</p>
              <p className="text-white/90">逗福就是為這件事而生的：架在你和 AI 之間的一層認知中間層。它不是另一個聊天機器人，它是幫你把話想清楚再送出去的那個人。</p>
            </div>
          </section>

          {/* 它做什麼 */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-6">它做什麼</h2>
            <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-2xl p-6 md:p-8 border border-amber-500/20 space-y-5">
              <div>
                <p className="text-amber-400 font-bold mb-1">你問：</p>
                <p className="text-white/80">「幫我辦 30 人派對。」</p>
              </div>
              <div>
                <p className="text-white/40 font-bold mb-1">一般 AI：</p>
                <p className="text-white/60">直接給你一份清單——漏了預算、場地、日期。</p>
              </div>
              <div>
                <p className="text-amber-400 font-bold mb-1">逗福：</p>
                <p className="text-white/80">先把這幾個洞問回來。預算落在哪？有沒有場地？日期是哪一天？確認了才動手。</p>
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2 text-white/70">
                <p>這就是逗福的核心機制：<span className="text-amber-400 font-bold">復述確認</span>。你說的話不完整，它不急著補正，也不暗示你不夠周全。它的預設是：你只是還沒想到某個面向，它幫你把那個面向問回來。</p>
                <p className="text-white/90 italic">不是「你錯了」，是「這裡你可能還沒想到」。</p>
              </div>
            </div>
          </section>

          {/* 三條底線 */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">三條底線</h2>
            <p className="text-white/50 mb-6">逗福跟虹靈御所、元壹宇宙共用同一套底線：</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {baselines.map((b) => (
                <div key={b.title} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-amber-400 font-bold mb-2">{b.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{b.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 五種用法 */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">五種用法</h2>
            <p className="text-white/50 mb-6">逗福不只有一種用法。除了預設的「先問清楚再動手」，你還能用四個指令切換模式：</p>
            <div className="space-y-3">
              {modes.map((m) => (
                <div key={m.tag} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                    <code className="text-amber-400 font-mono text-sm bg-amber-400/10 px-2 py-0.5 rounded">{m.tag}</code>
                    <span className="text-white/90 font-bold">{m.name}</span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{m.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 為什麼可以放心用 */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-6">為什麼可以放心用</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trust.map((t) => (
                <div key={t.title} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-amber-400 font-bold mb-2">{t.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{t.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-amber-500/15 to-amber-600/5 rounded-2xl p-6 md:p-8 border border-amber-500/30 mb-10 text-center">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">開始用</h2>
            <p className="text-white/60 mb-6">不用註冊，點開就試。</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold">
                <a href={TOFU_URL} target="_blank" rel="noopener noreferrer">
                  開啟逗福網頁版
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <a href={TOFU_URL} target="_blank" rel="noopener noreferrer">一分鐘認識逗福<ExternalLink className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <a href={TOFU_URL} target="_blank" rel="noopener noreferrer">閱讀白皮書<ExternalLink className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub 原始碼<ExternalLink className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </section>

          {/* 協作資訊 */}
          <section className="text-center text-white/40 text-sm space-y-1">
            <p>逗福 Tofu 由默默超設計、與 Claude（Anthropic）共同開發。開源授權：Apache 2.0。</p>
            <p className="text-white/30 text-xs pt-4">
              逗福 Tofu — The Cognitive Middleware · 超烜創意 Maison de Chao · Based on MomoChao Thinking
            </p>
          </section>

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

export default TofuLandingPage;
