export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string; // Category ID or Name
  categoryName?: string;
  image: string;
  stock: number;
  unit: string; // e.g. "1 kg", "500g", "1 L", "1 pack"
  rating?: number;
  numReviews?: number;
  isOrganic?: boolean;
  isBestSeller?: boolean;
  createdAt?: string;
}

export interface ProductFilterParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'popular' | 'price-low' | 'price-high' | 'rating' | 'newest';
}
