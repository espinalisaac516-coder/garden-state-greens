// Shared types that map to the database schema

export interface DbDispensary {
  id: string;
  owner_id: string;
  name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  description: string | null;
  image_url: string | null;
  delivery_fee: number | null;
  delivery_time: string | null;
  is_open: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface DbProduct {
  id: string;
  dispensary_id: string;
  name: string;
  category: string;
  strain: "Sativa" | "Indica" | "Hybrid";
  thc: string | null;
  price: number;
  weight: string | null;
  description: string | null;
  image_url: string | null;
  is_available: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: DbProduct;
  quantity: number;
}
