import { api } from './api';
import { Product, Category, ProductFilterParams } from '../types/Product';

export const INITIAL_CATEGORIES: Category[] = [
  { _id: 'cat-1', name: 'Fresh Fruits', slug: 'fresh-fruits', description: 'Farm fresh organic fruits' },
  { _id: 'cat-2', name: 'Vegetables', slug: 'vegetables', description: 'Crisp & green farm vegetables' },
  { _id: 'cat-3', name: 'Dairy & Milk', slug: 'dairy-milk', description: 'Fresh milk, butter, cheese & curd' },
  { _id: 'cat-4', name: 'Bakery & Snacks', slug: 'bakery-snacks', description: 'Freshly baked bread, biscuits & cookies' },
  { _id: 'cat-5', name: 'Beverages', slug: 'beverages', description: 'Juices, cold drinks, tea & coffee' },
  { _id: 'cat-6', name: 'Organic Staples', slug: 'organic-staples', description: 'Pulses, rice, flour & spices' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    _id: 'prod-1',
    name: 'Organic Royal Gala Apples',
    description: 'Crisp, sweet, and naturally grown organic apples directly imported from Himachali orchards.',
    price: 180,
    originalPrice: 220,
    category: 'cat-1',
    categoryName: 'Fresh Fruits',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    stock: 45,
    unit: '1 kg',
    rating: 4.8,
    numReviews: 124,
    isOrganic: true,
    isBestSeller: true,
  },
  {
    _id: 'prod-2',
    name: 'Fresh Farm Spinach (Palak)',
    description: 'Pesticide-free leafy spinach rich in iron and vitamins, washed and ready to cook.',
    price: 35,
    originalPrice: 45,
    category: 'cat-2',
    categoryName: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    stock: 30,
    unit: '250 g',
    rating: 4.6,
    numReviews: 89,
    isOrganic: true,
    isBestSeller: false,
  },
  {
    _id: 'prod-3',
    name: 'Farm Fresh Full Cream Milk',
    description: 'Pasteurized whole milk enriched with natural Vitamin D and Calcium.',
    price: 66,
    originalPrice: 70,
    category: 'cat-3',
    categoryName: 'Dairy & Milk',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    stock: 100,
    unit: '1 L',
    rating: 4.9,
    numReviews: 310,
    isOrganic: false,
    isBestSeller: true,
  },
  {
    _id: 'prod-4',
    name: 'Whole Wheat Sourdough Bread',
    description: 'Artisanal sourdough bread slow-fermented for 24 hours with zero preservatives.',
    price: 95,
    originalPrice: 120,
    category: 'cat-4',
    categoryName: 'Bakery & Snacks',
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
    stock: 20,
    unit: '400 g',
    rating: 4.7,
    numReviews: 68,
    isOrganic: true,
    isBestSeller: false,
  },
  {
    _id: 'prod-5',
    name: 'Cold Pressed Orange Juice',
    description: '100% natural, freshly squeezed orange juice with natural pulp and no added sugar.',
    price: 130,
    originalPrice: 150,
    category: 'cat-5',
    categoryName: 'Beverages',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    unit: '500 ml',
    rating: 4.8,
    numReviews: 92,
    isOrganic: true,
    isBestSeller: true,
  },
  {
    _id: 'prod-6',
    name: 'Organic Unpolished Toor Dal',
    description: 'Protein-rich organic pigeon peas, naturally processed without chemical polishing.',
    price: 165,
    originalPrice: 190,
    category: 'cat-6',
    categoryName: 'Organic Staples',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    stock: 60,
    unit: '1 kg',
    rating: 4.9,
    numReviews: 145,
    isOrganic: true,
    isBestSeller: true,
  },
  {
    _id: 'prod-7',
    name: 'Fresh Alphonso Mangoes',
    description: 'Handpicked naturally ripened Ratnagiri Alphonso mangoes with rich aroma.',
    price: 550,
    originalPrice: 650,
    category: 'cat-1',
    categoryName: 'Fresh Fruits',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    stock: 15,
    unit: '1 kg (approx 4-5 pcs)',
    rating: 4.9,
    numReviews: 210,
    isOrganic: true,
    isBestSeller: true,
  },
  {
    _id: 'prod-8',
    name: 'Organic Cherry Tomatoes',
    description: 'Sweet and juicy vine-ripened cherry tomatoes perfect for salads and pasta.',
    price: 60,
    originalPrice: 75,
    category: 'cat-2',
    categoryName: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    stock: 40,
    unit: '250 g',
    rating: 4.5,
    numReviews: 54,
    isOrganic: true,
    isBestSeller: false,
  },
];

export const productService = {
  getProducts: async (params?: ProductFilterParams): Promise<Product[]> => {
    try {
      const res = await api.get('/products', { params });
      return res.data;
    } catch {
      // Mock filtering logic
      let products = [...MOCK_PRODUCTS];

      if (params?.category && params.category !== 'all') {
        products = products.filter(
          (p) => p.category === params.category || p.categoryName?.toLowerCase() === params.category?.toLowerCase()
        );
      }

      if (params?.search) {
        const query = params.search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.categoryName?.toLowerCase().includes(query)
        );
      }

      if (params?.minPrice !== undefined) {
        products = products.filter((p) => p.price >= params.minPrice!);
      }

      if (params?.maxPrice !== undefined) {
        products = products.filter((p) => p.price <= params.maxPrice!);
      }

      if (params?.sortBy) {
        if (params.sortBy === 'price-low') products.sort((a, b) => a.price - b.price);
        if (params.sortBy === 'price-high') products.sort((a, b) => b.price - a.price);
        if (params.sortBy === 'rating') products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        if (params.sortBy === 'popular') products.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
      }

      return products;
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data;
    } catch {
      const found = MOCK_PRODUCTS.find((p) => p._id === id);
      if (!found) {
        throw new Error('Product not found');
      }
      return found;
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const res = await api.get('/categories');
      return res.data;
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    try {
      const res = await api.post('/products', productData);
      return res.data;
    } catch {
      const newProduct: Product = {
        _id: `prod-${Date.now()}`,
        name: productData.name || 'New Product',
        description: productData.description || '',
        price: Number(productData.price) || 0,
        originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
        category: productData.category || 'cat-1',
        categoryName: productData.categoryName || 'General',
        image: productData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        stock: Number(productData.stock) || 10,
        unit: productData.unit || '1 unit',
        rating: 5.0,
        numReviews: 1,
        isOrganic: productData.isOrganic ?? true,
        isBestSeller: false,
      };
      MOCK_PRODUCTS.unshift(newProduct);
      return newProduct;
    }
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      const res = await api.put(`/products/${id}`, productData);
      return res.data;
    } catch {
      const index = MOCK_PRODUCTS.findIndex((p) => p._id === id);
      if (index !== -1) {
        MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...productData };
        return MOCK_PRODUCTS[index];
      }
      throw new Error('Product not found');
    }
  },

  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    try {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    } catch {
      const index = MOCK_PRODUCTS.findIndex((p) => p._id === id);
      if (index !== -1) {
        MOCK_PRODUCTS.splice(index, 1);
      }
      return { success: true };
    }
  },
};
