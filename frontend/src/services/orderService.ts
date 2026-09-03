import { api } from './api';
import { Order, OrderStatus } from '../types/Order';
import { CartItem } from '../types/Cart';
import { ShippingAddress } from '../types/Order';

const MOCK_ORDERS: Order[] = [
  {
    _id: 'ord-1001',
    user: 'user-regular-1',
    orderItems: [
      {
        product: 'prod-1',
        name: 'Organic Royal Gala Apples',
        price: 180,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
      },
      {
        product: 'prod-3',
        name: 'Farm Fresh Full Cream Milk',
        price: 66,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      },
    ],
    shippingAddress: {
      fullName: 'Alex Johnson',
      phone: '+91 91234 56789',
      street: '45 Green Garden Layout',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
    },
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    itemsPrice: 558,
    taxPrice: 28,
    shippingPrice: 40,
    totalPrice: 626,
    status: 'Out for Delivery',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    _id: 'ord-1002',
    user: 'user-regular-1',
    orderItems: [
      {
        product: 'prod-6',
        name: 'Organic Unpolished Toor Dal',
        price: 165,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      },
    ],
    shippingAddress: {
      fullName: 'Alex Johnson',
      phone: '+91 91234 56789',
      street: '45 Green Garden Layout',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
    },
    paymentMethod: 'Razorpay',
    paymentStatus: 'Completed',
    paymentDetails: {
      razorpayPaymentId: 'pay_MOCK123456789',
      razorpayOrderId: 'order_MOCK987654321',
    },
    itemsPrice: 165,
    taxPrice: 8,
    shippingPrice: 40,
    totalPrice: 213,
    status: 'Delivered',
    deliveredAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
  },
];

export const orderService = {
  createOrder: async (orderData: {
    items: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: 'Razorpay' | 'COD';
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  }): Promise<Order> => {
    try {
      const res = await api.post('/orders', orderData);
      return res.data;
    } catch {
      const newOrder: Order = {
        _id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
        user: 'user-regular-1',
        orderItems: orderData.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentMethod === 'COD' ? 'Pending' : 'Completed',
        itemsPrice: orderData.itemsPrice,
        taxPrice: orderData.taxPrice,
        shippingPrice: orderData.shippingPrice,
        totalPrice: orderData.totalPrice,
        status: 'Processing',
        createdAt: new Date().toISOString(),
      };

      MOCK_ORDERS.unshift(newOrder);
      return newOrder;
    }
  },

  getMyOrders: async (): Promise<Order[]> => {
    try {
      const res = await api.get('/orders/myorders');
      return res.data;
    } catch {
      return MOCK_ORDERS;
    }
  },

  getOrderById: async (id: string): Promise<Order> => {
    try {
      const res = await api.get(`/orders/${id}`);
      return res.data;
    } catch {
      const order = MOCK_ORDERS.find((o) => o._id === id);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    }
  },

  getAllOrders: async (): Promise<Order[]> => {
    try {
      const res = await api.get('/orders');
      return res.data;
    } catch {
      return MOCK_ORDERS;
    }
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    try {
      const res = await api.put(`/orders/${id}/status`, { status });
      return res.data;
    } catch {
      const order = MOCK_ORDERS.find((o) => o._id === id);
      if (order) {
        order.status = status;
        if (status === 'Delivered') {
          order.deliveredAt = new Date().toISOString();
          order.paymentStatus = 'Completed';
        }
        return { ...order };
      }
      throw new Error('Order not found');
    }
  },
};
