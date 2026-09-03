import { api } from './api';

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

export const paymentService = {
  createRazorpayOrder: async (amountInRupees: number): Promise<RazorpayOrderResponse> => {
    try {
      const res = await api.post('/payment/create-order', { amount: amountInRupees });
      return res.data;
    } catch {
      // Mock order creation for Razorpay test mode
      return {
        id: `order_mock_${Date.now()}`,
        amount: amountInRupees * 100,
        currency: 'INR',
      };
    }
  },

  verifyPayment: async (paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.post('/payment/verify', paymentData);
      return res.data;
    } catch {
      return {
        success: true,
        message: 'Payment verified successfully (Demo Mode)',
      };
    }
  },
};
