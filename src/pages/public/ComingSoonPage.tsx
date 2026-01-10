import { motion } from "framer-motion";
import { Construction, ArrowLeft, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { Button } from "@/components/ui/button";

// Page titles for different routes
const pageTitles: Record<string, string> = {
  "/universe": "元壹宇宙",
  "/notes-public": "元壹筆記",
};

const ComingSoonPage = () => {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "此功能";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center"
            >
              <Construction className="w-12 h-12 text-amber-400" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                {pageTitle}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-white/60 mb-4"
            >
              正在施工中
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-white/40 mb-8 max-w-md mx-auto leading-relaxed"
            >
              我們正在精心打造這個區域，為您帶來更豐富的內容與體驗。
              <br />
              敬請期待！
            </motion.p>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center justify-center gap-4 mb-10"
            >
              <div className="flex items-center gap-2 text-amber-400/60">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">即將推出</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2 text-amber-400/60">
                <Construction className="w-4 h-4" />
                <span className="text-sm">全新內容</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                asChild
                variant="outline"
                className="border-white/20 text-white/80 hover:bg-white/10 min-h-[48px] px-6"
              >
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回首頁
                </Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 min-h-[48px] px-6"
              >
                <Link to="/reports">
                  探索命理報告
                  <Sparkles className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>
          </motion.div>
        </div>
      </main>
      
      <PublicFooter />
    </div>
  );
};

export default ComingSoonPage;