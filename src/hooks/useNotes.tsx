import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type NoteVisibility = "public" | "members" | "paid_members";

export interface Note {
  id: string;
  title: string;
  content: any;
  excerpt: string | null;
  cover_image_url: string | null;
  visibility: NoteVisibility;
  is_published: boolean;
  published_at: string | null;
  view_count: number;
  share_link: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface NoteAttachment {
  id: string;
  note_id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  file_size: number;
  sort_order: number;
  created_at: string;
}

export interface NoteSocialSync {
  id: string;
  note_id: string;
  platform: string;
  status: string;
  external_post_id: string | null;
  error_message: string | null;
  synced_at: string | null;
  created_at: string;
}

function generateShareLink(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "載入失敗",
        description: "無法載入筆記列表",
        variant: "destructive",
      });
    } else {
      setNotes((data || []) as Note[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async (note: {
    title: string;
    content?: any;
    excerpt?: string;
    cover_image_url?: string;
    visibility?: NoteVisibility;
    is_published?: boolean;
  }) => {
    const { data, error } = await supabase
      .from("notes")
      .insert([{
        ...note,
        share_link: generateShareLink(),
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating note:", error);
      toast({
        title: "建立失敗",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    setNotes((prev) => [data as Note, ...prev]);
    return data as Note;
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    const { data, error } = await supabase
      .from("notes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating note:", error);
      toast({
        title: "更新失敗",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    setNotes((prev) =>
      prev.map((note) => (note.id === id ? (data as Note) : note))
    );
    return data as Note;
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "刪除失敗",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    setNotes((prev) => prev.filter((note) => note.id !== id));
    toast({
      title: "刪除成功",
      description: "筆記已成功刪除",
    });
    return true;
  };

  const publishNote = async (id: string) => {
    return updateNote(id, {
      is_published: true,
      published_at: new Date().toISOString(),
    });
  };

  const unpublishNote = async (id: string) => {
    return updateNote(id, {
      is_published: false,
      published_at: null,
    });
  };

  return {
    notes,
    loading,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    publishNote,
    unpublishNote,
  };
}

// Fetch note by share link (for public viewing)
export async function getNoteByShareLink(shareLink: string): Promise<Note | null> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("share_link", shareLink)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching note:", error);
    return null;
  }

  return data as Note | null;
}

// Fetch note attachments
export async function getNoteAttachments(noteId: string): Promise<NoteAttachment[]> {
  const { data, error } = await supabase
    .from("note_attachments")
    .select("*")
    .eq("note_id", noteId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching attachments:", error);
    return [];
  }

  return (data || []) as NoteAttachment[];
}

// Increment note view count
export async function incrementNoteViewCount(shareLink: string) {
  await supabase.rpc("increment_note_view_count", { note_share_link: shareLink });
}
