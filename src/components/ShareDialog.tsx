import { useState } from "react";
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

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareLink: string;
  password?: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  shareLink,
  password,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [showPasswordToggle, setShowPasswordToggle] = useState(!!password);
  const [customPassword, setCustomPassword] = useState(password || "");

  const fullUrl = `${window.location.origin}/view/${shareLink}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast({
      title: "已複製連結",
      description: "分享連結已複製到剪貼簿",
    });
    setTimeout(() => setCopied(false), 2000);
  };

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
            複製連結分享給其他人閱讀
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
                  分享對象需要輸入此密碼才能閱讀文件
                </p>
              </div>
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
