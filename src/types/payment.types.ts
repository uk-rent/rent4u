
export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded' | 'cancelled';

export interface Payment {
  id: string;
  bookingId: string;
  transactionId: string;
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  refundedPaymentId?: string;
  refundReason?: string;
}

export interface CreatePaymentDto {
  bookingId: string;
  userId: string;
  amount: number;
  currency?: string;
  method: PaymentMethod;
}

export interface RefundPaymentDto {
  paymentId: string;
  amount: number;
  reason: string;
}
