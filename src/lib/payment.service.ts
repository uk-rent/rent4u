
import { 
  Payment, 
  PaymentMethod, 
  PaymentStatus,
  CreatePaymentDto,
  RefundPaymentDto
} from '@/types/payment.types';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for payments (would be Supabase in production)
const mockPayments: Payment[] = [
  {
    id: '1',
    bookingId: 'booking-1',
    amount: 500,
    currency: 'USD',
    status: 'completed',
    method: 'credit_card',
    transactionId: 'txn_123456',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentDetails: {
      cardLast4: '4242',
      cardBrand: 'Visa',
    },
  },
  {
    id: '2',
    bookingId: 'booking-2',
    amount: 750,
    currency: 'USD',
    status: 'pending',
    method: 'bank_transfer',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    paymentDetails: {
      bankName: 'Example Bank',
      accountNumber: '****7890',
    },
  }
];

/**
 * Create a new payment
 */
export const createPayment = async (data: CreatePaymentDto): Promise<Payment> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newPayment: Payment = {
    id: uuidv4(),
    bookingId: data.bookingId,
    amount: data.amount,
    currency: data.currency,
    status: 'completed', // For demo, assume payment is successful
    method: data.method,
    transactionId: `txn_${Math.random().toString(36).substring(2, 10)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentDetails: {
      cardLast4: data.paymentDetails.cardNumber?.slice(-4),
      cardBrand: getCardBrand(data.paymentDetails.cardNumber || ''),
    }
  };
  
  // Add to mock database
  mockPayments.push(newPayment);
  
  return newPayment;
};

/**
 * Get payment history for a user
 */
export const getUserPaymentHistory = async (userId: string): Promise<Payment[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, we would filter by user ID
  return [...mockPayments];
};

/**
 * Get a single payment by ID
 */
export const getPaymentById = async (paymentId: string): Promise<Payment | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const payment = mockPayments.find(p => p.id === paymentId);
  return payment || null;
};

/**
 * Refund a payment
 */
export const refundPayment = async (data: RefundPaymentDto): Promise<Payment> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const paymentIndex = mockPayments.findIndex(p => p.id === data.paymentId);
  if (paymentIndex === -1) {
    throw new Error('Payment not found');
  }
  
  if (mockPayments[paymentIndex].status !== 'completed') {
    throw new Error('Only completed payments can be refunded');
  }
  
  // Update payment
  const updatedPayment = {
    ...mockPayments[paymentIndex],
    status: 'refunded' as PaymentStatus,
    refundAmount: data.amount,
    refundReason: data.reason,
    updatedAt: new Date().toISOString()
  };
  
  mockPayments[paymentIndex] = updatedPayment;
  
  return updatedPayment;
};

// Helper function to determine card brand from card number
function getCardBrand(cardNumber: string): string {
  if (cardNumber.startsWith('4')) return 'Visa';
  if (cardNumber.startsWith('5')) return 'Mastercard';
  if (cardNumber.startsWith('3')) return 'Amex';
  if (cardNumber.startsWith('6')) return 'Discover';
  return 'Unknown';
}
