export interface Category {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CategoryWithChildren extends Category {
  children: Category[];
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "user" | "admin";
  avatar_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string | null;
  description_tr: string | null;
  description_en: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string;
  category_id: string | null;
  sku: string | null;
  weight: string | null;
  benefits_tr: string | null;
  benefits_en: string | null;
  usage_tr: string | null;
  usage_en: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title_tr: string;
  title_en: string | null;
  content_tr: string | null;
  content_en: string | null;
  excerpt_tr: string | null;
  excerpt_en: string | null;
  cover_image: string | null;
  category: string;
  read_time: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  payment_method: string | null;
  payment_id: string | null;
  shipping_address: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    zipCode: string;
  } | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface VkiLead {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  age: number | null;
  height_cm: number;
  weight_kg: number;
  bmi: number;
  bmi_category: string;
  goal: "kilo_ver" | "kilo_al" | "form_koru";
  whatsapp_consent: boolean;
  is_contacted: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface ProductSet {
  id: string;
  name_tr: string;
  slug: string;
  description_tr: string | null;
  image_url: string | null;
  discount_percentage: number;
  discount_amount: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductSetItem {
  id: string;
  set_id: string;
  product_id: string;
  quantity: number;
  sort_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}
