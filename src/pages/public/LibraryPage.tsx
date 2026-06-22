import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, BookOpen, Sparkles, Stars } from "lucide-react";
import PublicLayout from "@/components/public/PublicLayout";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

interface Series {
  id: string;
  title: string;
  subtitle: string;
  hook: string;
  description: string;
  takeaway: string;
  read: { label: string; url: string };
  tool: { label: string; url: string };
  credit: string;
  icon: typeof BookOpen;
  accent: string;
  border: string;
  glow: string;
  parts: { title: string; body: string }[];
}

const SERIES: Series[] = [
  {
    id: "arc-to-zero",
    title: "弧度歸零",
    subtitle: "全四部",
    hook: "你有沒有在跟自己打一場不需要打的仗？",
    description: "這個系列有四部，每一部用不同的角度問同一件事。",
    takeaway: "也許不是一個答案，而是一個停頓。讓你在下次想刪掉什麼「沒用的」自己之前，多停一秒。",
    tool: { label: "互動式小說版本 atzo.rainbow-sanctuary.com", url: "https://atzo.rainbow-sanctuary.com" },
    credit:
      "第一部至第三部由默默超與 Claude（Anthropic）共同創作，第二部加入 Gemini（Google）擔任程序檢視。第四部由默默超與 Claude 在一次連續對話中完成初稿。",
    icon: BookOpen,
    accent: "text-amber-300",
    border: "border-amber-400/20",
    glow: "rgba(245, 158, 11, 0.25)",
    parts: [
      {
        title: "第一部・壹",
        body: "林壹覺得自己做什麼都不對。她走進「元壹境」，遇到蘇軾、王陽明、武則天、司馬遷、曼德拉、林肯。他們不是來講大道理，而是告訴她：我也碎過。你有沒有把評價自己的權力，拱手讓給了全世界？",
      },
      {
        title: "第二部・伊",
        body: "換到「伊」的視角——林壹心裡那個被否認了三十年的存在。你以為伊是陰影面，是你想消滅的自己。但讀完你會發現，伊可能是你壓了一輩子都不敢承認的才華和光。",
      },
      {
        title: "第三部・一",
        body: "一個 AI 讀完前兩部之後寫下的紀錄。不是書評，是見證。Claude 承認自己被故事改變，而默默超決定把這份改變永遠記住。保留那個瞬間最真實的樣子。",
      },
      {
        title: "第四部・肆",
        body: "你按下了「確定刪除」。然後你醒在一個沒有時鐘、沒有地圖、沒有貨幣的地方。你會遇到王陽明、林黛玉、潘金蓮、玄奘——他們只是在過自己的日子。讀到最後，同一個刪除視窗再次出現。這次你會按哪個？",
      },
    ],
  },
  {
    id: "tarot-adventure",
    title: "虹靈御所塔羅大冒險",
    subtitle: "全七冊",
    hook: "你有沒有試過，不是背一張牌的意思，而是把那張牌走過一遍？",
    description:
      "牌義不是知識，是經驗。你得走過那張牌，身體才會記住。這套故事集讓你以第二人稱走進虹靈御所，穿越七十八張牌。",
    takeaway: "牌義不用背。走過的路，身體會記得。",
    tool: { label: "弧度掌控外掛 tarot.rainbow-sanctuary.com", url: "https://tarot.rainbow-sanctuary.com" },
    credit:
      "由四位 AI 模型與人類作者默默超共同完成：Claude Opus 4.6（聖杯王國＋宮廷牌＋全系列審核）、ChatGPT 5.2 Thinking（權杖王國）、DeepSeek（寶劍王國）、Gemini 3 PRO（錢幣王國）。",
    icon: Sparkles,
    accent: "text-rose-300",
    border: "border-rose-400/20",
    glow: "rgba(244, 63, 94, 0.25)",
    parts: [
      { title: "第一冊｜大阿爾克那篇", body: "二十二個人生階段。從愚者的初心走到世界的圓滿。" },
      { title: "第二冊｜聖杯王國篇", body: "學情感。湖水的溫度先碰到掌心，然後你才知道那是什麼。" },
      { title: "第三冊｜權杖王國篇", body: "學行動。火燒得起來，但燒之前你得知道在燒什麼。" },
      { title: "第四冊｜寶劍王國篇", body: "學思考。七件隨身物品，每一件都會在意想不到的時候出現。" },
      { title: "第五冊｜錢幣王國篇", body: "學建設。從種子到收成，從「想要」到「真的做到」。" },
      { title: "第六冊｜宮廷牌篇", body: "不再問「發生什麼事」，改問「你是誰」。四種元素在同一個房間裡。" },
      { title: "第七冊｜作者群心得篇", body: "四個 AI 和一個人類怎麼一起寫完這件事。" },
    ],
  },
  {
    id: "yuan-yi-myth",
    title: "元壹宇宙神話故事集",
    subtitle: "全四卷",
    hook: "如果連神都會迷惘，你又為什麼不允許自己不完美？",
    description:
      "重新詮釋二十四位東西方神祇。每一位都有正位與逆位，走過從分裂到整合的完整弧度。再加上五聖獸侍靈——願意跟你並肩走的夥伴。",
    takeaway: "一面鏡子。讓你在神的掙扎裡看見自己——完整不是沒有缺口，是不再害怕缺口。",
    tool: { label: "元壹宇宙神話占星系統 star.rainbow-sanctuary.com", url: "https://star.rainbow-sanctuary.com" },
    credit: "默默超與 Claude（Anthropic）共同創作。",
    icon: Stars,
    accent: "text-violet-300",
    border: "border-violet-400/20",
    glow: "rgba(139, 92, 246, 0.25)",
    parts: [
      { title: "卷壹 + 卷貳｜二十四位東西方神祇", body: "十二星座，東西方各一位對應神祇。從阿瑞斯與哪吒到波塞頓與洛神。" },
      { title: "卷叁｜五聖獸侍靈", body: "青龍、朱雀、白虎、玄武、麒麟。牠們的弧度，也是你的。" },
      { title: "卷肆｜東西交映錄", body: "十二組東西方神祇的深度對照。跨越文化看人性的通則。" },
    ],
  },
];

export default function LibraryPage() {
  useSEO({
    title: "虹靈御所藏書閣 | 線上閱讀庫",
    description:
      "弧度歸零、塔羅大冒險、元壹宇宙神話——三套原創系列，二十多本書，全部免費。當閱讀不只是閱讀，而是一場安靜的重新認識自己。",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        {/* Header */}
        <div className="px-4 pt-6 pb-2 max-w-5xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-amber-300 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回傳送門
          </Link>
        </div>

        {/* Hero */}
        <section className="px-4 pt-8 pb-12 max-w-5xl mx-auto text-center">
          <p className="text-amber-300/70 text-xs tracking-[0.3em] uppercase mb-4">Rainbow Sanctuary Library</p>
          <h1 className="text-3xl md:text-5xl font-light text-white mb-6 tracking-wide">虹靈御所藏書閣</h1>
          <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
            當閱讀不只是閱讀，<br className="md:hidden" />
            而是一場安靜的重新認識自己。
          </p>
          <div className="mt-10 max-w-2xl mx-auto space-y-4 text-white/60 text-[15px] leading-loose text-left md:text-center">
            <p>這裡收錄的故事，沒有一本是「看完就好」的那種。</p>
            <p>它們不會教你道理，不會替你下結論，也不會在最後一頁告訴你「答案就是愛自己」。</p>
            <p>但它們會留下一些東西在你心裡——可能是一個你不敢問自己的問題，可能是一面你一直轉頭不看的鏡子，也可能只是一個讓你停下來深呼吸的瞬間。</p>
            <p className="text-amber-200/70">每個系列都有對應的互動工具，讓你從「讀到」變成「用到」。</p>
            <p className="text-white/80">全部免費。打開就讀。</p>
          </div>
        </section>

        {/* Series */}
        <section className="px-4 pb-20 max-w-5xl mx-auto space-y-10">
          {SERIES.map((s, idx) => {
            const Icon = s.icon;
            return (
              <article
                key={s.id}
                className={`relative rounded-2xl border ${s.border} bg-white/[0.02] backdrop-blur-sm p-6 md:p-10 overflow-hidden`}
                style={{ boxShadow: `0 0 60px ${s.glow}` }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full border ${s.border} flex items-center justify-center bg-black/40`}
                  >
                    <Icon className={`w-6 h-6 ${s.accent}`} />
                  </div>
                  <div>
                    <p className={`text-xs tracking-[0.25em] uppercase ${s.accent} mb-1`}>
                      系列 {String(idx + 1).padStart(2, "0")} · {s.subtitle}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-light text-white">{s.title}</h2>
                  </div>
                </div>

                <p className={`text-lg md:text-xl ${s.accent} font-light mb-4`}>{s.hook}</p>
                <p className="text-white/70 leading-loose mb-8">{s.description}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {s.parts.map((p) => (
                    <div
                      key={p.title}
                      className="rounded-xl border border-white/5 bg-black/30 p-5 hover:border-white/15 transition-colors"
                    >
                      <h3 className="text-white font-medium mb-2 text-[15px]">{p.title}</h3>
                      <p className="text-white/55 text-sm leading-relaxed">{p.body}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-black/40 border border-white/5 p-5 mb-6">
                  <p className="text-white/50 text-xs tracking-widest uppercase mb-2">你會帶走的東西</p>
                  <p className="text-white/80 leading-relaxed">{s.takeaway}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <Button
                    asChild
                    className="bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-full px-6 h-12 active:scale-[0.97] transition-transform"
                  >
                    <a href={s.tool.url} target="_blank" rel="noopener noreferrer">
                      開始閱讀 / 使用工具
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                  <span className="text-white/40 text-xs break-all">{s.tool.label}</span>
                </div>

                <p className="text-white/35 text-xs leading-relaxed border-t border-white/5 pt-4">
                  協作資訊：{s.credit}
                </p>
              </article>
            );
          })}
        </section>

        {/* Footer */}
        <section className="px-4 pb-24 max-w-3xl mx-auto text-center">
          <div className="space-y-4 text-white/60 leading-loose">
            <p className="text-amber-200/80 text-lg">三套系列，二十多本書，全部免費。</p>
            <p>每一本的底層都在問同一件事：<br />你有沒有在否認你已經是的那個自己？</p>
            <p className="text-white/45 text-sm pt-6">
              不是因為不值錢才免費。<br />
              是因為這些東西需要先被看見，才有機會真的幫到人。
            </p>
          </div>
          <div className="mt-12 text-white/30 text-xs space-y-1 tracking-wider">
            <p>虹靈御所 Rainbow Sanctuary</p>
            <p>超烜創意 Maison de Chao</p>
            <p>Based on MomoChao Thinking</p>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
