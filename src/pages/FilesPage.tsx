import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { FileRecordCard } from "@/components/FileRecordCard";
import { ShareDialog } from "@/components/ShareDialog";
import { mockFileRecords, mockDocuments } from "@/lib/mockData";
import { FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const FilesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const filteredRecords = mockFileRecords.filter(
    (record) =>
      record.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (id: string) => {
    const doc = mockDocuments.find((d) => d.id === id);
    if (doc?.shareSettings.shareLink) {
      navigate(`/view/${doc.shareSettings.shareLink}`);
    }
  };

  const handleShare = (id: string) => {
    setSelectedFileId(id);
    setShareDialogOpen(true);
  };

  const selectedDoc = mockDocuments.find((d) => d.id === selectedFileId);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-10">
        {/* Page Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-3">
            檔案列表
          </h1>
          <p className="text-muted-foreground">
            管理您上傳的所有文件，查看閱讀次數與分享狀態
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mb-8 animate-slide-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="搜尋檔案名稱或上傳者..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* File List */}
        {filteredRecords.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((record, index) => (
              <div
                key={record.id}
                className="animate-slide-up"
                style={{ animationDelay: `${(index + 2) * 0.1}s`, opacity: 0 }}
              >
                <FileRecordCard
                  record={record}
                  onView={handleView}
                  onShare={handleShare}
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
      {selectedDoc && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          shareLink={selectedDoc.shareSettings.shareLink || ""}
          password={selectedDoc.shareSettings.password}
        />
      )}
    </div>
  );
};

export default FilesPage;
