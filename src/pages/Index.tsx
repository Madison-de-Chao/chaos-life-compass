import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { FileUploadZone } from "@/components/FileUploadZone";
import { FileText, Sparkles, Lock, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { parseDocxFile } from "@/lib/parseDocx";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const sanitizeFileName = (fileName: string) => {
    const extension = fileName.split('.').pop() || '';
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    const safeName = baseName.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50);
    return `${safeName}.${extension}`;
  };

  const handleFileSelect = async (file: File) => {
    if (!user) {
      toast({
        title: "請先登入",
        description: "您需要登入才能上傳文件",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. Parse the Word document
      toast({
        title: "正在解析文件...",
        description: "請稍候",
      });
      
      const { title, sections } = await parseDocxFile(file);
      
      // 2. Sanitize filename and upload to storage first
      const safeFileName = sanitizeFileName(file.name);
      const filePath = `${user.id}/${Date.now()}-${safeFileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }

      toast({
        title: "解析完成",
        description: "正在進入編輯頁面...",
      });

      // 3. Navigate to edit page with parsed data
      navigate("/edit", {
        state: {
          file,
          title,
          sections,
          filePath,
        },
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "解析失敗",
        description: error.message || "無法解析文件，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: FileText,
      title: "智能轉換",
      description: "自動將 Word 文件轉換為精美的網頁展示",
    },
    {
      icon: Lock,
      title: "密碼保護",
      description: "為分享連結設定密碼，確保內容安全",
    },
    {
      icon: Share2,
      title: "輕鬆分享",
      description: "一鍵生成分享連結，輕鬆傳遞給任何人",
    },
  ];

  return (
    <div className="min-h-screen gradient-hero">
      <Header />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>將文件轉化為精美展示</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-foreground mb-6 leading-tight">
            讓您的文件
            <span className="text-primary block mt-2">優雅呈現</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12">
            上傳 Word 文件，自動轉換為圖文並茂的展示網站。
            支援密碼保護分享，追蹤檔案紀錄。
          </p>

          <FileUploadZone onFileSelect={handleFileSelect} isLoading={isLoading} />
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold font-serif text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Index;
