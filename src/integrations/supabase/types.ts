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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      email_accounts: {
        Row: {
          access_token_enc: string | null
          created_at: string
          email: string
          id: string
          last_error: string | null
          last_history_id: string | null
          last_synced_at: string | null
          lovable_connection_id: string | null
          provider: string
          refresh_token_enc: string | null
          scopes: string | null
          status: Database["public"]["Enums"]["email_account_status"]
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token_enc?: string | null
          created_at?: string
          email: string
          id?: string
          last_error?: string | null
          last_history_id?: string | null
          last_synced_at?: string | null
          lovable_connection_id?: string | null
          provider?: string
          refresh_token_enc?: string | null
          scopes?: string | null
          status?: Database["public"]["Enums"]["email_account_status"]
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token_enc?: string | null
          created_at?: string
          email?: string
          id?: string
          last_error?: string | null
          last_history_id?: string | null
          last_synced_at?: string | null
          lovable_connection_id?: string | null
          provider?: string
          refresh_token_enc?: string | null
          scopes?: string | null
          status?: Database["public"]["Enums"]["email_account_status"]
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_imported_messages: {
        Row: {
          account_id: string
          created_at: string
          gmail_message_id: string
          id: string
          parsed_status: string
          parser_name: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          gmail_message_id: string
          id?: string
          parsed_status?: string
          parser_name?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          gmail_message_id?: string
          id?: string
          parsed_status?: string
          parser_name?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_imported_messages_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_imported_messages_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sync_jobs: {
        Row: {
          account_id: string
          created_at: string
          error: string | null
          finished_at: string | null
          id: string
          imported_count: number
          processed_count: number
          started_at: string | null
          status: Database["public"]["Enums"]["email_sync_status"]
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          error?: string | null
          finished_at?: string | null
          id?: string
          imported_count?: number
          processed_count?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["email_sync_status"]
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          error?: string | null
          finished_at?: string | null
          id?: string
          imported_count?: number
          processed_count?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["email_sync_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_sync_jobs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_name: string | null
          created_at: string
          currency: string
          id: string
          notifications_enabled: boolean
          theme: string
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          currency?: string
          id: string
          notifications_enabled?: boolean
          theme?: string
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          currency?: string
          id?: string
          notifications_enabled?: boolean
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["transaction_category"]
          confidence: number | null
          created_at: string
          currency: string | null
          date: string
          email_account_id: string | null
          email_message_id: string | null
          id: string
          imported_at: string | null
          merchant: string | null
          needs_review: boolean
          note: string | null
          reference: string | null
          source: Database["public"]["Enums"]["transaction_source"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: Database["public"]["Enums"]["transaction_category"]
          confidence?: number | null
          created_at?: string
          currency?: string | null
          date?: string
          email_account_id?: string | null
          email_message_id?: string | null
          id?: string
          imported_at?: string | null
          merchant?: string | null
          needs_review?: boolean
          note?: string | null
          reference?: string | null
          source?: Database["public"]["Enums"]["transaction_source"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["transaction_category"]
          confidence?: number | null
          created_at?: string
          currency?: string | null
          date?: string
          email_account_id?: string | null
          email_message_id?: string | null
          id?: string
          imported_at?: string | null
          merchant?: string | null
          needs_review?: boolean
          note?: string | null
          reference?: string | null
          source?: Database["public"]["Enums"]["transaction_source"]
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          plan: Database["public"]["Enums"]["user_plan"]
          updated_at: string
          user_id: string
        }
        Insert: {
          plan?: Database["public"]["Enums"]["user_plan"]
          updated_at?: string
          user_id: string
        }
        Update: {
          plan?: Database["public"]["Enums"]["user_plan"]
          updated_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      email_account_status:
        | "connected"
        | "disconnected"
        | "error"
        | "reauth_required"
      email_sync_status: "queued" | "running" | "success" | "failed"
      transaction_category:
        | "inventory"
        | "food"
        | "transport"
        | "utilities"
        | "salary"
        | "miscellaneous"
        | "marketing"
        | "software"
        | "subscription"
        | "operations"
      transaction_source: "manual" | "email"
      transaction_type: "income" | "expense"
      user_plan: "free" | "pro" | "advanced"
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
      email_account_status: [
        "connected",
        "disconnected",
        "error",
        "reauth_required",
      ],
      email_sync_status: ["queued", "running", "success", "failed"],
      transaction_category: [
        "inventory",
        "food",
        "transport",
        "utilities",
        "salary",
        "miscellaneous",
        "marketing",
        "software",
        "subscription",
        "operations",
      ],
      transaction_source: ["manual", "email"],
      transaction_type: ["income", "expense"],
      user_plan: ["free", "pro", "advanced"],
    },
  },
} as const
