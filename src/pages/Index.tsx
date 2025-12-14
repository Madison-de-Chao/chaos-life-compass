import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { FileUploadZone } from "@/components/FileUploadZone";
import { FileText, Sparkles, Lock, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const generateShareLink = () => {
    // Generate a random URL-friendly share link
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    return `doc-${randomSuffix}`;
  };

  const sanitizeFileName = (fileName: string) => {
    // Remove special characters and keep only safe characters for storage
    const extension = fileName.split('.').pop() || '';
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    // Replace any non-alphanumeric characters (except dash and underscore) with underscore
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
      // 1. Sanitize filename for storage
      const safeFileName = sanitizeFileName(file.name);
      const filePath = `${user.id}/${Date.now()}-${safeFileName}`;
      
      // 2. Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }

      // 3. Generate share link
      const shareLink = generateShareLink();

      // 3. Create document record in database
      const { data: docData, error: dbError } = await supabase
        .from("documents")
        .insert({
          file_name: file.name,
          original_name: file.name,
          file_path: filePath,
          file_size: file.size,
          share_link: shareLink,
          is_public: true,
          content: null, // Will be populated after parsing
        })
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file if db insert fails
        await supabase.storage.from("documents").remove([filePath]);
        throw dbError;
      }

      toast({
        title: "文件已上傳",
        description: `${file.name} 已成功上傳`,
      });

      // Navigate to the files management page
      navigate("/files");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "上傳失敗",
        description: error.message || "無法上傳文件，請稍後再試",
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
