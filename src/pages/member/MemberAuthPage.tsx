import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMember } from "@/hooks/useMember";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email("請輸入有效的 Email 地址");
const passwordSchema = z.string().min(6, "密碼至少需要 6 個字元");

const MemberAuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useMember();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/member");
    }
  }, [user, loading, navigate]);

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
        navigate("/member");
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
          description: "歡迎加入虹靈御所",
        });
        navigate("/member");
      }
    }

    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md animate-fade-in">
        {/* Back to home */}
        <Link 
          to="/home" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首頁
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center mb-4 border border-amber-500/30">
            <Sparkles className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold font-serif text-foreground">
            虹靈御所
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "會員登入" : "註冊新帳號"}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-8 shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  暱稱
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="您的暱稱"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-12"
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
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
                  className="h-12 pr-12"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "處理中..." : isLogin ? "登入" : "註冊"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              {isLogin ? "還沒有帳號？" : "已經有帳號？"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline ml-1 font-medium"
              >
                {isLogin ? "立即註冊" : "立即登入"}
              </button>
            </p>
          </div>

          {/* Beta notice */}
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-amber-700 font-medium mb-1">🎉 公開測試版福利</p>
                <p className="text-xs text-amber-600/80 leading-relaxed">
                  現在註冊為<strong>測試版帳號</strong>，享有等同「每月訂閱」的完整權限。正式營運後帳號轉為正式帳號，<strong>測試期間資料將會刪除</strong>。
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          登入即表示您同意我們的服務條款和隱私政策
        </p>
      </div>
    </div>
  );
};

export default MemberAuthPage;
