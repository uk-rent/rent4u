
import { supabase } from '@/integrations/supabase/client';
import { 
  SubscriptionPlan, 
  Subscription, 
  SubscriptionStatus, 
  SubscriptionInterval 
} from '@/types/subscription.types';
import { ApiError } from '@/types/api.types';

/**
 * Obtiene todos los planes de suscripción disponibles
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('price', { ascending: true });

  if (error) {
    throw new ApiError(
      'Error al obtener planes de suscripción', 
      'SUBSCRIPTION_PLANS_ERROR', 
      500, 
      error
    );
  }

  return data as SubscriptionPlan[];
};

/**
 * Obtiene un plan de suscripción por su ID
 */
export const getSubscriptionPlanById = async (planId: string): Promise<SubscriptionPlan> => {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single();

  if (error) {
    throw new ApiError(
      'Plan de suscripción no encontrado', 
      'SUBSCRIPTION_PLAN_NOT_FOUND', 
      404, 
      error
    );
  }

  return data as SubscriptionPlan;
};

/**
 * Obtiene la suscripción activa de un usuario
 */
export const getActiveSubscription = async (userId: string): Promise<Subscription | null> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, plan_id(*)') // Incluye detalles del plan
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No se encontró ninguna suscripción activa
      return null;
    }
    throw new ApiError(
      'Error al obtener la suscripción activa', 
      'ACTIVE_SUBSCRIPTION_ERROR', 
      500, 
      error
    );
  }

  return data as unknown as Subscription;
};

/**
 * Obtiene todas las suscripciones de un usuario
 */
export const getUserSubscriptions = async (userId: string): Promise<Subscription[]> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, plan_id(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new ApiError(
      'Error al obtener las suscripciones del usuario', 
      'USER_SUBSCRIPTIONS_ERROR', 
      500, 
      error
    );
  }

  return data as unknown as Subscription[];
};

/**
 * Crea una nueva suscripción (para el plan gratuito o para probar sin pago inicial)
 */
export const createSubscription = async (
  userId: string,
  planId: string,
  status: SubscriptionStatus = 'active',
  periodStart: Date = new Date(),
  periodEnd?: Date
): Promise<Subscription> => {
  // Calcula la fecha de fin si no se proporciona
  const endDate = periodEnd || new Date(periodStart);
  
  // Obtén el plan para calcular la duración correcta
  const plan = await getSubscriptionPlanById(planId);
  
  // Para planes mensuales, suma 30 días, para anuales 365
  if (!periodEnd) {
    if (plan.interval === 'month') {
      endDate.setDate(endDate.getDate() + 30);
    } else if (plan.interval === 'year') {
      endDate.setDate(endDate.getDate() + 365);
    }
  }
  
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      status,
      current_period_start: periodStart.toISOString(),
      current_period_end: endDate.toISOString()
    })
    .select('*, plan_id(*)')
    .single();

  if (error) {
    throw new ApiError(
      'Error al crear la suscripción', 
      'CREATE_SUBSCRIPTION_ERROR', 
      500, 
      error
    );
  }

  return data as unknown as Subscription;
};

/**
 * Actualiza el estado de una suscripción
 */
export const updateSubscriptionStatus = async (
  subscriptionId: string,
  status: SubscriptionStatus,
  cancelAtPeriodEnd: boolean = false
): Promise<Subscription> => {
  const updateData: any = { status };
  
  if (cancelAtPeriodEnd) {
    updateData.cancel_at_period_end = true;
  }
  
  if (status === 'canceled') {
    updateData.canceled_at = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('id', subscriptionId)
    .select('*, plan_id(*)')
    .single();

  if (error) {
    throw new ApiError(
      'Error al actualizar la suscripción', 
      'UPDATE_SUBSCRIPTION_ERROR', 
      500, 
      error
    );
  }

  return data as unknown as Subscription;
};

/**
 * Verifica si el usuario ha alcanzado los límites de su plan
 */
export const checkSubscriptionLimits = async (
  userId: string,
  checkType: 'properties' | 'featured'
): Promise<{
  hasReachedLimit: boolean;
  limit: number | null;
  current: number;
}> => {
  // Obtener la suscripción activa del usuario
  const subscription = await getActiveSubscription(userId);
  
  if (!subscription || !subscription.plan_id) {
    throw new ApiError(
      'Usuario sin suscripción activa', 
      'NO_ACTIVE_SUBSCRIPTION', 
      403
    );
  }
  
  const plan = subscription.plan_id as unknown as SubscriptionPlan;
  
  // Obtener el recuento actual de propiedades o destacados
  const { count, error } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq(checkType === 'featured' ? 'is_featured' : 'status', checkType === 'featured' ? true : 'published');
  
  if (error) {
    throw new ApiError(
      'Error al verificar los límites de suscripción', 
      'SUBSCRIPTION_LIMITS_ERROR', 
      500, 
      error
    );
  }
  
  // Determinar el límite según el tipo de verificación
  const limit = checkType === 'properties' ? plan.max_listings : plan.max_featured_listings;
  
  // Si el límite es null, significa ilimitado
  const hasReachedLimit = limit !== null && count >= limit;
  
  return {
    hasReachedLimit,
    limit,
    current: count || 0
  };
};
