import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, User, Calendar, Clock, MapPin, 
  Phone, Save, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMember } from "@/hooks/useMember";
import { toast } from "@/hooks/use-toast";

const MemberProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, loading, updateProfile } = useMember();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    display_name: "",
    phone: "",
    birth_date: "",
    birth_time: "",
    birth_place: "",
    gender: "",
    bio: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/member/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        phone: profile.phone || "",
        birth_date: profile.birth_date || "",
        birth_time: profile.birth_time || "",
        birth_place: profile.birth_place || "",
        gender: profile.gender || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const { error } = await updateProfile({
      display_name: formData.display_name || null,
      phone: formData.phone || null,
      birth_date: formData.birth_date || null,
      birth_time: formData.birth_time || null,
      birth_place: formData.birth_place || null,
      gender: formData.gender || null,
      bio: formData.bio || null,
    } as any);

    if (error) {
      toast({
        title: "更新失敗",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "更新成功",
        description: "個人資料已更新",
      });
    }

    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment relative z-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/member")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <span className="font-serif font-bold">個人資料設定</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit}>
          <Card className="bg-card/60 backdrop-blur mb-6">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <User className="w-5 h-5" />
                基本資料
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">暱稱</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => handleChange("display_name", e.target.value)}
                  placeholder="您的暱稱"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  聯絡電話
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="0912-345-678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">性別</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇性別" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">自我介紹</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="簡單介紹自己..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur mb-6">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                出生資訊（用於命理分析）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="birth_date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  出生日期
                </Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleChange("birth_date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  出生時間
                </Label>
                <Input
                  id="birth_time"
                  type="time"
                  value={formData.birth_time}
                  onChange={(e) => handleChange("birth_time", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_place" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  出生地
                </Label>
                <Input
                  id="birth_place"
                  value={formData.birth_place}
                  onChange={(e) => handleChange("birth_place", e.target.value)}
                  placeholder="例如：台北市"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "儲存中..." : "儲存變更"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default MemberProfilePage;
