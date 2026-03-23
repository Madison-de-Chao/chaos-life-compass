/**
 * 默默超元壹教育體系
 * 語氣：直誠銳利。四層課程體系。
 */

import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, GraduationCap, BookOpen, Brain, Target, Zap, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { useSEO } from "@/hooks/useSEO";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const courseLevels = [
  {
    level: "第一層",
    title: "認識自己",
    subtitle: "入門",
    audience: "完全沒有接觸過命理或自我探索工具的人。",
    icon: BookOpen,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/20",
    courses: [
      { name: "命盤不是判決書", content: "四系統基礎導讀——八字、紫微、占星、人類圖各自在看什麼", takeaway: "知道你手上有哪些地圖，但不被任何一張地圖綁住" },
      { name: "情緒是原始資料", content: "決策鏈的真實順序：情緒 → 直覺 → 理性合理化", takeaway: "學會在做決定之前先問自己「我的身體說什麼」而不是「我應該怎麼做」" },
      { name: "Zone A/B/C 實戰", content: "用自己的真實案例練習事實/推測/立場的分層", takeaway: "一套可以在任何對話中使用的溝通框架" },
    ],
  },
  {
    level: "第二層",
    title: "拆解模式",
    subtitle: "進階",
    audience: "已經有一定自我覺察基礎，想深入理解自己運作模式的人。",
    icon: Brain,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/20",
    courses: [
      { name: "四系統交叉比對", content: "實際操作：同一個問題放進四個系統，看哪裡指向同一個方向、哪裡互相矛盾", takeaway: "學會用矛盾來逼出真正的選擇，而不是找一個系統來替你決定" },
      { name: "思維病毒掃描", content: "十大思維病毒辨識與拆除：責任外包、二元切割、概念偷換…", takeaway: "知道自己最常用哪些病毒來逃避，並且有具體方法處理" },
      { name: "標籤拆除工作坊", content: "「我就是理科腦」「我太感性了」「我不擅長這個」——這些標籤怎麼變成不行動的許可", takeaway: "理解標籤是安慰不是事實，學會在標籤出現的時候先暫停" },
      { name: "ABC 誠實校準", content: "精確、有邊界、可修正——練習在對話中區分「我確定的」「我不確定的」「我錯了的」", takeaway: "一套對自己和對別人都適用的誠實標準" },
    ],
  },
  {
    level: "第三層",
    title: "實戰決策",
    subtitle: "高階",
    audience: "需要處理具體人生決策（職涯、關係、創業）的人。",
    icon: Target,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/20",
    courses: [
      { name: "決策壓力測試", content: "把你正在面對的真實決策拆成 Zone A/B/C，用四系統交叉比對做壓力測試", takeaway: "不是一個答案，是一張看得清楚的決策地圖" },
      { name: "反噬模擬", content: "每個選擇都有順勢面和反噬面。我們把兩面都攤出來，你自己選", takeaway: "做決定之前就知道最壞情況是什麼，而不是做完才後悔" },
      { name: "弧度歸零體驗", content: "不是認知課，是情緒體驗。讓你被看見，而不是被分析", takeaway: "如果你卡住的不是思維而是情緒，這堂課讓你有機會先把情緒放下來" },
    ],
  },
  {
    level: "第四層",
    title: "帶人",
    subtitle: "講師 / 團隊領導",
    audience: "想把這套方法用在帶團隊、帶人的場景中的人。",
    icon: Users,
    color: "from-purple-500/20 to-indigo-500/20",
    borderColor: "border-purple-500/20",
    courses: [
      { name: "Zone A/B/C 在團隊溝通中的應用", content: "怎麼讓團隊成員區分事實、推測、立場，減少無意義的爭論", takeaway: "一套可以直接導入團隊的溝通規則" },
      { name: "EHFIS 企業應用", content: "用行為假設工具理解成員的協作模式，但不做人事判斷", takeaway: "知道每個成員的能量怎麼跑，但不用命理替他們貼標籤" },
      { name: "不預設不畫地自限 — 領導者版", content: "你是不是用「我不擅長」讓自己不去碰該碰的事？帶人的時候你是不是在替團隊畫地自限？", takeaway: "看見自己和團隊的限制信念，然後決定要不要拆掉它" },
    ],
  },
];

const MomochaoEducationPage = () => {
  useSEO({
    title: "教育體系 | 默默超的元壹體系",
    description: "課程的衡量標準只有一個：上完之後，你能不能自己走。四層課程體系，從認識自己到帶人。",
    keywords: "默默超, 教育體系, 元壹體系, 課程, 思維訓練, Zone ABC",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <Link to="/momochao-system" className="inline-flex items-center gap-2 text-white/50 hover:text-amber-400 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            默默超的元壹體系
          </Link>

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">不是教你知識，是練你怎麼用</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                默默超元壹教育體系 Education System
              </span>
            </h1>

            <div className="max-w-2xl mx-auto space-y-4 text-white/60 leading-relaxed">
              <p>課程的衡量標準只有一個：上完之後，你能不能自己走。</p>
              <p className="text-white/40">如果上完還是得靠我，那課程就失敗了。</p>
            </div>
          </motion.div>

          {/* Teaching Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amber-500/5 to-transparent border-l-2 border-amber-500/50 rounded-r-xl p-6 mb-16"
          >
            <div className="space-y-3 text-white/60">
              <p>我不教你「什麼是對的」。我教你「怎麼判斷什麼是對的」。</p>
              <p>上完課你應該更不需要我，而不是更依賴我。</p>
              <p className="text-white/40 text-sm">如果你上完課覺得「老師好厲害」但自己沒有變強，那我失敗了。</p>
            </div>
          </motion.div>

          {/* Course Levels */}
          <div className="space-y-12 mb-16">
            {courseLevels.map((level, levelIndex) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: levelIndex * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center`}>
                    <level.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-white">
                      {level.level}｜{level.title}
                    </h2>
                    <p className="text-amber-400/60 text-sm">{level.subtitle}</p>
                  </div>
                </div>

                <p className="text-white/50 text-sm mb-4 pl-16">對象：{level.audience}</p>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-0 md:pl-16"
                >
                  {level.courses.map((course) => (
                    <motion.div
                      key={course.name}
                      variants={itemVariants}
                      className={`bg-white/5 rounded-xl p-5 border ${level.borderColor}`}
                    >
                      <h3 className="text-sm font-bold text-white mb-2">{course.name}</h3>
                      <p className="text-white/50 text-xs leading-relaxed mb-3">{course.content}</p>
                      <div className="border-t border-white/10 pt-3">
                        <p className="text-amber-400/70 text-xs">
                          <span className="font-medium">你會帶走：</span> {course.takeaway}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Teaching Commitment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-2xl p-6 md:p-8 border border-amber-500/20 mb-12"
          >
            <h2 className="text-xl font-serif font-bold text-white mb-4">教學承諾 Teaching Commitment</h2>
            <div className="space-y-3 text-white/60 leading-relaxed">
              <p>這些課程都建立在虹靈御所的產品和元壹宇宙的哲學基礎上。</p>
              <p>工具是中性的，但我帶課的風格不是。</p>
              <p>我會直接指出你在逃避的東西。</p>
              <p>我不會假裝你的感受不重要，但我也不會讓你用感受當不行動的理由。</p>
              <p className="text-amber-400/80 font-medium">如果你上完整套課程之後說「我不需要再來了」——那就是我最成功的時候。</p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 mb-12 text-center"
          >
            <Mail className="w-8 h-8 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold text-white mb-2">報名 / 諮詢 Registration / Inquiry</h2>
            <p className="text-white/60 mb-4">目前為預約制，請透過 <a href="mailto:serves@momo-chao.com" className="text-amber-400 hover:text-amber-300 transition-colors">serves@momo-chao.com</a> 聯繫。</p>
            <p className="text-white/40 text-sm">每期名額有限，因為我不做大班。我要能看到每一個人。</p>
          </motion.div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/momochao-system/about">
                <ArrowLeft className="mr-2 h-4 w-4" />
                關於默默超
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold">
              <Link to="/momochao-system">
                回到元壹體系入口
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default MomochaoEducationPage;
