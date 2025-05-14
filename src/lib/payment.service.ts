import { PaymentDetails, CreatePaymentDto, PaymentStatus, Payment } from '@/types/payment.types';

// Mock function to get user payment history
export const getUserPaymentHistory = async (userId: string): Promise<Payment[]> => {
  // Mock data
  return [
    {
      id: 'payment-1',
      userId,
      amount: 1500,
      currency: 'GBP',
      status: 'completed',
      paymentMethod: 'credit_card',
      paymentDetails: {
        cardType: 'Visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2024
      },
      createdAt: '2023-01-15T12:00:00Z',
      updatedAt: '2023-01-15T12:00:00Z',
      description: 'Rent payment for January'
    }
  ];
};

// Mock function to create payment
export const createPayment = async (paymentData: CreatePaymentDto): Promise<Payment> => {
  // Simulate API call
  return {
    id: `payment-${Date.now()}`,
    userId: paymentData.userId,
    amount: paymentData.amount,
    currency: paymentData.currency || 'GBP',
    status: 'pending',
    paymentMethod: paymentData.paymentMethod,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: paymentData.description
  };
};

// Other payment related functions
export const getPaymentById = async (paymentId: string): Promise<Payment> => {
  // Mock implementation
  return {
    id: paymentId,
    userId: 'user-1',
    amount: 1500,
    currency: 'GBP',
    status: 'completed',
    paymentMethod: 'credit_card',
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-01-15T12:00:00Z',
    description: 'Rent payment'
  };
};
