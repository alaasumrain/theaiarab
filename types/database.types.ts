export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_news: {
        Row: {
          category: string | null
          content_ar: string | null
          content_en: string | null
          created_at: string | null
          id: string
          image_url: string | null
          published_at: string | null
          source_url: string | null
          summary_ar: string
          summary_en: string | null
          tags: string[] | null
          title_ar: string
          title_en: string | null
        }
        Insert: {
          category?: string | null
          content_ar?: string | null
          content_en?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          source_url?: string | null
          summary_ar: string
          summary_en?: string | null
          tags?: string[] | null
          title_ar: string
          title_en?: string | null
        }
        Update: {
          category?: string | null
          content_ar?: string | null
          content_en?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          source_url?: string | null
          summary_ar?: string
          summary_en?: string | null
          tags?: string[] | null
          title_ar?: string
          title_en?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          approved: boolean
          arabic_description: string | null
          arabic_name: string | null
          categories: string | null
          codename: string
          created_at: string | null
          description: string
          difficulty_level: string | null
          email: string
          featured: boolean
          full_name: string
          id: string
          is_free: boolean | null
          labels: string[] | null
          language_support: string[] | null
          logo_src: string | null
          pricing_model: string | null
          product_website: string
          punchline: string
          tags: string[] | null
          tool_type: string | null
          tutorial_url: string | null
          twitter_handle: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          approved?: boolean
          arabic_description?: string | null
          arabic_name?: string | null
          categories?: string | null
          codename: string
          created_at?: string | null
          description: string
          difficulty_level?: string | null
          email: string
          featured?: boolean
          full_name: string
          id?: string
          is_free?: boolean | null
          labels?: string[] | null
          language_support?: string[] | null
          logo_src?: string | null
          pricing_model?: string | null
          product_website: string
          punchline: string
          tags?: string[] | null
          tool_type?: string | null
          tutorial_url?: string | null
          twitter_handle: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          approved?: boolean
          arabic_description?: string | null
          arabic_name?: string | null
          categories?: string | null
          codename?: string
          created_at?: string | null
          description?: string
          difficulty_level?: string | null
          email?: string
          featured?: boolean
          full_name?: string
          id?: string
          is_free?: boolean | null
          labels?: string[] | null
          language_support?: string[] | null
          logo_src?: string | null
          pricing_model?: string | null
          product_website?: string
          punchline?: string
          tags?: string[] | null
          tool_type?: string | null
          tutorial_url?: string | null
          twitter_handle?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      tutorials: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string | null
          difficulty: string | null
          id: string
          title_ar: string
          title_en: string | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string | null
          difficulty?: string | null
          id?: string
          title_ar: string
          title_en?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string | null
          difficulty?: string | null
          id?: string
          title_ar?: string
          title_en?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_id_by_email: {
        Args: { user_email: string }
        Returns: string
      }
      increment_product_view_count: {
        Args: { product_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Utility types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific type exports for common usage
export type Product = Tables<'products'>
export type ProductInsert = TablesInsert<'products'>
export type ProductUpdate = TablesUpdate<'products'>
export type AINews = Tables<'ai_news'>
export type Tutorial = Tables<'tutorials'> 