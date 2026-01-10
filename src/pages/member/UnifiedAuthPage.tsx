import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles, Zap, Star, Compass, Shield, Loader2 } from "lucide-react";
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

// Product info for display
const PRODUCTS = [
  {
    id: "report_platform",
    name: "虹靈御所",
    subtitle: "命理報告平台",
    icon: Sparkles,
    color: "from-amber-500 to-orange-600",
    bgGlow: "bg-amber-500/30",
    shadowColor: "shadow-amber-500/20",
  },
  {
    id: "story_builder_hub",
    name: "四時八字人生兵法",
    subtitle: "命理桌遊系統",
    icon: Star,
    color: "from-purple-500 to-pink-600",
    bgGlow: "bg-purple-500/30",
    shadowColor: "shadow-purple-500/20",
  },
  {
    id: "seek_monster",
    name: "尋妖記",
    subtitle: "探索遊戲平台",
    icon: Compass,
    color: "from-emerald-500 to-teal-600",
    bgGlow: "bg-emerald-500/30",
    shadowColor: "shadow-emerald-500/20",
  },
  {
    id: "yuanyi_divination",
    name: "元壹卜卦系統",
    subtitle: "占問與指引",
    icon: Zap,
    color: "from-blue-500 to-indigo-600",
    bgGlow: "bg-blue-500/30",
    shadowColor: "shadow-blue-500/20",
  },
];

const UnifiedAuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, signInWithGoogle, resetPassword, user, loading } = useMember();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(0);

  // Get redirect URL from search params
  const redirectTo = searchParams.get("redirect") || "/account";
  const isPasswordReset = searchParams.get("reset") === "true";
  const fromProduct = searchParams.get("from");

  // Auto-rotate product highlights
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProductIndex((prev) => (prev + 1) % PRODUCTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectTo);
    }
  }, [user, loading, navigate, redirectTo]);

  // Handle password reset redirect
  useEffect(() => {
    if (isPasswordReset) {
      toast({
        title: "請設定新密碼",
        description: "請使用新密碼登入您的帳號",
      });
    }
  }, [isPasswordReset]);

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
    
    // For forgot password, only validate email
    if (isForgotPassword) {
      try {
        emailSchema.parse(email);
      } catch {
        toast({
          title: "Email 格式錯誤",
          description: "請輸入有效的 Email 地址",
          variant: "destructive",
        });
        return;
      }
      
      setIsSubmitting(true);
      const { error } = await resetPassword(email);
      if (error) {
        toast({
          title: "發送失敗",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "重設密碼郵件已發送",
          description: "請檢查您的信箱，點擊連結重設密碼",
        });
        setIsForgotPassword(false);
      }
      setIsSubmitting(false);
      return;
    }
    
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
          description: "歡迎加入統一會員平台",
        });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
          <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-amber-500" />
        </div>
      </div>
    );
  }

  const fromProductInfo = PRODUCTS.find(p => p.id === fromProduct);
  const activeProduct = PRODUCTS[activeProductIndex];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Rotating gradient orbs */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div 
            className={`absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-1000 ${activeProduct.bgGlow} opacity-30`}
            style={{ transform: `translate(${Math.sin(activeProductIndex) * 50}px, ${Math.cos(activeProductIndex) * 30}px)` }}
          />
          <div 
            className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-800/30 rounded-full blur-[150px]"
          />
        </div>

        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/30 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-400 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="relative">
            返回首頁
            <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-500 group-hover:w-full transition-all duration-300" />
          </span>
        </Link>

        {/* Animated logo area */}
        <div className="text-center mb-10 animate-fade-in">
          {/* Central shield logo */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur-xl opacity-40 animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/30 backdrop-blur-sm">
              <Shield className="w-10 h-10 text-amber-500" />
            </div>
          </div>

          {/* Product carousel */}
          <div className="flex justify-center gap-2 mb-6">
            {PRODUCTS.map((product, index) => {
              const Icon = product.icon;
              const isActive = index === activeProductIndex;
              const isFrom = fromProduct === product.id;
              
              return (
                <button
                  key={product.id}
                  onClick={() => setActiveProductIndex(index)}
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    isActive || isFrom
                      ? `bg-gradient-to-br ${product.color} shadow-lg ${product.shadowColor} scale-110`
                      : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                  title={product.name}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive || isFrom ? 'text-white' : 'text-slate-500'}`} />
                  {(isActive || isFrom) && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Animated product name */}
          <div className="h-16 overflow-hidden">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 via-amber-200 to-slate-100 bg-clip-text text-transparent mb-1">
              統一會員平台
            </h1>
            <p className="text-slate-400 text-sm transition-all duration-500">
              {fromProductInfo ? (
                <>來自 <span className="text-amber-400 font-medium">{fromProductInfo.name}</span></>
              ) : (
                <>一個帳號，暢享 <span className="text-amber-400 font-medium">{activeProduct.name}</span> 與更多</>
              )}
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <div className="relative group">
          {/* Glow border effect */}
          <div className="absolute -inset-px bg-gradient-to-r from-amber-500/50 via-orange-500/50 to-amber-500/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            {/* Tab switcher - hidden when in forgot password mode */}
            {!isForgotPassword && (
              <div className="flex mb-8 bg-slate-800/50 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
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
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  註冊
                </button>
              </div>
            )}

            {/* Forgot password header */}
            {isForgotPassword && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回登入
                </button>
                <h2 className="text-xl font-semibold text-slate-100">忘記密碼</h2>
                <p className="text-sm text-slate-400 mt-1">輸入您的 Email，我們將發送重設密碼連結</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Display name field (signup only) */}
              <div className={`space-y-2 transition-all duration-300 ${(isLogin || isForgotPassword) ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
                <Label htmlFor="displayName" className="flex items-center gap-2 text-slate-300 text-sm">
                  <User className="w-4 h-4 text-amber-500" />
                  暱稱
                </Label>
                <div className="relative group/input">
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="您的暱稱"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-12 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-slate-300 text-sm">
                  <Mail className="w-4 h-4 text-amber-500" />
                  Email
                </Label>
                <div className="relative group/input">
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity" />
                </div>
              </div>

              {/* Password field - hidden when in forgot password mode */}
              <div className={`space-y-2 transition-all duration-300 ${isForgotPassword ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="flex items-center gap-2 text-slate-300 text-sm">
                    <Lock className="w-4 h-4 text-amber-500" />
                    密碼
                  </Label>
                  {isLogin && !isForgotPassword && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      忘記密碼？
                    </button>
                  )}
                </div>
                <div className="relative group/input">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="輸入密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-12 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    處理中...
                  </div>
                ) : isForgotPassword ? "發送重設連結" : isLogin ? "登入" : "註冊"}
              </Button>
            </form>

            {/* Divider - hidden when in forgot password mode */}
            {!isForgotPassword && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700/50" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-slate-900/80 text-slate-500">或</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full h-12 bg-white hover:bg-slate-100 text-slate-800 border-slate-300 font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isGoogleLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      連接中...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <GoogleIcon />
                      使用 Google 帳號{isLogin ? '登入' : '註冊'}
                    </div>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Beta notice */}
        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-sm text-amber-400 font-medium mb-1">🎉 公開測試版福利</p>
              <p className="text-xs text-amber-400/70 leading-relaxed">
                現在註冊的帳號為<strong>測試版帳號</strong>，享有等同「每月訂閱」的完整權限，免費及付費內容皆可體驗。正式營運後帳號將自動轉為正式帳號，<strong>但測試期間的所有資料紀錄將會刪除</strong>。
              </p>
            </div>
          </div>
        </div>

        {/* Product badges */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 text-xs mb-4">
            一個帳號，暢享所有服務
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {PRODUCTS.map((product) => (
              <span 
                key={product.id}
                className="text-xs text-slate-500 px-3 py-1.5 rounded-full bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 hover:text-slate-400 transition-all cursor-default"
              >
                {product.name}
              </span>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          登入即表示您同意我們的服務條款和隱私政策
        </p>
      </div>
    </div>
  );
};

export default UnifiedAuthPage;