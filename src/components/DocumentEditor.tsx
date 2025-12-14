import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Save, Eye, SeparatorHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DocumentSection {
  id: string;
  type: "heading" | "paragraph" | "quote" | "pagebreak";
  content: string;
  level?: number;
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

  const addSection = (type: DocumentSection["type"], insertAfterIndex?: number) => {
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

  const updateSection = (id: string, content: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, content } : s))
    );
  };

  const updateHeadingLevel = (id: string, level: number) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, level } : s))
    );
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    
    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    setSections(newSections);
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
              ) : (
                <div className="flex items-start gap-3">
                  {/* Move Controls */}
                  <div className="flex flex-col gap-0.5 pt-2">
                    <button
                      onClick={() => moveSection(index, "up")}
                      disabled={index === 0}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => moveSection(index, "down")}
                      disabled={index === sections.length - 1}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
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
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
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
