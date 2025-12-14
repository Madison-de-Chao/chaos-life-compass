import { useState, useEffect } from "react";
import { Share2, Copy, Check, Link2, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [customPassword, setCustomPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasExistingPassword, setHasExistingPassword] = useState(false);

  useEffect(() => {
    if (document) {
      // Check if document has a password hash set
      setHasExistingPassword(!!document.password_hash);
      // Don't show the actual password - user must enter a new one if they want to change it
      setCustomPassword("");
    }
  }, [document]);

  if (!document) return null;

  const fullUrl = `${window.location.origin}/view/${document.share_link}`;

  const handleCopy = async () => {
    if (!hasExistingPassword) {
      toast({
        title: "請先設定密碼",
        description: "文件必須設定密碼才能分享",
        variant: "destructive",
      });
      return;
    }
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast({
      title: "已複製連結",
      description: "分享連結已複製到剪貼簿",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePassword = async () => {
    if (!customPassword.trim()) {
      toast({
        title: "請輸入密碼",
        description: "文件必須設定密碼才能分享",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    // Use server-side function to hash the password
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
    
    const { data, error } = await supabase
      .from("documents")
      .update({ password_hash: hashedPwd, is_public: true })
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
        title: "密碼已設定",
        description: "文件現在可以透過連結 + 密碼訪問",
      });
      setHasExistingPassword(true);
      if (onUpdate && data) {
        onUpdate(data);
      }
      // Clear the password field after saving
      setCustomPassword("");
    }
    setIsSaving(false);
  };

  const handleDisableAccess = async () => {
    setIsSaving(true);
    
    const { data, error } = await supabase
      .from("documents")
      .update({ is_public: false })
      .eq("id", document.id)
      .select()
      .single();

    if (error) {
      toast({
        title: "更新失敗",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "已停用分享",
        description: "文件連結已失效，訪客將無法查看",
      });
      if (onUpdate && data) {
        onUpdate(data);
      }
      onOpenChange(false);
    }
    setIsSaving(false);
  };

  const handleEnableAccess = async () => {
    if (!hasExistingPassword) {
      toast({
        title: "請先設定密碼",
        description: "文件必須設定密碼才能啟用分享",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    const { data, error } = await supabase
      .from("documents")
      .update({ is_public: true })
      .eq("id", document.id)
      .select()
      .single();

    if (error) {
      toast({
        title: "更新失敗",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "已啟用分享",
        description: "文件現在可以透過連結 + 密碼訪問",
      });
      if (onUpdate && data) {
        onUpdate(data);
      }
    }
    setIsSaving(false);
  };

  const isAccessEnabled = document.is_public !== false;

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
            設定密碼後複製連結分享給客人
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">安全分享模式</p>
              <p>所有文件都需要密碼才能訪問，確保報告內容只有授權客人可以閱讀。</p>
            </div>
          </div>

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
                disabled={!hasExistingPassword || !isAccessEnabled}
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

          {/* Password Protection - Always Required */}
          <div className="space-y-4 p-4 rounded-xl bg-accent/50">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <Label className="font-medium">
                存取密碼 <span className="text-destructive">*</span>
              </Label>
              {hasExistingPassword && (
                <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  已設定
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder={hasExistingPassword ? "輸入新密碼以更新" : "設定分享密碼（必填）"}
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                客人需要輸入此密碼才能閱讀文件
              </p>
            </div>

            {customPassword.trim() && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSavePassword}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? "儲存中..." : hasExistingPassword ? "更新密碼" : "設定密碼"}
              </Button>
            )}
          </div>

          {/* Access Status */}
          {isAccessEnabled ? (
            <>
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full" 
                onClick={handleCopy} 
                disabled={!hasExistingPassword}
              >
                {copied ? "已複製！" : "複製分享連結"}
              </Button>
              
              {!hasExistingPassword && (
                <p className="text-xs text-center text-amber-600">
                  請先設定密碼才能分享文件
                </p>
              )}

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-destructive hover:text-destructive" 
                onClick={handleDisableAccess}
                disabled={isSaving}
              >
                停用分享連結
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-center">
                <p className="text-sm text-amber-700">分享連結已停用</p>
                <p className="text-xs text-amber-600 mt-1">訪客目前無法透過連結訪問此文件</p>
              </div>
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full" 
                onClick={handleEnableAccess}
                disabled={isSaving || !hasExistingPassword}
              >
                啟用分享連結
              </Button>
              {!hasExistingPassword && (
                <p className="text-xs text-center text-amber-600">
                  請先設定密碼才能啟用分享
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
