import { api } from './api';
import { User, AuthResponse, LoginCredentials, RegisterData } from '../types/User';

// Mock user for offline/demo support
const MOCK_ADMIN_USER: User = {
  _id: 'user-admin-1',
  name: 'Store Admin',
  email: 'admin@freshmart.com',
  role: 'admin',
  phone: '+91 98765 43210',
  address: {
    street: '123 Tech Park Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
  },
};

const MOCK_REGULAR_USER: User = {
  _id: 'user-regular-1',
  name: 'Alex Johnson',
  email: 'user@freshmart.com',
  role: 'user',
  phone: '+91 91234 56789',
  address: {
    street: '45 Green Garden Layout',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
  },
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const res = await api.post('/users/login', credentials);
      return res.data;
    } catch {
      // Fallback mock login for offline development
      const isDemoAdmin = credentials.email.includes('admin');
      const user = isDemoAdmin ? MOCK_ADMIN_USER : MOCK_REGULAR_USER;
      const mockToken = `mock-jwt-token-${user._id}`;
      
      return {
        token: mockToken,
        user: { ...user, email: credentials.email },
        message: 'Logged in successfully (Demo Mode)',
      };
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const res = await api.post('/users/register', data);
      return res.data;
    } catch {
      // Fallback mock registration
      const newUser: User = {
        _id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'user',
      };
      return {
        token: `mock-jwt-token-${newUser._id}`,
        user: newUser,
        message: 'Registered successfully (Demo Mode)',
      };
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const res = await api.get('/users/profile');
      return res.data;
    } catch {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      return MOCK_REGULAR_USER;
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    try {
      const res = await api.put('/users/profile', data);
      return res.data;
    } catch {
      const stored = localStorage.getItem('user');
      const current = stored ? JSON.parse(stored) : MOCK_REGULAR_USER;
      const updated = { ...current, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    }
  },

  getUsers: async (): Promise<User[]> => {
    try {
      const res = await api.get('/users');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return [MOCK_ADMIN_USER, MOCK_REGULAR_USER];
    } catch {
      return [MOCK_ADMIN_USER, MOCK_REGULAR_USER];
    }
  },
};
