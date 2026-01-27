import { useState, useEffect, useMemo } from "react";
import { FileText, Image as ImageIcon, File, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilePreviewCardProps {
  file: File;
  onRemove?: () => void;
  className?: string;
  showPreview?: boolean;
}

/**
 * FilePreviewCard - 優化的文件預覽卡片組件
 * 
 * 功能:
 * - 支援圖片文件的縮略圖預覽
 * - 文件類型圖標顯示
 * - 文件大小格式化
 * - 載入狀態顯示
 */
export function FilePreviewCard({ 
  file, 
  onRemove, 
  className,
  showPreview = true 
}: FilePreviewCardProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  // 判斷文件類型
  const fileType = useMemo(() => {
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) return 'image';
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) return 'document';
    return 'file';
  }, [file]);

  // 格式化文件大小
  const formattedSize = useMemo(() => {
    const bytes = file.size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, [file.size]);

  // 生成圖片預覽
  useEffect(() => {
    if (!showPreview || fileType !== 'image') {
      setPreviewUrl(null);
      return;
    }

    setIsLoading(true);
    setPreviewError(false);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      setPreviewError(true);
      setIsLoading(false);
    };

    reader.readAsDataURL(file);

    return () => {
      reader.abort();
    };
  }, [file, fileType, showPreview]);

  // 獲取文件圖標
  const FileIcon = useMemo(() => {
    switch (fileType) {
      case 'image':
        return ImageIcon;
      case 'document':
      case 'pdf':
        return FileText;
      default:
        return File;
    }
  }, [fileType]);

  return (
    <div className={cn(
      "relative flex items-center gap-4 p-4 bg-card rounded-xl shadow-soft border border-border",
      "transition-all duration-300 hover:shadow-elevated",
      className
    )}>
      {/* 預覽區域 */}
      <div className={cn(
        "relative w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden shrink-0",
        previewUrl ? "bg-transparent" : "bg-primary/10"
      )}>
        {isLoading && (
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        )}
        
        {!isLoading && previewUrl && !previewError && (
          <img 
            src={previewUrl} 
            alt={file.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        
        {!isLoading && (!previewUrl || previewError) && (
          <FileIcon className="w-6 h-6 text-primary" />
        )}
      </div>

      {/* 文件信息 */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate" title={file.name}>
          {file.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {formattedSize}
        </p>
      </div>

      {/* 移除按鈕 */}
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

/**
 * ImagePreviewThumbnail - 圖片縮略圖預覽組件
 * 
 * 用於快速顯示圖片的小縮略圖
 */
interface ImagePreviewThumbnailProps {
  file: File;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function ImagePreviewThumbnail({
  file,
  size = 'md',
  className,
  onClick
}: ImagePreviewThumbnailProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  useEffect(() => {
    if (!file.type.startsWith('image/')) {
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      setIsLoading(false);
    };
    reader.onerror = () => setIsLoading(false);
    reader.readAsDataURL(file);

    return () => reader.abort();
  }, [file]);

  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden bg-muted flex items-center justify-center",
        sizeClasses[size],
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
      )}
      
      {!isLoading && previewUrl && (
        <img 
          src={previewUrl} 
          alt={file.name}
          className="w-full h-full object-cover"
        />
      )}
      
      {!isLoading && !previewUrl && (
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
      )}
    </div>
  );
}

export default FilePreviewCard;
