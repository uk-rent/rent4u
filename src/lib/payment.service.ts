import { PaymentDetails, CreatePaymentDto, PaymentStatus, Payment, RefundPaymentDto } from '@/types/payment.types';

// Mock function to get user payment history
export const getUserPaymentHistory = async (userId: string): Promise<Payment[]> => {
  // Mock data
  return [
    {
      id: 'payment-1',
      userId,
      bookingId: 'booking-1',
      amount: 1500,
      currency: 'GBP',
      status: 'completed',
      paymentMethod: 'credit_card',
      method: 'credit_card', // Added for backwards compatibility
      transactionId: 'txn_123456', // Added transaction ID
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
    bookingId: paymentData.bookingId,
    amount: paymentData.amount,
    currency: paymentData.currency || 'GBP',
    status: 'pending',
    paymentMethod: paymentData.paymentMethod,
    method: paymentData.paymentMethod, // For backwards compatibility
    transactionId: `txn_${Date.now()}`, // Generate mock transaction ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: paymentData.description
  };
};

// Add the refundPayment function
export const refundPayment = async (refundData: RefundPaymentDto): Promise<Payment> => {
  // Mock implementation
  return {
    id: `refund-${Date.now()}`,
    userId: 'user-1',
    bookingId: 'booking-1',
    amount: refundData.amount,
    currency: 'GBP',
    status: 'refunded',
    paymentMethod: 'credit_card',
    method: 'credit_card',
    transactionId: `ref_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: `Refund: ${refundData.reason}`
  };
};

// Other payment related functions
export const getPaymentById = async (paymentId: string): Promise<Payment> => {
  // Mock implementation
  return {
    id: paymentId,
    userId: 'user-1',
    bookingId: 'booking-1',
    amount: 1500,
    currency: 'GBP',
    status: 'completed',
    paymentMethod: 'credit_card',
    method: 'credit_card',
    transactionId: 'txn_123456',
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-01-15T12:00:00Z',
    description: 'Rent payment'
  };
};
