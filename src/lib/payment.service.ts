
import { supabase } from '@/integrations/supabase/client';
import { 
  SubscriptionPayment, 
  PaymentMethod, 
  PaymentStatus,
  InitiatePaymentDto,
  PaymentInitiationResponse,
  PaymentWebhookData
} from '@/types/payment.types';
import { ApiError } from '@/types/api.types';
import { updateSubscriptionStatus } from './subscription.service';

/**
 * Iniciar un proceso de pago
 * 
 * Este es un método base que será extendido con la integración real de Stripe/PayPal
 */
export const initiatePayment = async (
  userId: string,
  paymentData: InitiatePaymentDto
): Promise<PaymentInitiationResponse> => {
  try {
    // Esta es una implementación simplificada
    // En una implementación real, aquí integraríamos con Stripe o PayPal
    
    // Registrar el pago pendiente en la base de datos
    const { data: payment, error } = await supabase
      .from('subscription_payments')
      .insert({
        user_id: userId,
        amount: paymentData.amount || 0,
        currency: paymentData.currency || 'USD',
        status: 'pending',
        payment_method: paymentData.payment_method
      })
      .select()
      .single();

    if (error) {
      console.error('Error registering payment:', error);
      throw new Error(`Error al registrar el pago: ${error.message}`);
    }

    // En una implementación real, aquí obtendríamos la URL de checkout de Stripe/PayPal
    return {
      success: true,
      payment_id: payment.id,
      checkout_url: 'https://example.com/checkout/dummy',
      status: 'pending'
    };
  } catch (error: any) {
    console.error('Error initiating payment:', error);
    return {
      success: false,
      message: `Error al iniciar el pago: ${error.message}`
    };
  }
};

/**
 * Registrar un pago en la base de datos
 */
export const recordPayment = async (
  paymentData: {
    subscription_id?: string;
    user_id: string;
    amount: number;
    currency?: string;
    status: PaymentStatus;
    payment_method: PaymentMethod;
    transaction_id?: string;
    invoice_id?: string;
  }
): Promise<SubscriptionPayment> => {
  const { data, error } = await supabase
    .from('subscription_payments')
    .insert({
      ...paymentData,
      currency: paymentData.currency || 'USD'
    })
    .select()
    .single();

  if (error) {
    console.error('Error recording payment:', error);
    throw new ApiError(
      'Error al registrar el pago en la base de datos',
      'RECORD_PAYMENT_ERROR',
      500,
      error
    );
  }

  return data as SubscriptionPayment;
};

/**
 * Actualizar el estado de un pago existente
 */
export const updatePaymentStatus = async (
  paymentId: string,
  status: PaymentStatus,
  transactionId?: string,
  invoiceId?: string
): Promise<SubscriptionPayment> => {
  const updateData: any = { status };
  
  if (transactionId) {
    updateData.transaction_id = transactionId;
  }
  
  if (invoiceId) {
    updateData.invoice_id = invoiceId;
  }
  
  const { data, error } = await supabase
    .from('subscription_payments')
    .update(updateData)
    .eq('id', paymentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment status:', error);
    throw new ApiError(
      'Error al actualizar el estado del pago',
      'UPDATE_PAYMENT_ERROR',
      500,
      error
    );
  }

  return data as SubscriptionPayment;
};

/**
 * Obtener el historial de pagos de un usuario
 */
export const getUserPaymentHistory = async (userId: string): Promise<SubscriptionPayment[]> => {
  const { data, error } = await supabase
    .from('subscription_payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payment history:', error);
    throw new ApiError(
      'Error al obtener el historial de pagos',
      'PAYMENT_HISTORY_ERROR',
      500,
      error
    );
  }

  return data as SubscriptionPayment[];
};

/**
 * Procesar un webhook de pago (Stripe/PayPal)
 * 
 * Esta es una función base que será implementada específicamente para cada proveedor de pagos
 */
export const processPaymentWebhook = async (data: PaymentWebhookData): Promise<void> => {
  // Implementación básica, para ser extendida con lógica específica de Stripe/PayPal
  
  // Verificar si es un evento de pago exitoso
  if (data.event_type.includes('payment.succeeded') && data.subscription_id) {
    // Actualizar el estado de la suscripción
    await updateSubscriptionStatus(data.subscription_id, 'active');
    
    // Registrar el pago exitoso si tenemos los detalles
    if (data.payment_id && data.amount && data.customer_id) {
      await updatePaymentStatus(
        data.payment_id,
        'succeeded'
      );
    }
  }
  
  // Verificar si es un evento de pago fallido
  if (data.event_type.includes('payment.failed') && data.subscription_id) {
    // Actualizar el estado de la suscripción
    await updateSubscriptionStatus(data.subscription_id, 'past_due');
    
    // Actualizar el estado del pago
    if (data.payment_id) {
      await updatePaymentStatus(
        data.payment_id,
        'failed'
      );
    }
  }
};
