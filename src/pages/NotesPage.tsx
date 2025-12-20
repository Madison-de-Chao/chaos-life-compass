import { useState } from "react";
import { Header } from "@/components/Header";
import { useNotes, Note, NoteVisibility } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Users,
  Crown,
  Share2,
  Image,
  Video,
  Music,
  Upload,
  ExternalLink,
  Copy,
  Send,
} from "lucide-react";

const visibilityLabels: Record<NoteVisibility, { label: string; icon: React.ReactNode; color: string }> = {
  public: { label: "公開", icon: <Globe className="w-3 h-3" />, color: "bg-green-100 text-green-700" },
  members: { label: "會員專屬", icon: <Users className="w-3 h-3" />, color: "bg-blue-100 text-blue-700" },
  paid_members: { label: "付費會員", icon: <Crown className="w-3 h-3" />, color: "bg-amber-100 text-amber-700" },
};

interface NoteFormData {
  title: string;
  excerpt: string;
  visibility: NoteVisibility;
  content: any;
}

const NotesPage = () => {
  const { notes, loading, createNote, updateNote, deleteNote, publishNote, unpublishNote } = useNotes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState<NoteFormData>({
    title: "",
    excerpt: "",
    visibility: "public",
    content: { sections: [] },
  });
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<{ file: File; type: string; preview?: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      visibility: "public",
      content: { sections: [] },
    });
    setCoverImage(null);
    setAttachments([]);
    setEditingNote(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      excerpt: note.excerpt || "",
      visibility: note.visibility,
      content: note.content || { sections: [] },
    });
    setCoverImage(note.cover_image_url);
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (file: File, type: "cover" | "attachment") => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${type === "cover" ? "covers" : "attachments"}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("note-media")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("note-media")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await handleFileUpload(file, "cover");
      setCoverImage(url);
      toast({ title: "上傳成功", description: "封面圖片已上傳" });
    } catch (error) {
      toast({ title: "上傳失敗", description: "請重試", variant: "destructive" });
    }
    setUploading(false);
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments = Array.from(files).map((file) => {
      const type = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("audio/")
        ? "audio"
        : "file";
      
      return {
        file,
        type,
        preview: type === "image" ? URL.createObjectURL(file) : undefined,
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({ title: "請輸入標題", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      // Upload attachments
      const uploadedAttachments = await Promise.all(
        attachments.map(async (att) => {
          const url = await handleFileUpload(att.file, "attachment");
          return {
            file_name: att.file.name,
            file_type: att.type,
            file_url: url,
            file_size: att.file.size,
          };
        })
      );

      const noteData = {
        title: formData.title,
        excerpt: formData.excerpt || null,
        visibility: formData.visibility,
        content: formData.content,
        cover_image_url: coverImage,
      };

      let savedNote: Note | null;
      if (editingNote) {
        savedNote = await updateNote(editingNote.id, noteData);
      } else {
        savedNote = await createNote(noteData);
      }

      // Save attachments
      if (savedNote && uploadedAttachments.length > 0) {
        await supabase.from("note_attachments").insert(
          uploadedAttachments.map((att, index) => ({
            note_id: savedNote!.id,
            ...att,
            sort_order: index,
          }))
        );
      }

      toast({
        title: editingNote ? "更新成功" : "建立成功",
        description: editingNote ? "筆記已更新" : "筆記已建立",
      });

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Save error:", error);
      toast({ title: "儲存失敗", description: "請重試", variant: "destructive" });
    }
    setUploading(false);
  };

  const handlePublish = async (note: Note) => {
    if (note.is_published) {
      await unpublishNote(note.id);
      toast({ title: "已取消發布" });
    } else {
      await publishNote(note.id);
      toast({ title: "已發布" });
    }
  };

  const handleSyncSocial = async (note: Note, platform: "facebook" | "instagram") => {
    if (!note.is_published) {
      toast({ title: "請先發布筆記", variant: "destructive" });
      return;
    }

    setSyncing(`${note.id}-${platform}`);
    try {
      const { data, error } = await supabase.functions.invoke("social-sync", {
        body: {
          noteId: note.id,
          platform,
        },
      });

      if (error) throw error;

      toast({
        title: "同步成功",
        description: `已同步到 ${platform === "facebook" ? "Facebook" : "Instagram"}`,
      });
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: "同步失敗",
        description: "請確認社群帳號已連結",
        variant: "destructive",
      });
    }
    setSyncing(null);
  };

  const copyShareLink = (shareLink: string) => {
    const url = `${window.location.origin}/notes/${shareLink}`;
    navigator.clipboard.writeText(url);
    toast({ title: "已複製連結" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-serif">元壹筆記</h1>
            <p className="text-muted-foreground mt-1">管理和發布筆記內容</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            新增筆記
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-muted-foreground">載入中...</div>
          </div>
        ) : notes.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">尚無筆記</p>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              建立第一篇筆記
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {note.cover_image_url && (
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img
                      src={note.cover_image_url}
                      alt={note.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    <Badge className={`shrink-0 ${visibilityLabels[note.visibility].color}`}>
                      {visibilityLabels[note.visibility].icon}
                      <span className="ml-1">{visibilityLabels[note.visibility].label}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {note.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{note.excerpt}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(note.created_at)}</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{note.view_count}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      variant={note.is_published ? "outline" : "default"}
                      size="sm"
                      onClick={() => handlePublish(note)}
                      className="flex-1"
                    >
                      {note.is_published ? (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          取消發布
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          發布
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(note)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => copyShareLink(note.share_link)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>確定刪除？</AlertDialogTitle>
                          <AlertDialogDescription>
                            此操作無法復原，筆記將永久刪除。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteNote(note.id)}>
                            刪除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {note.is_published && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <span className="text-xs text-muted-foreground">同步到：</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncSocial(note, "facebook")}
                        disabled={syncing === `${note.id}-facebook`}
                      >
                        {syncing === `${note.id}-facebook` ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <Send className="w-3 h-3 mr-1" />
                        )}
                        FB
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncSocial(note, "instagram")}
                        disabled={syncing === `${note.id}-instagram`}
                      >
                        {syncing === `${note.id}-instagram` ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <Send className="w-3 h-3 mr-1" />
                        )}
                        IG
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/notes/${note.share_link}`} target="_blank" rel="noopener">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          預覽
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNote ? "編輯筆記" : "新增筆記"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>標題 *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="輸入筆記標題"
              />
            </div>

            <div className="space-y-2">
              <Label>摘要</Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="簡短描述這篇筆記的內容"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>可見性</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value: NoteVisibility) =>
                  setFormData({ ...formData, visibility: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      公開 - 所有人可看
                    </div>
                  </SelectItem>
                  <SelectItem value="members">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      會員專屬 - 需登入會員
                    </div>
                  </SelectItem>
                  <SelectItem value="paid_members">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      付費會員 - 需訂閱方案
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>封面圖片</Label>
              <div className="flex items-center gap-4">
                {coverImage ? (
                  <div className="relative w-32 h-20 rounded overflow-hidden">
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 w-6 h-6"
                      onClick={() => setCoverImage(null)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-32 h-20 border-2 border-dashed rounded cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                      disabled={uploading}
                    />
                    <div className="text-center">
                      <Image className="w-6 h-6 mx-auto text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">上傳封面</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>附件（照片、影片、音檔）</Label>
              <div className="flex flex-wrap gap-2">
                {attachments.map((att, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded border overflow-hidden bg-muted"
                  >
                    {att.type === "image" && att.preview ? (
                      <img src={att.preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-2">
                        {att.type === "video" && <Video className="w-6 h-6 text-muted-foreground" />}
                        {att.type === "audio" && <Music className="w-6 h-6 text-muted-foreground" />}
                        <span className="text-xs text-muted-foreground text-center mt-1 line-clamp-2">
                          {att.file.name}
                        </span>
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 w-5 h-5"
                      onClick={() => removeAttachment(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    multiple
                    className="hidden"
                    onChange={handleAttachmentUpload}
                  />
                  <div className="text-center">
                    <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">上傳</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>內文</Label>
              <Textarea
                value={formData.content?.text || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, text: e.target.value },
                  })
                }
                placeholder="輸入筆記內容..."
                rows={10}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={uploading}>
              {uploading ? "上傳中..." : editingNote ? "儲存" : "建立"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotesPage;
