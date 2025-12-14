import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PagedDocumentReader } from "@/components/PagedDocumentReader";
import { PasswordDialog } from "@/components/PasswordDialog";
import { getDocumentByShareLink, incrementViewCount, Document } from "@/hooks/useDocuments";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, FileText, Download, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";

const ViewPage = () => {
  const { shareLink } = useParams<{ shareLink: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<User | null>(null);

  // Check if admin is logged in
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAdminUser(session?.user ?? null);
    };
    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAdminUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDocument = async () => {
      if (shareLink) {
        const doc = await getDocumentByShareLink(shareLink);
        if (doc) {
          setDocument(doc);
          // Check if password is required
          if (doc.password) {
            setShowPasswordDialog(true);
          } else {
            setIsAuthenticated(true);
            // Increment view count
            await incrementViewCount(shareLink);
          }
        } else {
          setNotFound(true);
        }
      }
      setLoading(false);
    };

    fetchDocument();
  }, [shareLink]);

  const handlePasswordSubmit = async (password: string) => {
    if (document && password === document.password) {
      setIsAuthenticated(true);
      setShowPasswordDialog(false);
      setPasswordError("");
      // Increment view count after successful authentication
      if (shareLink) {
        await incrementViewCount(shareLink);
      }
    } else {
      setPasswordError("密碼錯誤，請重試");
    }
  };

  const handleDownload = async () => {
    if (!document?.file_path) return;
    
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrl(document.file_path, 60);
    
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">載入中...</div>
      </div>
    );
  }

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

  // Parse content from JSON
  const content = document.content as { title: string; htmlContent?: string; sections?: any[] } | null;

  return (
    <div className="min-h-screen bg-background">
      {/* Document Content */}
      {isAuthenticated && (
        <>
          {content ? (
            <PagedDocumentReader content={content} documentId={document.id} shareLink={shareLink} isAdmin={!!adminUser} />
          ) : (
            /* File Download Card when no parsed content */
            <main className="container mx-auto px-4 py-12 md:py-20">
              <div className="max-w-2xl mx-auto animate-fade-in">
                <Card className="overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <FileText className="w-10 h-10 text-primary" />
                      </div>
                      
                      <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground font-serif">
                          {document.original_name}
                        </h1>
                        <p className="text-muted-foreground">
                          {formatFileSize(document.file_size)}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(document.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          <span>{document.view_count} 次閱讀</span>
                        </div>
                      </div>

                      {document.file_path && (
                        <Button onClick={handleDownload} size="lg" className="mt-4">
                          <Download className="w-4 h-4 mr-2" />
                          下載文件
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          )}
        </>
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
    </div>
  );
};

export default ViewPage;
