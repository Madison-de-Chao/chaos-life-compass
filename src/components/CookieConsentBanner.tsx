import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X, Settings, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "cookie-consent-preferences";

export interface CookiePreferences {
  necessary: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: 0,
};

const cookieTypes = [
  {
    id: "necessary" as const,
    label: "必要 Cookie",
    description: "網站運作所必需的 Cookie，無法關閉。包括安全性、登入狀態等基本功能。",
    required: true,
  },
  {
    id: "analytics" as const,
    label: "分析 Cookie",
    description: "幫助我們了解訪客如何使用網站，以改善用戶體驗。資料為匿名收集。",
    required: false,
  },
  {
    id: "marketing" as const,
    label: "行銷 Cookie",
    description: "用於追蹤訪客瀏覽行為，以提供更相關的廣告內容和個人化推薦。",
    required: false,
  },
];

export const CookieConsentBanner = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const newPrefs: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newPrefs));
    setPreferences(newPrefs);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const newPrefs: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newPrefs));
    setPreferences(newPrefs);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const newPrefs = {
      ...preferences,
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newPrefs));
    setIsVisible(false);
  };

  const togglePreference = (key: keyof Omit<CookiePreferences, "timestamp" | "necessary">) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
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
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />
              
              <div className="relative p-5 md:p-6">
                {/* Main Banner */}
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
                        您可以選擇接受或自訂您的偏好。
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
                  <div className="flex flex-wrap items-center gap-2 md:flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-white/70 hover:text-white hover:bg-white/10 gap-1.5"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline">管理偏好</span>
                      {showSettings ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRejectAll}
                      className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30"
                    >
                      僅必要
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAcceptAll}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium"
                    >
                      全部接受
                    </Button>
                  </div>

                  {/* Close button - mobile only */}
                  <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 p-1.5 rounded-full text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors md:hidden"
                    aria-label="關閉"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Settings Panel */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 pt-5 border-t border-white/10">
                        <div className="space-y-4">
                          {cookieTypes.map((type) => (
                            <div 
                              key={type.id}
                              className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-white text-sm">
                                    {type.label}
                                  </h4>
                                  {type.required && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                      必需
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-white/50 leading-relaxed">
                                  {type.description}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                {type.required ? (
                                  <div className="w-10 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <Check className="h-4 w-4 text-amber-400" />
                                  </div>
                                ) : (
                                  <Switch
                                    checked={preferences[type.id]}
                                    onCheckedChange={() => togglePreference(type.id as "analytics" | "marketing")}
                                    className="data-[state=checked]:bg-amber-500"
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Save Button */}
                        <div className="mt-4 flex justify-end">
                          <Button
                            size="sm"
                            onClick={handleSavePreferences}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium"
                          >
                            儲存偏好設定
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook to check consent status and preferences
export const useCookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch {
        setPreferences(null);
      }
    }
  }, []);

  const updatePreferences = (newPrefs: Partial<CookiePreferences>) => {
    const updated = {
      ...defaultPreferences,
      ...preferences,
      ...newPrefs,
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(updated));
    setPreferences(updated);
  };

  const resetPreferences = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setPreferences(null);
  };

  return {
    preferences,
    hasConsented: preferences !== null,
    allowsAnalytics: preferences?.analytics ?? false,
    allowsMarketing: preferences?.marketing ?? false,
    updatePreferences,
    resetPreferences,
  };
};

export default CookieConsentBanner;
