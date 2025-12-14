import { useState, useEffect } from "react";
import { Share2, Copy, Check, Link2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Document } from "@/hooks/useDocuments";
import { supabase } from "@/integrations/supabase/client";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onUpdate?: (doc: Document) => void;
}

export function ShareDialog({
  open,
  onOpenChange,
  document,
  onUpdate,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [showPasswordToggle, setShowPasswordToggle] = useState(false);
  const [customPassword, setCustomPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (document) {
      // Check if document has a password hash set
      setShowPasswordToggle(!!document.password_hash);
      // Don't show the actual password - user must enter a new one if they want to change it
      setCustomPassword("");
    }
  }, [document]);

  if (!document) return null;

  const fullUrl = `${window.location.origin}/view/${document.share_link}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast({
      title: "已複製連結",
      description: "分享連結已複製到剪貼簿",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePassword = async () => {
    setIsSaving(true);
    
    // Use server-side function to hash the password
    let passwordHash: string | null = null;
    if (showPasswordToggle && customPassword.trim()) {
      const { data: hashedPwd, error: hashError } = await supabase.rpc('hash_document_password', {
        pwd: customPassword.trim()
      });
      if (hashError) {
        toast({
          title: "儲存失敗",
          description: hashError.message,
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      passwordHash = hashedPwd;
    }
    
    const { data, error } = await supabase
      .from("documents")
      .update({ password_hash: passwordHash })
      .eq("id", document.id)
      .select()
      .single();

    if (error) {
      toast({
        title: "儲存失敗",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "已更新",
        description: passwordHash ? "密碼已設定" : "密碼保護已關閉",
      });
      if (onUpdate && data) {
        onUpdate(data);
      }
      // Clear the password field after saving
      setCustomPassword("");
    }
    setIsSaving(false);
  };

  // Password changed if toggle is on and there's input, or toggle changed state
  const passwordChanged = showPasswordToggle
    ? customPassword.trim() !== ""
    : !!document.password_hash;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Share2 className="w-7 h-7 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-serif text-center">
            分享文件
          </DialogTitle>
          <DialogDescription className="text-center">
            複製連結分享給客人閱讀
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Share Link */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              分享連結
            </Label>
            <div className="flex gap-2">
              <Input
                value={fullUrl}
                readOnly
                className="flex-1 bg-muted text-sm"
              />
              <Button
                variant="secondary"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            {/* Custom domain preview */}
            {!window.location.origin.includes('momo-chao.com') && (
              <p className="text-xs text-muted-foreground mt-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                💡 連接自訂網域後：<span className="font-medium text-primary">https://momo-chao.com/view/{document.share_link}</span>
              </p>
            )}
          </div>

          {/* Password Protection */}
          <div className="space-y-4 p-4 rounded-xl bg-accent/50">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 cursor-pointer">
                <Lock className="w-4 h-4" />
                密碼保護
              </Label>
              <Switch
                checked={showPasswordToggle}
                onCheckedChange={setShowPasswordToggle}
              />
            </div>

            {showPasswordToggle && (
              <div className="space-y-2 animate-fade-in">
                <Input
                  type="text"
                  placeholder="設定分享密碼"
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  客人需要輸入此密碼才能閱讀文件
                </p>
              </div>
            )}

            {passwordChanged && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSavePassword}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? "儲存中..." : "儲存密碼設定"}
              </Button>
            )}
          </div>

          <Button variant="hero" size="lg" className="w-full" onClick={handleCopy}>
            {copied ? "已複製！" : "複製分享連結"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
