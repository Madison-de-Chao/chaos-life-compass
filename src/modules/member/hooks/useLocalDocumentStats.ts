/**
 * 本地文件統計 Hook
 * 用於獲取會員在本地系統中的文件存取統計資料
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMember } from '../context/MemberContext';

export interface LocalDocumentStats {
  /** 總授權文件數 */
  totalDocuments: number;
  /** 總閱讀次數 */
  totalViews: number;
  /** 收藏文件數 */
  favoritedCount: number;
  /** 最近閱讀的文件 */
  recentDocument: {
    id: string;
    documentId: string;
    fileName: string;
    lastViewedAt: string | null;
  } | null;
}

/**
 * 獲取本地文件統計資料
 */
export function useLocalDocumentStats() {
  const { user } = useMember();

  return useQuery({
    queryKey: ['local-document-stats', user?.id],
    queryFn: async (): Promise<LocalDocumentStats> => {
      if (!user?.id) {
        return {
          totalDocuments: 0,
          totalViews: 0,
          favoritedCount: 0,
          recentDocument: null,
        };
      }

      // 獲取會員文件統計
      const { data: memberDocs, error } = await supabase
        .from('member_documents')
        .select(`
          id,
          document_id,
          view_count,
          is_favorited,
          last_viewed_at,
          documents:document_id (
            file_name,
            original_name
          )
        `)
        .eq('user_id', user.id)
        .order('last_viewed_at', { ascending: false, nullsFirst: false });

      if (error) {
        console.error('Failed to fetch local document stats:', error);
        throw error;
      }

      const docs = memberDocs || [];
      
      // 計算統計資料
      const totalDocuments = docs.length;
      const totalViews = docs.reduce((sum, doc) => sum + (doc.view_count || 0), 0);
      const favoritedCount = docs.filter(doc => doc.is_favorited).length;
      
      // 找到最近閱讀的文件
      const recentDoc = docs.find(doc => doc.last_viewed_at !== null) || docs[0] || null;
      
      const recentDocument = recentDoc ? {
        id: recentDoc.id,
        documentId: recentDoc.document_id,
        fileName: (recentDoc.documents as any)?.original_name 
          || (recentDoc.documents as any)?.file_name 
          || '未命名文件',
        lastViewedAt: recentDoc.last_viewed_at,
      } : null;

      return {
        totalDocuments,
        totalViews,
        favoritedCount,
        recentDocument,
      };
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 分鐘
    gcTime: 10 * 60 * 1000, // 10 分鐘
  });
}

export default useLocalDocumentStats;
