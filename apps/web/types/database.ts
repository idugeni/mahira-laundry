// Auto-generated Supabase Database types
// Run: npx supabase gen types typescript --local > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      outlets: {
        Row: {
          id: string;
          name: string;
          slug: string;
          address: string;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          latitude: number | null;
          longitude: number | null;
          operating_hours: Json;
          is_active: boolean;
          is_franchise: boolean;
          franchise_fee: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["outlets"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["outlets"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          email: string | null;
          avatar_url: string | null;
          role: "customer" | "kasir" | "kurir" | "manager" | "superadmin";
          outlet_id: string | null;
          loyalty_tier: "bronze" | "silver" | "gold" | "platinum";
          loyalty_points: number;
          referral_code: string | null;
          referred_by: string | null;
          addresses: Json;
          notification_preferences: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string;
          outlet_id: string;
          status:
            | "pending"
            | "confirmed"
            | "picked_up"
            | "washing"
            | "ironing"
            | "ready"
            | "delivering"
            | "completed"
            | "cancelled";
          pickup_address: string | null;
          delivery_address: string | null;
          delivery_type: "pickup" | "delivery" | "both";
          delivery_fee: number;
          subtotal: number;
          discount: number;
          voucher_id: string | null;
          total: number;
          notes: string | null;
          estimated_completion: string | null;
          completed_at: string | null;
          cancelled_at: string | null;
          cancel_reason: string | null;
          kasir_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["orders"]["Row"],
          "id" | "order_number" | "created_at" | "updated_at"
        > & {
          id?: string;
          order_number?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      services: {
        Row: {
          id: string;
          outlet_id: string;
          name: string;
          slug: string;
          description: string | null;
          unit: "kg" | "item" | "pasang" | "meter";
          price: number;
          estimated_duration_hours: number;
          icon: string | null;
          sort_order: number;
          is_active: boolean;
          is_express: boolean;
          express_multiplier: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["services"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
      };
    };
    Enums: {
      user_role: "customer" | "kasir" | "kurir" | "manager" | "superadmin";
      order_status:
        | "pending"
        | "confirmed"
        | "picked_up"
        | "washing"
        | "ironing"
        | "ready"
        | "delivering"
        | "completed"
        | "cancelled";
      payment_status: "unpaid" | "pending" | "paid" | "refunded" | "failed";
      payment_method:
        | "cash"
        | "qris"
        | "bank_transfer"
        | "gopay"
        | "ovo"
        | "dana"
        | "shopeepay";
      delivery_type: "pickup" | "delivery" | "both";
      service_unit: "kg" | "item" | "pasang" | "meter";
      loyalty_tier: "bronze" | "silver" | "gold" | "platinum";
    };
  };
}
