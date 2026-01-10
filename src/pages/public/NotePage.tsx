import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getNoteByShareLink, getNoteAttachments, incrementNoteViewCount, Note, NoteAttachment } from "@/hooks/useNotes";
import { useMember } from "@/hooks/useMember";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Eye, Lock, Crown, Users, Play, Pause, Volume2 } from "lucide-react";

const NotePage = () => {
  const { shareLink } = useParams<{ shareLink: string }>();
  const { user, profile, loading: memberLoading } = useMember();
  const [note, setNote] = useState<Note | null>(null);
  const [attachments, setAttachments] = useState<NoteAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (!shareLink) return;

      const fetchedNote = await getNoteByShareLink(shareLink);
      
      if (!fetchedNote) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Check access based on visibility
      if (fetchedNote.visibility === "members" && !user) {
        setAccessDenied(true);
        setNote(fetchedNote);
        setLoading(false);
        return;
      }

      if (fetchedNote.visibility === "paid_members") {
        if (!user) {
          setAccessDenied(true);
          setNote(fetchedNote);
          setLoading(false);
          return;
        }
        
        // Check subscription status
        const isPaidMember = profile?.subscription_status === "active" || profile?.subscription_status === "trial";
        if (!isPaidMember) {
          setAccessDenied(true);
          setNote(fetchedNote);
          setLoading(false);
          return;
        }
      }

      setNote(fetchedNote);
      
      // Fetch attachments
      const noteAttachments = await getNoteAttachments(fetchedNote.id);
      setAttachments(noteAttachments);

      // Increment view count
      await incrementNoteViewCount(shareLink);
      
      setLoading(false);
    };

    if (!memberLoading) {
      fetchNote();
    }
  }, [shareLink, user, profile, memberLoading]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleAudio = (audioId: string) => {
    const audio = document.getElementById(audioId) as HTMLAudioElement;
    if (playingAudio === audioId) {
      audio?.pause();
      setPlayingAudio(null);
    } else {
      // Pause any currently playing audio
      if (playingAudio) {
        const currentAudio = document.getElementById(playingAudio) as HTMLAudioElement;
        currentAudio?.pause();
      }
      audio?.play();
      setPlayingAudio(audioId);
    }
  };

  if (loading || memberLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <PublicHeader />
        <div className="flex items-center justify-center py-24">
          <div className="animate-pulse text-white/60">載入中...</div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <PublicHeader />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4 font-serif">找不到筆記</h1>
            <p className="text-white/60 mb-8">此筆記可能已被刪除或尚未發布</p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black">
              <Link to="/home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首頁
              </Link>
            </Button>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (accessDenied && note) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <PublicHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            {note.cover_image_url && (
              <div className="aspect-video rounded-xl overflow-hidden mb-8 relative">
                <img
                  src={note.cover_image_url}
                  alt={note.title}
                  className="w-full h-full object-cover blur-sm"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <Lock className="w-16 h-16 text-white/50" />
                </div>
              </div>
            )}
            
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              {note.visibility === "members" ? (
                <Users className="w-10 h-10 text-amber-400" />
              ) : (
                <Crown className="w-10 h-10 text-amber-500" />
              )}
            </div>

            <h1 className="text-3xl font-bold text-white mb-4 font-serif">{note.title}</h1>
            
            {note.excerpt && (
              <p className="text-lg text-white/60 mb-6">{note.excerpt}</p>
            )}

            <Badge variant="outline" className="mb-8 border-amber-500/30 text-amber-400">
              {note.visibility === "members" ? "會員專屬內容" : "付費會員專屬內容"}
            </Badge>

            <div className="space-y-4">
              {!user ? (
                <>
                  <p className="text-white/60">請登入會員以閱讀此筆記</p>
                  <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-black">
                    <Link to="/member/auth">登入會員</Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-white/60">此內容僅限付費會員閱讀</p>
                  <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-black">
                    <Link to="/member">查看訂閱方案</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (!note) return null;

  const content = note.content as { text?: string; sections?: any[] } | null;
  const imageAttachments = attachments.filter((a) => a.file_type === "image");
  const videoAttachments = attachments.filter((a) => a.file_type === "video");
  const audioAttachments = attachments.filter((a) => a.file_type === "audio");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />
      
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Button variant="ghost" asChild className="mb-6 text-white/70 hover:text-white hover:bg-white/10">
            <Link to="/home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Link>
          </Button>

          {/* Cover image */}
          {note.cover_image_url && (
            <div className="aspect-video rounded-xl overflow-hidden mb-8 border border-white/10">
              <img
                src={note.cover_image_url}
                alt={note.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 font-serif">{note.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(note.published_at || note.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{note.view_count} 次閱讀</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none mb-8">
            {content?.text && (
              <div className="whitespace-pre-wrap text-white/80">{content.text}</div>
            )}
          </div>

          {/* Image gallery */}
          {imageAttachments.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-white">圖片</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageAttachments.map((img) => (
                  <a
                    key={img.id}
                    href={img.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity border border-white/10"
                  >
                    <img
                      src={img.file_url}
                      alt={img.file_name}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Video gallery */}
          {videoAttachments.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-white">影片</h3>
              <div className="space-y-4">
                {videoAttachments.map((video) => (
                  <video
                    key={video.id}
                    src={video.file_url}
                    controls
                    className="w-full rounded-lg border border-white/10"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Audio player */}
          {audioAttachments.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-white">音檔</h3>
              <div className="space-y-3">
                {audioAttachments.map((audio) => (
                  <Card key={audio.id} className="bg-white/5 border-white/10">
                    <CardContent className="flex items-center gap-4 p-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleAudio(`audio-${audio.id}`)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        {playingAudio === `audio-${audio.id}` ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Volume2 className="w-4 h-4 text-white/50" />
                      <span className="flex-1 text-sm text-white/80">{audio.file_name}</span>
                      <audio
                        id={`audio-${audio.id}`}
                        src={audio.file_url}
                        onEnded={() => setPlayingAudio(null)}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <PublicFooter />
    </div>
  );
};

export default NotePage;
