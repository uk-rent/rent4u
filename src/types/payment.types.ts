
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'paypal' | 'cash';

export interface PaymentDetails {
  cardType?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  billingAddress?: string;
  accountNumber?: string;
  bankName?: string;
}

export interface Payment {
  id: string;
  userId: string;
  bookingId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  method: string;     // Added method for backward compatibility
  transactionId?: string;
  paymentDetails?: PaymentDetails;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface CreatePaymentDto {
  userId: string;
  bookingId?: string;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  description?: string;
}

export interface UpdatePaymentDto {
  status?: PaymentStatus;
  description?: string;
}

export interface RefundPaymentDto {
  paymentId: string;
  amount: number;
  reason: string;
}
