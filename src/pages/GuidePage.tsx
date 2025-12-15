import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  FileText, 
  Heading1, 
  Table2, 
  Image, 
  Type, 
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export default function GuidePage() {
  const handleDownloadTemplate = () => {
    window.open('/templates/report-template.html', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
            文件格式規範指南
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            了解如何製作完美的命理報告文件，確保在網頁與 PDF 輸出時呈現最佳效果
          </p>
        </div>

        {/* Download Template Card */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent animate-fade-in">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">下載報告範本</h3>
                <p className="text-sm text-muted-foreground">
                  預設樣式與完整章節結構，用 Word 開啟後另存為 .docx
                </p>
              </div>
            </div>
            <Button onClick={handleDownloadTemplate} className="shrink-0">
              <Download className="w-4 h-4 mr-2" />
              下載範本
            </Button>
          </CardContent>
        </Card>

        {/* Guidelines Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 標題層級 */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Heading1 className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">標題層級</CardTitle>
                  <CardDescription>自動觸發分頁的標題格式</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-foreground">Word 內建樣式</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    標題 1 (Heading 1) → 主要章節
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    標題 2 (Heading 2) → 次要章節
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    標題 3 (Heading 3) → 小節標題
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-foreground">Markdown 語法</h4>
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs">
                  <div># 一級標題</div>
                  <div>## 二級標題</div>
                  <div>### 三級標題</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 章節關鍵字 */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Type className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">章節關鍵字</CardTitle>
                  <CardDescription>自動識別的分頁觸發詞</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-foreground">中式章節編號</h4>
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs">
                  <div>第一章 人生羅盤</div>
                  <div>第二節 內在個性</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-foreground">方括號標題</h4>
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs">
                  【人生羅盤】
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                支援 19 個預設章節：開場自序、使用說明、基本資料、人生羅盤...
              </div>
            </CardContent>
          </Card>

          {/* 表格格式 */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Table2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">表格格式</CardTitle>
                  <CardDescription>Markdown 表格語法</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                <div>| 項目 | 說明 | 備註 |</div>
                <div>|------|------|------|</div>
                <div>| 紫微 | 主星 | 重要 |</div>
                <div>| 八字 | 五行 | 參考 |</div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>每行 | 數量需一致</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>第二行須為分隔線 |---|</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>建議欄位不超過 5-6 欄</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 圖片插入 */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Image className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">圖片插入</CardTitle>
                  <CardDescription>圖片規格與建議</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground text-xs mb-1">格式</div>
                  <div className="font-medium">JPG / PNG</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground text-xs mb-1">寬度</div>
                  <div className="font-medium">800-1200px</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground text-xs mb-1">檔案大小</div>
                  <div className="font-medium">&lt; 2MB</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground text-xs mb-1">解析度</div>
                  <div className="font-medium">150-300 DPI</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                可在 Word 中直接貼上，或使用編輯器的「插入圖片」功能
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Text Formatting Section */}
        <Card className="mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="text-lg">文字格式</CardTitle>
            <CardDescription>支援的 Markdown 文字樣式</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="font-mono text-sm mb-2">**粗體文字**</div>
                <div className="text-sm text-muted-foreground">
                  效果：<strong>粗體文字</strong>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="font-mono text-sm mb-2">*斜體文字*</div>
                <div className="text-sm text-muted-foreground">
                  效果：<em>斜體文字</em>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="font-mono text-sm mb-2">&gt; 引用區塊</div>
                <div className="text-sm text-muted-foreground">
                  效果：帶左邊框的引用
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="mt-6 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent animate-fade-in" style={{ animationDelay: '0.35s' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <CardTitle className="text-lg">常見問題排解</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-1">章節沒有自動分頁？</h4>
                <p className="text-muted-foreground">
                  確認標題使用 Word 內建樣式，或關鍵字（如【】、第X章）在行首
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">表格顯示異常？</h4>
                <p className="text-muted-foreground">
                  確保每行 | 數量一致，並包含分隔線（第二行 |---|）
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">段落被過度分割？</h4>
                <p className="text-muted-foreground">
                  減少不必要的換行，使用完整句子（以句號結尾）
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>如有任何格式問題，請聯繫系統管理員</p>
          <p className="mt-2">© {new Date().getFullYear()} MOMO CHAO / 超烜創意 / 虹靈御所</p>
        </div>
      </main>
    </div>
  );
}
