import { Product } from './Product';
import { User } from './User';

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  product: Product | string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface Order {
  _id: string;
  user: User | string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'Razorpay' | 'COD';
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  paymentDetails?: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: OrderStatus;
  deliveredAt?: string;
  createdAt: string;
}
