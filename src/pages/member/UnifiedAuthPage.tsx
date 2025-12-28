import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles, Zap, Star, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMember } from "@/hooks/useMember";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email("請輸入有效的 Email 地址");
const passwordSchema = z.string().min(6, "密碼至少需要 6 個字元");

// Product info for display
const PRODUCTS = {
  report_platform: {
    id: "report_platform",
    name: "虹靈御所",
    subtitle: "命理報告平台",
    icon: Sparkles,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  story_builder_hub: {
    id: "story_builder_hub",
    name: "四時八字人生兵法",
    subtitle: "命理桌遊系統",
    icon: Star,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  seek_monster: {
    id: "seek_monster",
    name: "尋妖記",
    subtitle: "探索遊戲平台",
    icon: Compass,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  yuanyi_divination: {
    id: "yuanyi_divination",
    name: "元壹卜卦系統",
    subtitle: "占問與指引",
    icon: Zap,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
};

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

  // Get redirect URL from search params
  const redirectTo = searchParams.get("redirect") || "/account";
  const fromProduct = searchParams.get("from");

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">載入中...</div>
      </div>
    );
  }

  const fromProductInfo = fromProduct ? PRODUCTS[fromProduct as keyof typeof PRODUCTS] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Back to home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首頁
        </Link>

        {/* Logo area */}
        <div className="text-center mb-8">
          {/* Product logos */}
          <div className="flex justify-center gap-3 mb-6">
            {Object.values(PRODUCTS).map((product) => {
              const Icon = product.icon;
              const isFrom = fromProduct === product.id;
              return (
                <div 
                  key={product.id}
                  className={`w-12 h-12 rounded-xl ${product.bgColor} flex items-center justify-center border ${product.borderColor} transition-all ${
                    isFrom ? 'ring-2 ring-white/30 scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                  title={product.name}
                >
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${product.color} bg-clip-text text-transparent`} 
                    style={{ color: isFrom ? undefined : 'currentColor' }}
                  />
                </div>
              );
            })}
          </div>

          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            統一會員平台
          </h1>
          <p className="text-slate-400">
            {isLogin ? "登入以存取您的所有服務" : "註冊成為會員"}
          </p>
          
          {fromProductInfo && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <fromProductInfo.icon className="w-4 h-4 text-slate-300" />
              <span className="text-sm text-slate-300">
                來自 <span className="font-medium text-slate-100">{fromProductInfo.name}</span>
              </span>
            </div>
          )}
        </div>

        {/* Auth Form */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="flex items-center gap-2 text-slate-300">
                  <User className="w-4 h-4" />
                  暱稱
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="您的暱稱"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-12 bg-slate-900/50 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20"
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-slate-900/50 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-slate-300">
                <Lock className="w-4 h-4" />
                密碼
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="輸入密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12 bg-slate-900/50 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium shadow-lg shadow-amber-500/25"
              disabled={isSubmitting}
            >
              {isSubmitting ? "處理中..." : isLogin ? "登入" : "註冊"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              {isLogin ? "還沒有帳號？" : "已經有帳號？"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-400 hover:text-amber-300 hover:underline ml-1 font-medium"
              >
                {isLogin ? "立即註冊" : "立即登入"}
              </button>
            </p>
          </div>
        </div>

        {/* Product info */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-xs mb-4">
            一個帳號，暢享所有服務
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {Object.values(PRODUCTS).map((product) => (
              <span 
                key={product.id}
                className="text-xs text-slate-500 px-2 py-1 rounded-full bg-slate-800/50 border border-slate-700/50"
              >
                {product.name}
              </span>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          登入即表示您同意我們的服務條款和隱私政策
        </p>
      </div>
    </div>
  );
};

export default UnifiedAuthPage;
