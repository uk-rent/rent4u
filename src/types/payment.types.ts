// Métodos de pago soportados
export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'paypal';

// Estados de pago
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Pago de suscripción
export interface SubscriptionPayment {
  id: string;
  subscription_id: string | null;
  user_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: PaymentMethod | null;
  transaction_id: string | null; // ID en el servicio de pago
  invoice_id: string | null;
  created_at: string;
}

// DTO para iniciar un pago
export interface InitiatePaymentDto {
  plan_id: string;
  payment_method: PaymentMethod;
  currency?: string;
  amount?: number; // Added this field as it's used in the payment service
  success_url?: string; // URL de redirección tras éxito
  cancel_url?: string;  // URL de redirección tras cancelación
}

// Respuesta de iniciación de pago
export interface PaymentInitiationResponse {
  success: boolean;
  payment_id?: string;
  checkout_url?: string; // URL de Stripe/PayPal para completar el pago
  status?: PaymentStatus;
  message?: string;
}

// Webhook de pago (estructura generalizada)
export interface PaymentWebhookData {
  event_type: string;
  payment_id?: string;
  subscription_id?: string;
  customer_id?: string;
  status?: PaymentStatus;
  amount?: number;
  currency?: string;
  metadata?: Record<string, any>;
  created_at?: number;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  // Campos adicionales
  refundAmount?: number;
  refundReason?: string;
  paymentDetails?: {
    cardLast4?: string;
    cardBrand?: string;
    bankName?: string;
    accountNumber?: string;
  };
}

export interface CreatePaymentDto {
  bookingId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  paymentDetails: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardholderName?: string;
    bankAccount?: string;
  };
}

export interface RefundPaymentDto {
  paymentId: string;
  amount: number;
  reason: string;
}
