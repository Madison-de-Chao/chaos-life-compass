/**
 * 隱私政策頁面
 * 符合「鏡子非劇本」品牌哲學的法律聲明頁面
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, Lock, Server, UserCheck, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

const lastUpdated = "2026年1月25日";

const sections = [
  {
    id: "collection",
    icon: Eye,
    title: "資料收集",
    content: [
      "我們收集您主動提供的資訊，包括：姓名、電子郵件、出生資料（用於命理分析）。",
      "我們自動收集的技術資訊包括：IP 位址、瀏覽器類型、裝置資訊、頁面瀏覽記錄。",
      "我們使用 Cookie 和類似技術來改善您的使用體驗和網站功能。",
    ],
  },
  {
    id: "usage",
    icon: Server,
    title: "資料使用",
    content: [
      "提供、維護和改進我們的服務。",
      "處理您的訂單和付款。",
      "發送服務相關的通知和更新。",
      "回應您的查詢和提供客戶支援。",
      "進行數據分析以改善服務品質。",
    ],
  },
  {
    id: "protection",
    icon: Lock,
    title: "資料保護",
    content: [
      "我們採用業界標準的加密技術保護您的資料傳輸。",
      "敏感資料（如密碼）經過雜湊處理後儲存，我們無法還原。",
      "我們實施嚴格的存取控制，僅授權人員可存取您的資料。",
      "我們定期進行安全審計和漏洞掃描。",
    ],
  },
  {
    id: "sharing",
    icon: UserCheck,
    title: "資料分享",
    content: [
      "我們不會出售您的個人資料給第三方。",
      "我們可能與以下對象分享資料：提供服務的合作夥伴（如付款處理商）、法律要求時的政府機關。",
      "所有第三方合作夥伴均受嚴格的資料保護協議約束。",
    ],
  },
  {
    id: "rights",
    icon: Shield,
    title: "您的權利",
    content: [
      "存取權：您可以要求查看我們持有的您的個人資料。",
      "更正權：您可以要求更正不正確的資料。",
      "刪除權：您可以要求刪除您的帳戶和相關資料。",
      "可攜權：您可以要求以電子格式取得您的資料副本。",
      "如需行使上述權利，請透過下方聯繫方式與我們聯繫。",
    ],
  },
];

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = "隱私政策 | 默默超 MOMO CHAO";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
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
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                  隱私政策
                </h1>
                <p className="text-white/50 text-sm">Privacy Policy</p>
              </div>
            </div>
            
            <p className="text-white/60 leading-relaxed max-w-2xl">
              我們尊重您的隱私，並致力於保護您的個人資料。本隱私政策說明我們如何收集、使用、儲存和保護您的資訊。
            </p>
            
            <p className="text-white/40 text-sm mt-4">
              最後更新：{lastUpdated}
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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

          {/* Contact Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-serif font-bold text-white">
                聯繫我們
              </h2>
            </div>
            <p className="text-white/60 leading-relaxed mb-4">
              如果您對本隱私政策有任何疑問或需要行使您的資料權利，請透過以下方式聯繫我們：
            </p>
            <div className="space-y-2 text-white/70">
              <p>電子郵件：<a href="mailto:privacy@momo-chao.com" className="text-amber-400 hover:text-amber-300 transition-colors">privacy@momo-chao.com</a></p>
              <p>服務時間：週一至週五 10:00 - 18:00（台灣時間）</p>
            </div>
          </motion.section>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 text-center text-white/40 text-sm"
          >
            本隱私政策可能會不時更新。我們會在本頁面發布任何變更，並在重大變更時通知您。
          </motion.p>
        </div>
      </main>
      
      <PublicFooter />
    </div>
  );
}
