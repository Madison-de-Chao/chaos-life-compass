import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles, Zap, Star, Compass, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMember } from "@/hooks/useMember";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email("請輸入有效的 Email 地址");
const passwordSchema = z.string().min(6, "密碼至少需要 6 個字元");

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
  const { signIn, signUp, user, loading } = useMember();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(0);

  // Get redirect URL from search params
  const redirectTo = searchParams.get("redirect") || "/account";
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
            {/* Tab switcher */}
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

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Display name field (signup only) */}
              <div className={`space-y-2 transition-all duration-300 ${isLogin ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
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

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-slate-300 text-sm">
                  <Lock className="w-4 h-4 text-amber-500" />
                  密碼
                </Label>
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
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    處理中...
                  </div>
                ) : isLogin ? "登入" : "註冊"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-slate-900/80 text-slate-500">或</span>
              </div>
            </div>

            {/* Social login placeholder */}
            <div className="text-center text-slate-500 text-sm">
              更多登入方式即將推出
            </div>
          </div>
        </div>

        {/* Product badges */}
        <div className="mt-8 text-center">
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