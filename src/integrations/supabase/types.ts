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
      admins: {
        Row: {
          id: string
          user_id: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      assets: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          title: string | null
          type: string | null
          updated_at: string | null
          workflow_status: Database["public"]["Enums"]["workflow_status"]
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          title?: string | null
          type?: string | null
          updated_at?: string | null
          workflow_status?: Database["public"]["Enums"]["workflow_status"]
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          title?: string | null
          type?: string | null
          updated_at?: string | null
          workflow_status?: Database["public"]["Enums"]["workflow_status"]
        }
        Relationships: []
      }
      payout_requests: {
        Row: {
          amount: number
          id: string
          requested_at: string
          status: string
          user_id: string | null
        }
        Insert: {
          amount: number
          id?: string
          requested_at?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          id?: string
          requested_at?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payout_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount: number | null
          id: string
          payment_method: string | null
          requested_at: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          id?: string
          payment_method?: string | null
          requested_at?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          id?: string
          payment_method?: string | null
          requested_at?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          is_approved: boolean | null
          is_creator: boolean | null
          kyc_doc_url: string | null
          kyc_status: string | null
          kyc_verification_reason: string | null
          name: string | null
          payout_bank: string | null
          payout_upi: string | null
          total_earnings: number | null
          total_views: number | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id: string
          is_approved?: boolean | null
          is_creator?: boolean | null
          kyc_doc_url?: string | null
          kyc_status?: string | null
          kyc_verification_reason?: string | null
          name?: string | null
          payout_bank?: string | null
          payout_upi?: string | null
          total_earnings?: number | null
          total_views?: number | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_creator?: boolean | null
          kyc_doc_url?: string | null
          kyc_status?: string | null
          kyc_verification_reason?: string | null
          name?: string | null
          payout_bank?: string | null
          payout_upi?: string | null
          total_earnings?: number | null
          total_views?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          affiliate_clicks: number | null
          affiliate_conversions: number | null
          affiliate_link: string | null
          asset_used: string | null
          content_url: string | null
          created_at: string
          earnings: number | null
          id: string
          status: string | null
          type: string | null
          user_id: string | null
          views: number | null
        }
        Insert: {
          affiliate_clicks?: number | null
          affiliate_conversions?: number | null
          affiliate_link?: string | null
          asset_used?: string | null
          content_url?: string | null
          created_at?: string
          earnings?: number | null
          id?: string
          status?: string | null
          type?: string | null
          user_id?: string | null
          views?: number | null
        }
        Update: {
          affiliate_clicks?: number | null
          affiliate_conversions?: number | null
          affiliate_link?: string | null
          asset_used?: string | null
          content_url?: string | null
          created_at?: string
          earnings?: number | null
          id?: string
          status?: string | null
          type?: string | null
          user_id?: string | null
          views?: number | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          message: string
          reply: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          reply?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          reply?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          source: string | null
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          source?: string | null
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          source?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          reason: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          reason?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          user_id: string
        }
        Insert: {
          balance?: number
          user_id: string
        }
        Update: {
          balance?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deduct_wallet_balance: {
        Args: { user_id: string; amount: number }
        Returns: undefined
      }
      increment_affiliate_click: {
        Args: { sub_id: string }
        Returns: undefined
      }
      increment_affiliate_conversion: {
        Args: { sub_id: string }
        Returns: undefined
      }
      increment_user_earnings: {
        Args: { user_id_param: string; amount_param: number }
        Returns: undefined
      }
      is_admin: {
        Args: { uid: string }
        Returns: boolean
      }
      verify_kyc: {
        Args: {
          user_id_param: string
          status_param: string
          reason_param?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      workflow_status: "draft" | "in_review" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      workflow_status: ["draft", "in_review", "approved", "rejected"],
    },
  },
} as const
