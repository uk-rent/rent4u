
import { v4 as uuidv4 } from 'uuid';
import { Payment, PaymentMethod, PaymentStatus, CreatePaymentDto, RefundPaymentDto } from '@/types/payment.types';
import { toast } from '@/components/ui/use-toast';

// Mock data for payments
const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    bookingId: 'booking-1',
    transactionId: 'txn_' + uuidv4().substring(0, 8),
    userId: 'user-1',
    amount: 1200,
    currency: 'USD',
    method: 'credit_card',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '2',
    bookingId: 'booking-2',
    transactionId: 'txn_' + uuidv4().substring(0, 8),
    userId: 'user-1',
    amount: 950,
    currency: 'USD',
    method: 'paypal',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '3',
    bookingId: 'booking-3',
    transactionId: 'txn_' + uuidv4().substring(0, 8),
    userId: 'user-2',
    amount: 1500,
    currency: 'USD',
    method: 'credit_card',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Get all payments, optionally filtered by user ID
 */
export const getPayments = async (userId?: string): Promise<Payment[]> => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredPayments = userId
        ? MOCK_PAYMENTS.filter(payment => payment.userId === userId)
        : MOCK_PAYMENTS;
      
      resolve([...filteredPayments]);
    }, 500);
  });
};

/**
 * Get a payment by ID
 */
export const getPaymentById = async (id: string): Promise<Payment> => {
  // Mock API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const payment = MOCK_PAYMENTS.find(p => p.id === id);
      
      if (payment) {
        resolve({ ...payment });
      } else {
        reject(new Error('Payment not found'));
      }
    }, 300);
  });
};

/**
 * Create a new payment
 */
export const createPayment = async (paymentData: CreatePaymentDto): Promise<Payment> => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPayment: Payment = {
        id: uuidv4(),
        bookingId: paymentData.bookingId,
        transactionId: 'txn_' + uuidv4().substring(0, 8),
        userId: paymentData.userId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'USD',
        method: paymentData.method,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // In a real implementation, we'd save this to the database
      MOCK_PAYMENTS.push(newPayment);
      
      resolve({ ...newPayment });
    }, 800);
  });
};

/**
 * Process a payment (change status from pending to completed)
 */
export const processPayment = async (id: string): Promise<Payment> => {
  // Mock API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const paymentIndex = MOCK_PAYMENTS.findIndex(p => p.id === id);
      
      if (paymentIndex === -1) {
        reject(new Error('Payment not found'));
        return;
      }
      
      const payment = MOCK_PAYMENTS[paymentIndex];
      
      if (payment.status !== 'pending') {
        reject(new Error('Payment cannot be processed - invalid status'));
        return;
      }
      
      const updatedPayment = {
        ...payment,
        status: 'completed' as PaymentStatus,
        updatedAt: new Date().toISOString()
      };
      
      MOCK_PAYMENTS[paymentIndex] = updatedPayment;
      
      resolve({ ...updatedPayment });
    }, 800);
  });
};

/**
 * Refund a payment
 */
export const refundPayment = async (refundData: RefundPaymentDto): Promise<Payment> => {
  // Mock API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const paymentIndex = MOCK_PAYMENTS.findIndex(p => p.id === refundData.paymentId);
      
      if (paymentIndex === -1) {
        reject(new Error('Payment not found'));
        return;
      }
      
      const payment = MOCK_PAYMENTS[paymentIndex];
      
      if (payment.status !== 'completed') {
        reject(new Error('Only completed payments can be refunded'));
        return;
      }
      
      if (refundData.amount > payment.amount) {
        reject(new Error('Refund amount cannot exceed original payment amount'));
        return;
      }
      
      const updatedPayment = {
        ...payment,
        status: refundData.amount === payment.amount ? 'refunded' : 'partially_refunded' as PaymentStatus,
        updatedAt: new Date().toISOString()
      };
      
      MOCK_PAYMENTS[paymentIndex] = updatedPayment;
      
      // Create a new refund transaction
      const refundTransaction: Payment = {
        id: uuidv4(),
        bookingId: payment.bookingId,
        transactionId: 'ref_' + uuidv4().substring(0, 8),
        userId: payment.userId,
        amount: -refundData.amount,  // Negative amount for refunds
        currency: payment.currency,
        method: payment.method,
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        refundedPaymentId: payment.id,
        refundReason: refundData.reason
      };
      
      MOCK_PAYMENTS.push(refundTransaction);
      
      resolve({ ...updatedPayment });
    }, 800);
  });
};

/**
 * Get payment statistics
 */
export const getPaymentStats = async (userId?: string): Promise<{
  totalRevenue: number;
  completedPayments: number;
  pendingPayments: number;
  refundedAmount: number;
}> => {
  const payments = await getPayments(userId);
  
  const stats = payments.reduce((acc, payment) => {
    if (payment.status === 'completed' || payment.status === 'partially_refunded') {
      acc.completedPayments++;
      acc.totalRevenue += payment.amount;
    } else if (payment.status === 'pending') {
      acc.pendingPayments++;
    } else if (payment.status === 'refunded' || payment.amount < 0) {
      acc.refundedAmount += Math.abs(payment.amount);
    }
    return acc;
  }, {
    totalRevenue: 0,
    completedPayments: 0,
    pendingPayments: 0,
    refundedAmount: 0
  });
  
  return stats;
};
