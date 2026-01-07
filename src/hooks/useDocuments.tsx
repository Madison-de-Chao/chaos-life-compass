import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Document {
  id: string;
  file_name: string;
  original_name: string;
  file_path: string | null;
  file_size: number;
  content: any;
  share_link: string;
  password_hash?: string | null; // Only available for admin queries, never exposed publicly
  is_public: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  customer_id: string | null;
  expires_at: string | null;
  tts_audio_urls?: any;
}

export interface Customer {
  id: string;
  name: string;
  gender: string | null;
  birth_date: string | null;
  birth_time: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSize, setTotalSize] = useState(0);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "載入失敗",
        description: "無法載入文件列表",
        variant: "destructive",
      });
    } else {
      setDocuments(data || []);
      const size = (data || []).reduce((acc, doc) => acc + (doc.file_size || 0), 0);
      setTotalSize(size);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const createDocument = async (doc: {
    file_name: string;
    original_name: string;
    share_link: string;
    file_path?: string | null;
    file_size?: number;
    content?: any;
    password?: string | null;
    is_public?: boolean;
  }) => {
    const { data, error } = await supabase
      .from("documents")
      .insert([doc])
      .select()
      .single();

    if (error) {
      console.error("Error creating document:", error);
      toast({
        title: "建立失敗",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    setDocuments((prev) => [data, ...prev]);
    return data;
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    const { data, error } = await supabase
      .from("documents")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating document:", error);
      toast({
        title: "更新失敗",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? data : doc))
    );
    return data;
  };

  const deleteDocument = async (id: string, filePath?: string | null) => {
    // Delete from storage if file exists
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([filePath]);
      
      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
      }
    }

    // Delete from database
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "刪除失敗",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    toast({
      title: "刪除成功",
      description: "文件已成功刪除",
    });
    return true;
  };

  return {
    documents,
    loading,
    totalSize,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
  };
}

// Fetch document by share link (for public viewing)
// Uses secure RPC function that never exposes password_hash
export async function getDocumentByShareLink(shareLink: string): Promise<Document | null> {
  const { data, error } = await supabase
    .rpc("get_public_document", { doc_share_link: shareLink });

  if (error) {
    console.error("Error fetching document:", error);
    return null;
  }

  // RPC returns an array, get first item
  if (data && data.length > 0) {
    return data[0] as Document;
  }

  return null;
}

// Fetch public document only (for RLS-protected queries)
// Uses secure RPC function that never exposes password_hash
export async function getPublicDocumentByShareLink(shareLink: string): Promise<Document | null> {
  return getDocumentByShareLink(shareLink);
}

// Increment view count
export async function incrementViewCount(shareLink: string) {
  await supabase.rpc("increment_view_count", { doc_share_link: shareLink });
}
