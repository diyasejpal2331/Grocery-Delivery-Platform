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
      const rawProducts: any[] = Array.isArray(res.data) ? res.data : [];
      return rawProducts.map((p) => ({
        ...p,
        category: typeof p.category === 'object' && p.category ? p.category._id : p.category,
        categoryName: typeof p.category === 'object' && p.category ? p.category.name : (p.categoryName || 'General'),
      }));
    } catch {
      return [];
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const res = await api.get(`/products/${id}`);
      const p = res.data;
      return {
        ...p,
        category: typeof p.category === 'object' && p.category ? p.category._id : p.category,
        categoryName: typeof p.category === 'object' && p.category ? p.category.name : p.categoryName,
      };
    } catch {
      throw new Error('Product not found');
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const res = await api.get('/categories');
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch {
      return [];
    }
  },

  createCategory: async (categoryData: Partial<Category>): Promise<Category> => {
    try {
      const res = await api.post('/categories', categoryData);
      return res.data;
    } catch (err: any) {
      if (err.status || (err.data?.message && err.message !== 'Network Error')) {
        throw new Error(err.data?.message || err.message);
      }
      const newCat: Category = {
        _id: `cat-${Date.now()}`,
        name: categoryData.name || '',
        slug: categoryData.slug || (categoryData.name || '').toLowerCase().replace(/\s+/g, '-'),
        description: categoryData.description || 'Fresh store produce category',
      };
      INITIAL_CATEGORIES.push(newCat);
      return newCat;
    }
  },

  updateCategory: async (id: string, categoryData: Partial<Category>): Promise<Category> => {
    try {
      const res = await api.put(`/categories/${id}`, categoryData);
      return res.data;
    } catch (err: any) {
      if (err.status || (err.data?.message && err.message !== 'Network Error')) {
        throw new Error(err.data?.message || err.message);
      }
      const index = INITIAL_CATEGORIES.findIndex((c) => c._id === id);
      if (index !== -1) {
        INITIAL_CATEGORIES[index] = { ...INITIAL_CATEGORIES[index], ...categoryData };
        return INITIAL_CATEGORIES[index];
      }
      return {
        _id: id,
        name: categoryData.name || '',
        slug: categoryData.slug || '',
        description: categoryData.description || '',
      };
    }
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    try {
      const res = await api.delete(`/categories/${id}`);
      return res.data;
    } catch (err: any) {
      if (err.status || (err.data?.message && err.message !== 'Network Error')) {
        throw new Error(err.data?.message || err.message);
      }
      const index = INITIAL_CATEGORIES.findIndex((c) => c._id === id);
      if (index !== -1) {
        INITIAL_CATEGORIES.splice(index, 1);
      }
      return { message: 'Category deleted successfully' };
    }
  },

  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    try {
      const res = await api.post('/products', productData);
      const data = res.data;
      return {
        ...data,
        category: typeof data.category === 'object' && data.category ? data.category._id : (data.category || productData.category),
        categoryName: typeof data.category === 'object' && data.category ? data.category.name : productData.categoryName,
      };
    } catch (err) {
      const newProd: Product = {
        _id: `prod-${Date.now()}`,
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || 0,
        originalPrice: productData.originalPrice,
        category: productData.category || '',
        categoryName: productData.categoryName || 'General',
        image: productData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        stock: productData.stock || 0,
        unit: productData.unit || '1 kg',
        isOrganic: productData.isOrganic ?? false,
      };
      MOCK_PRODUCTS.unshift(newProd);
      return newProd;
    }
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      const res = await api.put(`/products/${id}`, productData);
      const data = res.data;
      return {
        ...data,
        category: typeof data.category === 'object' && data.category ? data.category._id : (data.category || productData.category),
        categoryName: typeof data.category === 'object' && data.category ? data.category.name : productData.categoryName,
      };
    } catch (err) {
      const index = MOCK_PRODUCTS.findIndex((p) => p._id === id);
      if (index !== -1) {
        MOCK_PRODUCTS[index] = {
          ...MOCK_PRODUCTS[index],
          ...productData,
          category: productData.category || MOCK_PRODUCTS[index].category,
          categoryName: productData.categoryName || MOCK_PRODUCTS[index].categoryName,
        };
        return MOCK_PRODUCTS[index];
      }
      return {
        _id: id,
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || 0,
        originalPrice: productData.originalPrice,
        category: productData.category || '',
        categoryName: productData.categoryName || 'General',
        image: productData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        stock: productData.stock || 0,
        unit: productData.unit || '1 kg',
        isOrganic: productData.isOrganic ?? false,
      };
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
