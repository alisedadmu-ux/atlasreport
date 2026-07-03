export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          emoji: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          emoji?: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          emoji?: string
          slug?: string
          created_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          category: string
          title: string
          description: string
          content: string[]
          image: string
          author: string
          published: string
          created_at: string
        }
        Insert: {
          id?: string
          category?: string
          title: string
          description?: string
          content?: string[]
          image?: string
          author?: string
          published?: string
          created_at?: string
        }
        Update: {
          id?: string
          category?: string
          title?: string
          description?: string
          content?: string[]
          image?: string
          author?: string
          published?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          article_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}