import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { DocumentEditor, DocumentSection } from "@/components/DocumentEditor";
import { DocumentReader } from "@/components/DocumentReader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { sectionsToHtml } from "@/lib/parseDocx";
import { ArrowLeft, X, User } from "lucide-react";
import { Customer } from "@/hooks/useDocuments";

interface LocationState {
  file: { name: string; size: number };
  title: string;
  sections: DocumentSection[];
  filePath: string;
  documentId?: string;
  isEditing?: boolean;
  customerId?: string | null;
}

const EditDocumentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<{
    title: string;
    htmlContent: string;
  } | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const state = location.state as LocationState | null;

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data } = await supabase
        .from("customers")
        .select("id, name, gender, birth_date, birth_time, phone, email, notes")
        .order("name");
      setCustomers(data || []);
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (state?.customerId) {
      setSelectedCustomerId(state.customerId);
    }
  }, [state?.customerId]);

  useEffect(() => {
    if (!state || !user) {
      navigate("/");
    }
  }, [state, user, navigate]);

  if (!state) {
    return null;
  }

  const handlePreview = (title: string, sections: DocumentSection[]) => {
    const htmlContent = sectionsToHtml(sections);
    setPreviewContent({ title, htmlContent });
    setShowPreview(true);
  };

  const handleSave = async (title: string, sections: DocumentSection[]) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const htmlContent = sectionsToHtml(sections);

      if (state.isEditing && state.documentId) {
        // Update existing document
        const { error: dbError } = await supabase
          .from("documents")
          .update({
            content: { title, htmlContent, sections: JSON.parse(JSON.stringify(sections)) },
            updated_at: new Date().toISOString(),
            customer_id: selectedCustomerId,
          })
          .eq("id", state.documentId);

        if (dbError) throw dbError;

        toast({
          title: "文件已更新",
          description: "您的報告已成功儲存",
        });
      } else {
        // Create new document
        const shareLink = `doc-${Math.random().toString(36).substring(2, 10)}`;

        const { error: dbError } = await supabase
          .from("documents")
          .insert([{
            file_name: state.file.name,
            original_name: state.file.name,
            file_path: state.filePath,
            file_size: state.file.size,
            share_link: shareLink,
            is_public: true,
            content: { title, htmlContent, sections: JSON.parse(JSON.stringify(sections)) },
            customer_id: selectedCustomerId,
          }]);

        if (dbError) {
          // Clean up uploaded file if database insert fails
          if (state.filePath) {
            await supabase.storage.from("documents").remove([state.filePath]);
          }
          throw dbError;
        }

        toast({
          title: "文件已發布",
          description: "您的報告已成功儲存",
        });
      }

      navigate("/files");
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: "儲存失敗",
        description: error.message || "無法儲存文件，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-8 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(state.isEditing ? "/files" : "/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            {state.isEditing ? "編輯報告" : "編輯報告內容"}
          </h1>
        </div>

        {/* Customer Selection */}
        <div className="px-4 mb-6">
          <div className="max-w-md">
            <Label className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              關聯客戶
            </Label>
            <Select
              value={selectedCustomerId || "none"}
              onValueChange={(v) => setSelectedCustomerId(v === "none" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇客戶（可選）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">不關聯客戶</SelectItem>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DocumentEditor
          initialTitle={state.title}
          initialSections={state.sections}
          onSave={handleSave}
          onPreview={handlePreview}
          isLoading={isLoading}
        />
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>預覽</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {previewContent && (
            <div className="py-8">
              <DocumentReader content={previewContent} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditDocumentPage;