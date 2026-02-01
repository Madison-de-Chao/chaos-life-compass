/**
 * 統一會員個人資料編輯頁面
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Calendar, Clock, MapPin, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMember } from "../context/MemberContext";
import { MemberPageHeader } from "../components/MemberPageHeader";
import { toast } from "@/hooks/use-toast";

const UnifiedProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, loading, updateProfile } = useMember();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    phone: "",
    gender: "",
    bio: "",
    birth_date: "",
    birth_time: "",
    birth_place: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        bio: profile.bio || "",
        birth_date: profile.birth_date || "",
        birth_time: profile.birth_time || "",
        birth_place: profile.birth_place || "",
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const { error } = await updateProfile(formData);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <MemberPageHeader 
        title="編輯個人資料"
        backTo="/account"
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <User className="w-5 h-5" />
                基本資料
              </CardTitle>
              <CardDescription className="text-slate-400">
                您的基本個人資訊
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_name" className="text-slate-300">暱稱</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => handleChange('display_name', e.target.value)}
                  placeholder="您的暱稱"
                  className="bg-slate-900/50 border-slate-600 text-slate-100 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">電話</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="聯絡電話"
                  className="bg-slate-900/50 border-slate-600 text-slate-100 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-slate-300">性別</Label>
                <Select value={formData.gender} onValueChange={(v) => handleChange('gender', v)}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-600 text-slate-100">
                    <SelectValue placeholder="選擇性別" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-slate-300">自我介紹</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="簡短介紹自己..."
                  rows={3}
                  className="bg-slate-900/50 border-slate-600 text-slate-100 placeholder:text-slate-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Birth Info */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                出生資訊
              </CardTitle>
              <CardDescription className="text-slate-400">
                用於命理分析的重要資訊
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="birth_date" className="text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  出生日期
                </Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleChange('birth_date', e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-slate-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_time" className="text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  出生時間
                </Label>
                <Input
                  id="birth_time"
                  type="time"
                  value={formData.birth_time}
                  onChange={(e) => handleChange('birth_time', e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-slate-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_place" className="text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  出生地
                </Label>
                <Input
                  id="birth_place"
                  value={formData.birth_place}
                  onChange={(e) => handleChange('birth_place', e.target.value)}
                  placeholder="例：台北市"
                  className="bg-slate-900/50 border-slate-600 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSaving}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium shadow-lg shadow-amber-500/25"
          >
            {isSaving ? (
              "儲存中..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                儲存變更
              </>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default UnifiedProfilePage;
