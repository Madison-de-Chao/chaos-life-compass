import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DocumentReader } from "@/components/DocumentReader";
import { PasswordDialog } from "@/components/PasswordDialog";
import { getDocumentByShareLink } from "@/lib/mockData";
import { DocumentFile } from "@/types/document";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "@/components/ShareDialog";

const ViewPage = () => {
  const { shareLink } = useParams<{ shareLink: string }>();
  const [document, setDocument] = useState<DocumentFile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (shareLink) {
      const doc = getDocumentByShareLink(shareLink);
      if (doc) {
        setDocument(doc);
        // Check if password is required
        if (doc.shareSettings.password) {
          setShowPasswordDialog(true);
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setNotFound(true);
      }
    }
  }, [shareLink]);

  const handlePasswordSubmit = (password: string) => {
    if (document && password === document.shareSettings.password) {
      setIsAuthenticated(true);
      setShowPasswordDialog(false);
      setPasswordError("");
    } else {
      setPasswordError("密碼錯誤，請重試");
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className="text-6xl font-bold text-foreground mb-4 font-serif">404</h1>
          <p className="text-xl text-muted-foreground mb-8">找不到此文件</p>
          <Button asChild variant="hero">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首頁
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Link>
          </Button>
          
          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShareDialogOpen(true)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
          )}
        </div>
      </header>

      {/* Document Content */}
      {isAuthenticated && (
        <main className="container mx-auto px-4 py-12 md:py-20">
          <DocumentReader content={document.content} />
          
          {/* Footer */}
          <footer className="max-w-3xl mx-auto mt-20 pt-10 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              由 <span className="font-medium text-foreground">{document.uploadedBy}</span> 製作
            </p>
          </footer>
        </main>
      )}

      {/* Password Dialog */}
      <PasswordDialog
        open={showPasswordDialog}
        onOpenChange={(open) => {
          if (!open && !isAuthenticated) {
            // Redirect if user closes without authenticating
            window.history.back();
          }
          setShowPasswordDialog(open);
        }}
        onSubmit={handlePasswordSubmit}
        error={passwordError}
      />

      {/* Share Dialog */}
      {document.shareSettings.shareLink && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          shareLink={document.shareSettings.shareLink}
          password={document.shareSettings.password}
        />
      )}
    </div>
  );
};

export default ViewPage;
