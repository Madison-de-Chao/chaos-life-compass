import { useState, useCallback, useMemo } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  accept?: string;
  maxSizeKB?: number;
}

/**
 * FileUploadZone - 優化的文件上傳區域組件
 * 
 * 功能:
 * - 拖放上傳
 * - 點擊選擇
 * - 文件預覽
 * - 文件類型檢查
 * - 文件大小檢查
 */
export function FileUploadZone({ 
  onFileSelect, 
  isLoading,
  accept = ".docx",
  maxSizeKB = 10240 // 預設 10MB
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  // 格式化文件大小
  const formattedSize = useMemo(() => {
    if (!selectedFile) return '';
    const bytes = selectedFile.size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, [selectedFile?.size]);

  // 驗證文件
  const validateFile = useCallback((file: File): boolean => {
    // 檢查文件類型
    const acceptedTypes = accept.split(',').map(t => t.trim().toLowerCase());
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    
    if (!acceptedTypes.some(type => 
      type === fileExtension || 
      (type.includes('*') && file.type.startsWith(type.replace('*', '')))
    )) {
      return false;
    }

    // 檢查文件大小
    if (file.size > maxSizeKB * 1024) {
      return false;
    }

    return true;
  }, [accept, maxSizeKB]);

  // 生成圖片預覽 (如果是圖片文件)
  const generatePreview = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setPreviewUrl(null);
      return;
    }

    setIsGeneratingPreview(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      setIsGeneratingPreview(false);
    };
    
    reader.onerror = () => {
      setPreviewUrl(null);
      setIsGeneratingPreview(false);
    };

    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && validateFile(file)) {
        setSelectedFile(file);
        generatePreview(file);
      }
    },
    [validateFile, generatePreview]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validateFile(file)) {
        setSelectedFile(file);
        generatePreview(file);
      }
    },
    [validateFile, generatePreview]
  );

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-accent/30",
          "cursor-pointer group"
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-4">
          <div
            className={cn(
              "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300",
              isDragOver ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
              "group-hover:scale-110"
            )}
          >
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <p className="text-lg font-medium text-foreground mb-1">
              拖放 Word 文件至此處
            </p>
            <p className="text-sm text-muted-foreground">
              或點擊選擇 .docx 檔案
            </p>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-6 p-4 bg-card rounded-xl shadow-soft border border-border animate-scale-in">
          <div className="flex items-center gap-4">
            {/* 文件預覽 */}
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden shrink-0",
              previewUrl ? "bg-transparent" : "bg-primary/10"
            )}>
              {isGeneratingPreview ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt={selectedFile.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                <FileText className="w-6 h-6 text-primary" />
              )}
            </div>
            
            {/* 文件信息 */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formattedSize}
              </p>
            </div>
            
            {/* 移除按鈕 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFile}
              className="shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full mt-4"
            variant="hero"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                處理中...
              </>
            ) : (
              "上傳並轉換"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
