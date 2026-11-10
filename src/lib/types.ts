export type Category = {
  slug: string;
  name: string;
  emoji: string;
  color: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  emoji: string;
  image: string | null;
  gradientFrom: string;
  gradientTo: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviewCount: number;
  stock: number;
  badge: string | null;
  tagline: string;
  description: string;
  specs: string[];
  featured: boolean;
  createdAt: string;
};

export type OrderItem = {
  productId: number;
  name: string;
  emoji: string;
  price: number;
  qty: number;
};

export type Order = {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  postalCode: string;
  note: string;
  shipping: number;
  subtotal: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export type CartLine = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  emoji: string;
  image: string | null;
  gradientFrom: string;
  gradientTo: string;
  stock: number;
  qty: number;
};

export type ProductQuery = {
  category?: string;
  q?: string;
  sort?: string;
  limit?: number;
};
