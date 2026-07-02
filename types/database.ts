// Minimal hand-written types matching supabase/migrations/0001_init.sql.
// Replace with `npm run db:types` output once the project is linked to a live Supabase project.

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          plan: "free" | "pro" | "agency";
          credits_remaining: number;
          credits_monthly_limit: number;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_subscription_status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      brand_kits: {
        Row: {
          id: string;
          user_id: string;
          business_name: string | null;
          industry: string | null;
          description: string | null;
          tone_of_voice: string | null;
          primary_color: string;
          color_name: string | null;
          preferred_style: string;
          default_content_type: string;
          negative_prompt: string;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["brand_kits"]["Row"]> & { user_id: string };
        Update: Partial<Database["public"]["Tables"]["brand_kits"]["Row"]>;
      };
      images: {
        Row: {
          id: string;
          user_id: string;
          storage_path: string;
          public_url: string | null;
          prompt: string;
          event_type: string | null;
          content_type: string | null;
          business_name: string | null;
          brand_color: string | null;
          is_favourite: boolean;
          status: "pending" | "completed" | "failed";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["images"]["Row"]> & {
          user_id: string;
          storage_path: string;
          prompt: string;
        };
        Update: Partial<Database["public"]["Tables"]["images"]["Row"]>;
      };
      captions: {
        Row: {
          id: string;
          image_id: string;
          user_id: string;
          instagram: string | null;
          facebook: string | null;
          linkedin: string | null;
          hashtags: string[];
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["captions"]["Row"]> & {
          image_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["captions"]["Row"]>;
      };
      social_accounts: {
        Row: {
          id: string;
          user_id: string;
          provider: "instagram" | "facebook" | "linkedin" | "tiktok" | "x" | "google_business";
          provider_account_id: string | null;
          display_name: string | null;
          access_token: string | null;
          refresh_token: string | null;
          expires_at: string | null;
          connected_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["social_accounts"]["Row"]> & {
          user_id: string;
          provider: string;
        };
        Update: Partial<Database["public"]["Tables"]["social_accounts"]["Row"]>;
      };
      publish_jobs: {
        Row: {
          id: string;
          user_id: string;
          image_id: string;
          social_account_id: string | null;
          caption: string | null;
          status: "scheduled" | "publishing" | "published" | "failed";
          scheduled_for: string | null;
          published_at: string | null;
          error: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["publish_jobs"]["Row"]> & {
          user_id: string;
          image_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["publish_jobs"]["Row"]>;
      };
    };
  };
}
