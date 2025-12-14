import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { FileRecordCard } from "@/components/FileRecordCard";
import { ShareDialog } from "@/components/ShareDialog";
import { StatsOverview } from "@/components/StatsOverview";
import { useDocuments, Document, Customer } from "@/hooks/useDocuments";
import { FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const FilesPage = () => {
  const navigate = useNavigate();
  const { documents, loading, totalSize, deleteDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [customers, setCustomers] = useState<Record<string, Customer>>({});

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data } = await supabase
        .from("customers")
        .select("id, name, gender, birth_date, birth_time, phone, email, notes");
      if (data) {
        const map: Record<string, Customer> = {};
        data.forEach((c) => {
          map[c.id] = c;
        });
        setCustomers(map);
      }
    };
    fetchCustomers();
  }, []);

  const filteredRecords = documents.filter(
    (doc) =>
      doc.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (shareLink: string) => {
    navigate(`/view/${shareLink}`);
  };

  const handleShare = (document: Document) => {
    setSelectedDocument(document);
    setShareDialogOpen(true);
  };

  const handleEdit = (document: Document) => {
    // Get stored sections from document content
    const content = document.content as { title?: string; sections?: any[] } | null;
    if (content?.sections) {
      navigate("/edit", {
        state: {
          file: { name: document.file_name, size: document.file_size },
          title: content.title || document.original_name,
          sections: content.sections,
          filePath: document.file_path,
          documentId: document.id,
          isEditing: true,
          customerId: document.customer_id,
        },
      });
    } else {
      toast({
        title: "無法編輯",
        description: "此文件沒有可編輯的內容",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, filePath?: string | null) => {
    await deleteDocument(id, filePath);
  };

  const handleDocumentUpdate = (updatedDoc: Document) => {
    setSelectedDocument(updatedDoc);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-10">
          <div className="text-center py-20">
            <div className="animate-pulse text-muted-foreground">載入中...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-10">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-3">
            檔案管理
          </h1>
          <p className="text-muted-foreground">
            管理所有文件，查看統計資料與分享設定
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview documents={documents} totalSize={totalSize} />

        {/* Search Bar */}
        <div className="relative max-w-md mb-8 animate-slide-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="搜尋檔案名稱..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* File List */}
        {filteredRecords.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((document, index) => (
              <div
                key={document.id}
                className="animate-slide-up"
                style={{ animationDelay: `${(index + 4) * 0.05}s`, opacity: 0 }}
              >
                <FileRecordCard
                  document={document}
                  customer={document.customer_id ? customers[document.customer_id] : null}
                  onView={handleView}
                  onEdit={handleEdit}
                  onShare={handleShare}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 font-serif">
              沒有找到檔案
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? "嘗試其他搜尋關鍵字" : "上傳您的第一個文件開始使用"}
            </p>
          </div>
        )}
      </main>

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        document={selectedDocument}
        onUpdate={handleDocumentUpdate}
      />
    </div>
  );
};

export default FilesPage;
