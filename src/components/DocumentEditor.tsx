import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Save, Eye, SeparatorHorizontal, ChevronUp, ChevronDown, Image as ImageIcon, Merge, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { OptimizedImage } from "@/components/ui/optimized-image";

export interface DocumentSection {
  id: string;
  type: "heading" | "paragraph" | "quote" | "pagebreak" | "image";
  content: string;
  level?: number;
  imageUrl?: string;
}

interface HistoryState {
  title: string;
  sections: DocumentSection[];
}

interface DocumentEditorProps {
  initialTitle: string;
  initialSections: DocumentSection[];
  onSave: (title: string, sections: DocumentSection[]) => void;
  onPreview: (title: string, sections: DocumentSection[]) => void;
  isLoading?: boolean;
}

export function DocumentEditor({
  initialTitle,
  initialSections,
  onSave,
  onPreview,
  isLoading,
}: DocumentEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [sections, setSections] = useState<DocumentSection[]>(initialSections);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const maxHistoryLength = 50;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);

  // Save current state to history before making changes
  const saveToHistory = useCallback(() => {
    setHistory(prev => {
      const newHistory = [...prev, { title, sections: JSON.parse(JSON.stringify(sections)) }];
      // Keep only the last maxHistoryLength items
      if (newHistory.length > maxHistoryLength) {
        return newHistory.slice(-maxHistoryLength);
      }
      return newHistory;
    });
  }, [title, sections]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (history.length === 0) {
      toast({
        title: "無法復原",
        description: "沒有可復原的操作",
      });
      return;
    }
    
    const lastState = history[history.length - 1];
    setTitle(lastState.title);
    setSections(lastState.sections);
    setHistory(prev => prev.slice(0, -1));
    
    toast({
      title: "已復原",
      description: "已回到上一個步驟",
    });
  }, [history]);

  const addSection = (type: DocumentSection["type"], insertAfterIndex?: number) => {
    saveToHistory();
    const newSection: DocumentSection = {
      id: `section-${Date.now()}`,
      type,
      content: "",
      level: type === "heading" ? 2 : undefined,
    };
    if (insertAfterIndex !== undefined) {
      const newSections = [...sections];
      newSections.splice(insertAfterIndex + 1, 0, newSection);
      setSections(newSections);
    } else {
      setSections([...sections, newSection]);
    }
  };

  const handleImageUpload = async (file: File, sectionId: string) => {
    setUploadingImageId(sectionId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Use public bucket for document images
      const { error: uploadError } = await supabase.storage
        .from('document-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('document-images')
        .getPublicUrl(filePath);

      setSections(
        sections.map((s) => 
          s.id === sectionId ? { ...s, imageUrl: publicUrl, content: file.name } : s
        )
      );

      toast({
        title: "圖片上傳成功",
        description: "圖片已成功添加到文件中",
      });
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "上傳失敗",
        description: "圖片上傳失敗，請重試",
        variant: "destructive",
      });
    } finally {
      setUploadingImageId(null);
    }
  };

  const triggerImageUpload = (sectionId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageUpload(file, sectionId);
      }
    };
    input.click();
  };

  const addImageSection = (insertAfterIndex?: number) => {
    saveToHistory();
    const newSection: DocumentSection = {
      id: `section-${Date.now()}`,
      type: "image",
      content: "",
    };
    if (insertAfterIndex !== undefined) {
      const newSections = [...sections];
      newSections.splice(insertAfterIndex + 1, 0, newSection);
      setSections(newSections);
    } else {
      setSections([...sections, newSection]);
    }
  };

  const updateSection = (id: string, content: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, content } : s))
    );
  };

  const updateHeadingLevel = (id: string, level: number) => {
    saveToHistory();
    setSections(
      sections.map((s) => (s.id === id ? { ...s, level } : s))
    );
  };

  const removeSection = (id: string) => {
    saveToHistory();
    setSections(sections.filter((s) => s.id !== id));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    
    saveToHistory();
    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    setSections(newSections);
  };

  const mergeWithPrevious = (index: number) => {
    if (index === 0) return;
    
    const prevSection = sections[index - 1];
    const currentSection = sections[index];
    
    // Only merge if previous section is a text-based section
    if (prevSection.type === 'pagebreak' || prevSection.type === 'image') {
      toast({
        title: "無法融合",
        description: "無法與分頁符或圖片融合",
        variant: "destructive",
      });
      return;
    }
    
    saveToHistory();
    
    if (currentSection.type === 'pagebreak' || currentSection.type === 'image') {
      // Just remove the current section if it's a page break or image
      setSections(sections.filter((_, i) => i !== index));
      return;
    }
    
    // Merge content
    const mergedContent = prevSection.content + (prevSection.content && currentSection.content ? '\n' : '') + currentSection.content;
    
    const newSections = sections.filter((_, i) => i !== index);
    newSections[index - 1] = { ...prevSection, content: mergedContent };
    
    setSections(newSections);
    
    toast({
      title: "已融合",
      description: "內容已與上一個區塊合併",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pb-40 space-y-6">
      {/* Title Section */}
      <Card className="p-6 shadow-soft">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          報告標題
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="輸入報告標題..."
          className="text-2xl font-serif font-bold border-none shadow-none px-0 focus-visible:ring-0"
        />
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.id}>
            <Card
              className={cn(
                "p-4 shadow-soft transition-all",
                "border-l-4",
                section.type === "heading" && "border-l-primary",
                section.type === "paragraph" && "border-l-muted-foreground/30",
                section.type === "quote" && "border-l-accent-foreground/50",
                section.type === "pagebreak" && "border-l-destructive/50"
              )}
            >
              {section.type === "pagebreak" ? (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveSection(index, "up")}
                        disabled={index === 0}
                        className="p-1 hover:bg-muted rounded disabled:opacity-30"
                      >
                        <ChevronUp className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => moveSection(index, "down")}
                        disabled={index === sections.length - 1}
                        className="p-1 hover:bg-muted rounded disabled:opacity-30"
                      >
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <SeparatorHorizontal className="w-5 h-5" />
                      <span className="text-sm font-medium">── 分頁符 ──</span>
                      <span className="text-xs text-muted-foreground/60">此處將自動換頁</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSection(section.id)}
                    className="p-2 hover:bg-destructive/10 rounded text-destructive/60 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : section.type === "image" ? (
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveSection(index, "up")}
                        disabled={index === 0}
                        className="p-1 hover:bg-muted rounded disabled:opacity-30"
                      >
                        <ChevronUp className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => moveSection(index, "down")}
                        disabled={index === sections.length - 1}
                        className="p-1 hover:bg-muted rounded disabled:opacity-30"
                      >
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="flex-1">
                      {section.imageUrl ? (
                        <div className="relative">
                          <OptimizedImage 
                            src={section.imageUrl} 
                            alt={section.content || "上傳的圖片"}
                            className="max-h-48 rounded-lg object-contain"
                            priority={true}
                            fadeIn={true}
                          />
                          <button
                            onClick={() => triggerImageUpload(section.id)}
                            className="absolute bottom-2 right-2 px-3 py-1 bg-background/80 backdrop-blur-sm rounded text-xs hover:bg-background"
                          >
                            更換圖片
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => triggerImageUpload(section.id)}
                          disabled={uploadingImageId === section.id}
                          className="flex items-center gap-3 px-6 py-8 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-primary/50 transition-colors w-full justify-center"
                        >
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {uploadingImageId === section.id ? "上傳中..." : "點擊上傳圖片"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeSection(section.id)}
                    className="p-2 hover:bg-destructive/10 rounded text-destructive/60 hover:text-destructive transition-colors ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
              <div className="flex items-start gap-3">
                  {/* Move Controls */}
                  <div className="flex flex-col gap-0.5 pt-2">
                    <button
                      onClick={() => moveSection(index, "up")}
                      disabled={index === 0}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30"
                      title="向上移動"
                    >
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => moveSection(index, "down")}
                      disabled={index === sections.length - 1}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30"
                      title="向下移動"
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => mergeWithPrevious(index)}
                      disabled={index === 0}
                      className="p-1 hover:bg-primary/10 rounded disabled:opacity-30"
                      title="向上融合"
                    >
                      <Merge className="w-4 h-4 text-primary rotate-180" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {section.type === "heading" && "標題"}
                        {section.type === "paragraph" && "段落"}
                        {section.type === "quote" && "引用"}
                      </span>
                      
                      {section.type === "heading" && (
                        <select
                          value={section.level || 2}
                          onChange={(e) => updateHeadingLevel(section.id, Number(e.target.value))}
                          className="text-xs bg-muted rounded px-2 py-1 border-none"
                        >
                          <option value={1}>H1 大標題</option>
                          <option value={2}>H2 中標題</option>
                          <option value={3}>H3 小標題</option>
                        </select>
                      )}
                    </div>

                    {section.type === "paragraph" || section.type === "quote" ? (
                      <Textarea
                        value={section.content}
                        onChange={(e) => updateSection(section.id, e.target.value)}
                        placeholder={section.type === "quote" ? "輸入引用內容..." : "輸入段落內容..."}
                        className="min-h-[120px] font-serif leading-relaxed resize-y"
                      />
                    ) : (
                      <Input
                        value={section.content}
                        onChange={(e) => updateSection(section.id, e.target.value)}
                        placeholder="輸入標題..."
                        className={cn(
                          "font-serif font-semibold border-none shadow-none px-0 focus-visible:ring-0",
                          section.level === 1 && "text-2xl",
                          section.level === 2 && "text-xl",
                          section.level === 3 && "text-lg"
                        )}
                      />
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeSection(section.id)}
                    className="p-2 hover:bg-destructive/10 rounded text-destructive/60 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </Card>
            
            {/* Insert Page Break Button between sections */}
            <div className="flex justify-center py-2 relative z-10">
              <button
                onClick={() => addSection("pagebreak", index)}
                className="px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-dashed border-muted-foreground/40 hover:border-primary rounded-full transition-all"
              >
                <SeparatorHorizontal className="w-3 h-3 inline mr-1.5" />
                在此插入分頁
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Add Section Buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSection("heading")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              新增標題
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSection("paragraph")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              新增段落
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSection("quote")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              新增引用
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSection("pagebreak")}
              className="gap-2 border-dashed"
            >
              <SeparatorHorizontal className="w-4 h-4" />
              插入分頁
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addImageSection()}
              className="gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              新增圖片
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={handleUndo}
              disabled={history.length === 0}
              className="gap-2"
            >
              <Undo2 className="w-4 h-4" />
              復原
              {history.length > 0 && (
                <span className="text-xs text-muted-foreground">({history.length})</span>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => onPreview(title, sections)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              預覽
            </Button>
            <Button
              onClick={() => onSave(title, sections)}
              disabled={isLoading || !title.trim()}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "儲存中..." : "儲存並發布"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
