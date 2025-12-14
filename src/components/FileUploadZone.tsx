import { useState, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function FileUploadZone({ onFileSelect, isLoading }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      if (file && file.name.endsWith(".docx")) {
        setSelectedFile(file);
      }
    },
    []
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
      }
    },
    []
  );

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
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
          accept=".docx"
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
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
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
            {isLoading ? "處理中..." : "上傳並轉換"}
          </Button>
        </div>
      )}
    </div>
  );
}
