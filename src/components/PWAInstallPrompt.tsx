import { useState, useEffect, useCallback } from 'react';
import { X, Download, Smartphone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently (within 7 days)
    const dismissedAt = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDays) {
        return;
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after a short delay for better UX
      setTimeout(() => {
        setShowBanner(true);
        // Trigger enter animation
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      }, 2000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      handleClose();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setShowBanner(false);
      setIsVisible(false);
      setIsExiting(false);
    }, 400);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        handleClose();
      }
    } catch (error) {
      console.error('Install prompt error:', error);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    handleClose();
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div 
      className={`
        fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm
        transition-all duration-500 ease-out
        ${isVisible && !isExiting 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
        }
      `}
      style={{
        transitionTimingFunction: isExiting 
          ? 'cubic-bezier(0.4, 0, 1, 1)' 
          : 'cubic-bezier(0, 0, 0.2, 1)'
      }}
    >
      {/* Glow effect */}
      <div 
        className={`
          absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 
          blur-xl transition-opacity duration-700
          ${isVisible && !isExiting ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ animationDelay: '200ms' }}
      />
      
      <div className="relative bg-card/95 backdrop-blur-md border border-border/80 rounded-xl p-4 shadow-elevated overflow-hidden">
        {/* Shimmer effect */}
        <div 
          className={`
            absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
            transition-transform duration-1000
            ${isVisible && !isExiting ? 'translate-x-full' : '-translate-x-full'}
          `}
          style={{ transitionDelay: '300ms' }}
        />
        
        <div className="relative flex items-start gap-3">
          {/* Icon with pulse animation */}
          <div 
            className={`
              flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 
              flex items-center justify-center relative
              transition-all duration-500 delay-100
              ${isVisible && !isExiting 
                ? 'opacity-100 scale-100 rotate-0' 
                : 'opacity-0 scale-50 -rotate-12'
              }
            `}
          >
            <div className="absolute inset-0 rounded-xl bg-primary/10 animate-ping opacity-30" />
            <Smartphone className="w-6 h-6 text-primary relative z-10" />
            <Sparkles 
              className={`
                absolute -top-1 -right-1 w-4 h-4 text-primary/60
                transition-all duration-500 delay-300
                ${isVisible && !isExiting 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-0'
                }
              `}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 
              className={`
                font-serif font-semibold text-foreground text-sm
                transition-all duration-500 delay-150
                ${isVisible && !isExiting 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-4'
                }
              `}
            >
              安裝虹靈御所
            </h3>
            <p 
              className={`
                text-xs text-muted-foreground mt-1
                transition-all duration-500 delay-200
                ${isVisible && !isExiting 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-4'
                }
              `}
            >
              將網站加入主畫面，享受更快速流暢的體驗
            </p>
            
            <div 
              className={`
                flex gap-2 mt-3
                transition-all duration-500 delay-300
                ${isVisible && !isExiting 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
                }
              `}
            >
              <Button
                size="sm"
                onClick={handleInstall}
                className="h-8 px-3 text-xs font-medium group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <Download className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-y-0.5 group-hover:scale-110" />
                  立即安裝
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                稍後再說
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className={`
              flex-shrink-0 p-1.5 rounded-lg hover:bg-muted/80 
              transition-all duration-300 delay-200
              hover:rotate-90 active:scale-90
              ${isVisible && !isExiting 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-50'
              }
            `}
            aria-label="關閉"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
