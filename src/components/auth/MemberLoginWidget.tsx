import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMember } from "@/hooks/useMember";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email("請輸入有效的 Email 地址");
const passwordSchema = z.string().min(6, "密碼至少需要 6 個字元");

// Google icon component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface MemberLoginWidgetProps {
  onClose?: () => void;
  onSuccess?: () => void;
  redirectTo?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export function MemberLoginWidget({ 
  onClose, 
  onSuccess,
  redirectTo = "/account",
  showTitle = true,
  compact = false 
}: MemberLoginWidgetProps) {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, user } = useMember();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validateForm = () => {
    try {
      emailSchema.parse(email);
    } catch {
      toast({
        title: "Email 格式錯誤",
        description: "請輸入有效的 Email 地址",
        variant: "destructive",
      });
      return false;
    }

    try {
      passwordSchema.parse(password);
    } catch {
      toast({
        title: "密碼格式錯誤",
        description: "密碼至少需要 6 個字元",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "登入失敗",
          description: error.message === "Invalid login credentials" 
            ? "Email 或密碼錯誤" 
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "登入成功",
          description: "歡迎回來！",
        });
        onSuccess?.();
        navigate(redirectTo);
      }
    } else {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast({
          title: "註冊失敗",
          description: error.message.includes("already registered")
            ? "此 Email 已被註冊"
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "註冊成功！",
          description: "歡迎加入會員平台",
        });
        onSuccess?.();
        navigate(redirectTo);
      }
    }

    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: "Google 登入失敗",
        description: error.message,
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  // If user is already logged in
  if (user) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/30">
          <Sparkles className="w-6 h-6 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-100 mb-2">您已登入</h3>
        <p className="text-sm text-slate-400 mb-4">歡迎回來！</p>
        <Button 
          onClick={() => navigate("/account")}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
        >
          前往會員中心
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Title */}
      {showTitle && (
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/30">
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-100">會員登入</h3>
          <p className="text-sm text-slate-400">一個帳號，暢享所有服務</p>
        </div>
      )}

      {/* Tab switcher */}
      <div className={`flex bg-slate-800/50 rounded-xl p-1 ${compact ? 'mb-4' : 'mb-6'}`}>
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            isLogin 
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          登入
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            !isLogin 
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          註冊
        </button>
      </div>

      <form onSubmit={handleSubmit} className={`space-y-${compact ? '3' : '4'}`}>
        {/* Display name field (signup only) */}
        <div className={`space-y-1.5 transition-all duration-300 ${isLogin ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
          <Label htmlFor="widget-displayName" className="flex items-center gap-2 text-slate-300 text-sm">
            <User className="w-3.5 h-3.5 text-amber-500" />
            暱稱
          </Label>
          <Input
            id="widget-displayName"
            type="text"
            placeholder="您的暱稱"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="widget-email" className="flex items-center gap-2 text-slate-300 text-sm">
            <Mail className="w-3.5 h-3.5 text-amber-500" />
            Email
          </Label>
          <Input
            id="widget-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="widget-password" className="flex items-center gap-2 text-slate-300 text-sm">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            密碼
          </Label>
          <div className="relative">
            <Input
              id="widget-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 pr-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Forgot password link */}
        {isLogin && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/auth/login?forgot=true")}
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              忘記密碼？
            </button>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-10 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium shadow-lg shadow-amber-500/25"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              處理中...
            </>
          ) : (
            isLogin ? "登入" : "註冊"
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/50" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-slate-900/80 text-slate-500">或</span>
          </div>
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-10 bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-600"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          <span className="ml-2">使用 Google 帳號</span>
        </Button>
      </form>

      {/* Full auth page link */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => navigate("/auth/login")}
          className="text-xs text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
        >
          前往完整登入頁面
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
