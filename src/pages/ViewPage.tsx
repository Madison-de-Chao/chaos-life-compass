import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PagedDocumentReader } from "@/components/PagedDocumentReader";
import { PasswordDialog } from "@/components/PasswordDialog";
import { getDocumentByShareLink, incrementViewCount, Document } from "@/hooks/useDocuments";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, FileText, Download, Calendar, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isBefore, parseISO } from "date-fns";

const ViewPage = () => {
  const { shareLink } = useParams<{ shareLink: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [verifiedPassword, setVerifiedPassword] = useState<string | null>(null);

  // Check if user has admin role (not just authenticated)
  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Verify admin role using has_role RPC function
        const { data: hasAdminRole } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        });
        setIsAdmin(hasAdminRole === true);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: hasAdminRole } = await supabase.rpc('has_role', {
            _user_id: session.user.id,
            _role: 'admin'
          });
          setIsAdmin(hasAdminRole === true);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDocument = async () => {
      if (shareLink) {
        const doc = await getDocumentByShareLink(shareLink);
        if (doc) {
          // Check if document is public (is_public controls link access)
          if (doc.is_public === false) {
            setNotFound(true);
            setLoading(false);
            return;
          }
          
          // Check if link has expired
          if (doc.expires_at) {
            const expirationDate = parseISO(doc.expires_at);
            if (isBefore(expirationDate, new Date())) {
              setIsExpired(true);
              setLoading(false);
              return;
            }
          }
          
          setDocument(doc);
          
          // All documents require password - check if password is set
          const { data: hasPassword } = await supabase.rpc('document_has_password', { 
            doc_share_link: shareLink 
          });
          
          if (!hasPassword) {
            // No password set - document not ready for sharing
            setNotFound(true);
            setLoading(false);
            return;
          }
          
          // Check if already authenticated via sessionStorage
          const authKey = `doc_auth_${shareLink}`;
          const isAlreadyAuth = sessionStorage.getItem(authKey) === 'true';
          if (isAlreadyAuth) {
            setIsAuthenticated(true);
            await incrementViewCount(shareLink);
          } else {
            setShowPasswordDialog(true);
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
    if (!shareLink) return;
    
    try {
      // Use secure server-side password verification with rate limiting
      const { data, error } = await supabase.functions.invoke('verify-password', {
        body: { shareLink, password }
      });
      
      if (error) {
        console.error('Password verification error:', error);
        setPasswordError("驗證失敗，請重試");
        return;
      }
      
      // Check if rate limited
      if (data?.isRateLimited) {
        setPasswordError(data.error || "密碼嘗試次數過多，請稍後再試");
        return;
      }
      
      if (data?.valid) {
        setIsAuthenticated(true);
        setShowPasswordDialog(false);
        setPasswordError("");
        // Store password for download functionality (not persisted)
        setVerifiedPassword(password);
        // Store authentication in sessionStorage for print access
        const authKey = `doc_auth_${shareLink}`;
        sessionStorage.setItem(authKey, 'true');
        // Increment view count after successful authentication
        await incrementViewCount(shareLink);
      } else {
        const remaining = data?.remaining;
        if (remaining !== undefined && remaining <= 2) {
          setPasswordError(`密碼錯誤，剩餘 ${remaining} 次嘗試機會`);
        } else {
          setPasswordError("密碼錯誤，請重試");
        }
      }
    } catch (err) {
      console.error('Password verification failed:', err);
      setPasswordError("驗證失敗，請重試");
    }
  };

  const handleDownload = async () => {
    if (!shareLink || !verifiedPassword) {
      console.error('Missing shareLink or password for download');
      return;
    }
    
    try {
      // Use server-side Edge Function for secure signed URL generation
      // Password is required for security verification
      const { data, error } = await supabase.functions.invoke('download-document', {
        body: { shareLink, password: verifiedPassword }
      });
      
      if (error) {
        console.error('Download error:', error);
        return;
      }
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (err) {
      console.error('Download failed:', err);
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

  if (isExpired) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-100 flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4 font-serif">連結已過期</h1>
          <p className="text-lg text-muted-foreground mb-8">此分享連結已超過有效期限，請聯繫報告提供者獲取新連結。</p>
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
            <PagedDocumentReader content={content} documentId={document.id} shareLink={shareLink} isAdmin={isAdmin} />
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
