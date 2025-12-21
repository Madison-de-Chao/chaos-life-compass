export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          birth_date: string | null
          birth_time: string | null
          created_at: string
          email: string | null
          gender: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          birth_time?: string | null
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          birth_time?: string | null
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: Json | null
          created_at: string
          customer_id: string | null
          expires_at: string | null
          file_name: string
          file_path: string | null
          file_size: number | null
          id: string
          is_public: boolean | null
          original_name: string
          password_hash: string | null
          share_link: string
          tts_audio_urls: Json | null
          updated_at: string
          view_count: number | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          customer_id?: string | null
          expires_at?: string | null
          file_name: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          original_name: string
          password_hash?: string | null
          share_link: string
          tts_audio_urls?: Json | null
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          customer_id?: string | null
          expires_at?: string | null
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          original_name?: string
          password_hash?: string | null
          share_link?: string
          tts_audio_urls?: Json | null
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      entitlements: {
        Row: {
          created_at: string
          ends_at: string | null
          granted_by: string | null
          id: string
          notes: string | null
          plan_id: string | null
          product_id: string
          starts_at: string
          status: Database["public"]["Enums"]["entitlement_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          granted_by?: string | null
          id?: string
          notes?: string | null
          plan_id?: string | null
          product_id: string
          starts_at?: string
          status?: Database["public"]["Enums"]["entitlement_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          granted_by?: string | null
          id?: string
          notes?: string | null
          plan_id?: string | null
          product_id?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["entitlement_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_tracking: {
        Row: {
          created_at: string
          created_by: string | null
          feedback_id: string | null
          id: string
          note: string
          status_change: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          feedback_id?: string | null
          id?: string
          note: string
          status_change?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          feedback_id?: string | null
          id?: string
          note?: string
          status_change?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_tracking_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedbacks"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          admin_notes: string | null
          created_at: string
          customer_name: string | null
          document_id: string | null
          document_title: string
          follow_up_date: string | null
          follow_up_status: string | null
          id: string
          is_read: boolean
          message: string
          resolved_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          customer_name?: string | null
          document_id?: string | null
          document_title: string
          follow_up_date?: string | null
          follow_up_status?: string | null
          id?: string
          is_read?: boolean
          message: string
          resolved_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          customer_name?: string | null
          document_id?: string | null
          document_title?: string
          follow_up_date?: string | null
          follow_up_status?: string | null
          id?: string
          is_read?: boolean
          message?: string
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      member_documents: {
        Row: {
          document_id: string
          granted_at: string
          granted_by: string | null
          id: string
          is_favorited: boolean
          last_viewed_at: string | null
          notes: string | null
          user_id: string
          view_count: number
        }
        Insert: {
          document_id: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_favorited?: boolean
          last_viewed_at?: string | null
          notes?: string | null
          user_id: string
          view_count?: number
        }
        Update: {
          document_id?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_favorited?: boolean
          last_viewed_at?: string | null
          notes?: string | null
          user_id?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "member_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      member_interactions: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          document_id: string | null
          id: string
          interaction_type: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          id?: string
          interaction_type: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          id?: string
          interaction_type?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_interactions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      note_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          note_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number
          file_type: string
          file_url: string
          id?: string
          note_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          note_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "note_attachments_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      note_social_syncs: {
        Row: {
          created_at: string
          error_message: string | null
          external_post_id: string | null
          id: string
          note_id: string
          platform: string
          status: string
          synced_at: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          external_post_id?: string | null
          id?: string
          note_id: string
          platform: string
          status?: string
          synced_at?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          external_post_id?: string | null
          id?: string
          note_id?: string
          platform?: string
          status?: string
          synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "note_social_syncs_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: Json | null
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string | null
          share_link: string
          title: string
          updated_at: string
          view_count: number
          visibility: Database["public"]["Enums"]["note_visibility"]
        }
        Insert: {
          content?: Json | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          share_link: string
          title: string
          updated_at?: string
          view_count?: number
          visibility?: Database["public"]["Enums"]["note_visibility"]
        }
        Update: {
          content?: Json | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          share_link?: string
          title?: string
          updated_at?: string
          view_count?: number
          visibility?: Database["public"]["Enums"]["note_visibility"]
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          duration_days: number | null
          id: string
          name: string
          price: number | null
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_days?: number | null
          id?: string
          name: string
          price?: number | null
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_days?: number | null
          id?: string
          name?: string
          price?: number | null
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plans_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          birth_place: string | null
          birth_time: string | null
          created_at: string
          display_name: string | null
          gender: string | null
          id: string
          phone: string | null
          subscription_expires_at: string | null
          subscription_started_at: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string
          display_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          subscription_expires_at?: string | null
          subscription_started_at?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string
          display_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          subscription_expires_at?: string | null
          subscription_started_at?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number | null
          cancelled_at: string | null
          created_at: string
          currency: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          plan_name: string
          started_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          user_id: string
        }
        Insert: {
          amount?: number | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          plan_name: string
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          user_id: string
        }
        Update: {
          amount?: number | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          plan_name?: string
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      document_has_password: {
        Args: { doc_share_link: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hash_document_password: { Args: { pwd: string }; Returns: string }
      increment_note_view_count: {
        Args: { note_share_link: string }
        Returns: undefined
      }
      increment_view_count: {
        Args: { doc_share_link: string }
        Returns: undefined
      }
      is_member: { Args: { _user_id: string }; Returns: boolean }
      verify_document_password: {
        Args: { doc_share_link: string; pwd: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      entitlement_status: "active" | "expired" | "revoked"
      note_visibility: "public" | "members" | "paid_members"
      subscription_status: "free" | "trial" | "active" | "cancelled" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      entitlement_status: ["active", "expired", "revoked"],
      note_visibility: ["public", "members", "paid_members"],
      subscription_status: ["free", "trial", "active", "cancelled", "expired"],
    },
  },
} as const
