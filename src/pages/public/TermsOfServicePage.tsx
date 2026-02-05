/**
 * 使用條款頁面
 * 符合「鏡子非劇本」品牌哲學的法律聲明頁面
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Scale, 
  AlertTriangle, 
  RefreshCw,
  ArrowLeft,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

const lastUpdated = "2026年1月25日";

const sections = [
  {
    id: "acceptance",
    icon: CheckCircle,
    title: "服務條款接受",
    content: [
      "使用本網站及相關服務即表示您同意遵守本使用條款。",
      "如果您不同意本條款的任何部分，請勿使用我們的服務。",
      "我們保留隨時修改本條款的權利，修改後的條款將在本頁面公布。",
    ],
  },
  {
    id: "services",
    icon: FileText,
    title: "服務說明",
    content: [
      "我們提供命理報告、占卜分析、互動遊戲等數位內容服務。",
      "所有命理相關內容僅供參考，不構成專業建議（醫療、法律、財務等）。",
      "我們的服務是「照鏡子」而非「看劇本」——我們協助您認識自己，但最終決定權在您手中。",
      "服務內容可能會不時更新或變更，恕不另行通知。",
    ],
  },
  {
    id: "accounts",
    icon: Scale,
    title: "帳戶責任",
    content: [
      "您須提供真實、準確的註冊資訊。",
      "您有責任保護您的帳戶密碼安全。",
      "您須為帳戶下發生的所有活動負責。",
      "如發現未經授權的帳戶使用，請立即通知我們。",
    ],
  },
  {
    id: "prohibited",
    icon: XCircle,
    title: "禁止行為",
    content: [
      "未經授權複製、散布或轉售我們的內容。",
      "企圖規避任何安全措施或存取控制。",
      "使用自動化工具（爬蟲、機器人等）大量存取服務。",
      "冒充他人或提供虛假身份資訊。",
      "進行任何可能損害服務運作的行為。",
      "將服務用於任何非法目的。",
    ],
  },
  {
    id: "intellectual",
    icon: FileText,
    title: "智慧財產權",
    content: [
      "本網站的所有內容（文字、圖像、設計、程式碼等）均受著作權保護。",
      "「默默超」、「超烜創意」、「虹靈御所」等商標為本公司所有。",
      "未經書面授權，不得使用我們的商標或品牌素材。",
      "您購買的報告僅供個人使用，不得轉售或公開分享。",
    ],
  },
  {
    id: "disclaimer",
    icon: AlertTriangle,
    title: "免責聲明",
    content: [
      "命理報告內容僅供參考，不保證預測準確性。",
      "我們不對您基於服務內容所做的任何決定負責。",
      "服務以「現狀」提供，不提供任何明示或暗示的保證。",
      "對於因服務中斷、資料遺失等造成的損失，我們不承擔責任。",
      "我們的責任以您支付的服務費用為上限。",
    ],
  },
  {
    id: "refund",
    icon: RefreshCw,
    title: "退款政策",
    content: [
      "數位內容（報告、遊戲存取權等）一經交付即不可退款。",
      "如服務存在重大技術問題導致無法使用，可申請退款或重新交付。",
      "退款申請須在購買後 7 日內提出。",
      "退款將以原付款方式退還。",
    ],
  },
];

export default function TermsOfServicePage() {
  useEffect(() => {
    document.title = "使用條款 | 默默超 MOMO CHAO";
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-white/50 hover:text-amber-400 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首頁
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                  使用條款
                </h1>
                <p className="text-white/50 text-sm">Terms of Service</p>
              </div>
            </div>
            
            <p className="text-white/60 leading-relaxed max-w-2xl">
              歡迎使用默默超的服務。請仔細閱讀以下條款，這些條款規範您使用我們網站和服務的權利與義務。
            </p>
            
            <p className="text-white/40 text-sm mt-4">
              最後更新：{lastUpdated}
            </p>
          </motion.div>

          {/* Brand Philosophy Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 p-6 bg-gradient-to-r from-amber-500/5 to-transparent border-l-2 border-amber-500/50 rounded-r-xl"
          >
            <p className="text-white/70 italic font-serif text-lg">
              「你不需要被告知你是誰，你只需要一面夠清晰的鏡子。」
            </p>
            <p className="text-white/50 text-sm mt-2">
              我們的服務理念是幫助您認識自己，而非替您做決定。
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-white">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li 
                      key={i}
                      className="text-white/60 leading-relaxed pl-4 border-l-2 border-amber-500/30"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.section>
            ))}
          </div>

          {/* Governing Law */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-serif font-bold text-white">
                準據法與管轄
              </h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              本條款受中華民國法律管轄。因本條款引起的任何爭議，雙方同意以台灣台北地方法院為第一審管轄法院。
            </p>
          </motion.section>

          {/* Contact Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-8 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-serif font-bold text-white">
                聯繫我們
              </h2>
            </div>
            <p className="text-white/60 leading-relaxed mb-4">
              如果您對本使用條款有任何疑問，請透過以下方式聯繫我們：
            </p>
            <div className="space-y-2 text-white/70">
              <p>電子郵件：<a href="mailto:legal@momo-chao.com" className="text-amber-400 hover:text-amber-300 transition-colors">legal@momo-chao.com</a></p>
              <p>服務時間：週一至週五 10:00 - 18:00（台灣時間）</p>
            </div>
          </motion.section>

          {/* Related Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            <Link 
              to="/privacy" 
              className="text-white/50 hover:text-amber-400 transition-colors"
            >
              隱私政策
            </Link>
            <span className="text-white/20">|</span>
            <Link 
              to="/about" 
              className="text-white/50 hover:text-amber-400 transition-colors"
            >
              關於我們
            </Link>
          </motion.div>
        </div>
      </main>
      
      <PublicFooter />
    </div>
  );
}
