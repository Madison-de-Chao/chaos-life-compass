import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "cookie-consent-status";

type ConsentStatus = "accepted" | "rejected" | null;

export const CookieConsentBanner = () => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!storedConsent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setConsentStatus("accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setConsentStatus("rejected");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
              
              <div className="relative p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  {/* Content */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 rounded-full bg-amber-500/10 p-2.5">
                      <Cookie className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-base font-medium text-white">
                        我們使用 Cookie
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed">
                        為了提供更好的瀏覽體驗，我們使用 Cookie 來記住您的偏好設定。
                        您可以選擇接受或拒絕非必要的 Cookie。
                        <Link 
                          to="/privacy" 
                          className="ml-1 text-amber-400/80 hover:text-amber-400 underline underline-offset-2 transition-colors"
                        >
                          了解更多
                        </Link>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 md:flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReject}
                      className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30 min-w-[80px]"
                    >
                      拒絕
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAccept}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium min-w-[80px]"
                    >
                      接受
                    </Button>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 p-1.5 rounded-full text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors md:hidden"
                    aria-label="關閉"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook to check consent status
export const useCookieConsent = () => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus;
    setConsentStatus(storedConsent);
  }, []);

  return {
    hasConsented: consentStatus === "accepted",
    hasRejected: consentStatus === "rejected",
    consentStatus,
  };
};

export default CookieConsentBanner;
