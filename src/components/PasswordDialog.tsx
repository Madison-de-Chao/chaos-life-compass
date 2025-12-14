import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import logoChaoxuan from "@/assets/logo-chaoxuan.png";
import logoHongling from "@/assets/logo-hongling.png";

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (password: string) => void;
  error?: string;
}

export function PasswordDialog({
  open,
  onOpenChange,
  onSubmit,
  error,
}: PasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          {/* Dual Logos with Animation */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <img 
              src={logoChaoxuan} 
              alt="超烜創意" 
              className="h-12 sm:h-16 w-auto object-contain animate-fade-in hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: '0.1s' }}
            />
            <img 
              src={logoHongling} 
              alt="虹靈御所" 
              className="h-12 sm:h-16 w-auto object-contain animate-fade-in hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: '0.2s' }}
            />
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-accent flex items-center justify-center animate-scale-in">
            <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-accent-foreground" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-serif animate-fade-in" style={{ animationDelay: '0.15s' }}>此文件需要密碼</DialogTitle>
          <DialogDescription className="text-sm sm:text-base animate-fade-in" style={{ animationDelay: '0.2s' }}>
            請輸入分享密碼以繼續閱讀
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10 h-11 sm:h-12 text-base"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button type="submit" variant="hero" size="lg" className="w-full h-11 sm:h-12 hover:scale-[1.02] transition-transform">
            確認
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
