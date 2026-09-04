import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Listing = {
  id: string;
  created_at: string;
  type: "lost" | "found";
  pet_name: string | null;
  species: string;
  color: string | null;
  description: string | null;
  tag_number: string | null;
  last_seen_location: string;
  lat: number | null;
  lng: number | null;
  photo_url: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  reward: string | null;
  sex: string | null;
  last_seen_at: string | null;
  status: "active" | "resolved";
  /// only ever returned by create_listing / listing_by_token, never by a plain read
  edit_token?: string;
};
