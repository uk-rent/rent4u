
import { supabase } from '@/integrations/supabase/client';
import { 
  SubscriptionPlan, 
  Subscription, 
  SubscriptionStatus, 
  SubscriptionInterval,
  SubscriptionFeatures,
  ListingPriority,
  AnalyticsLevel
} from '@/types/subscription.types';
import { ApiError } from '@/types/api.types';
import { 
  mapDbPlanToSubscriptionPlan, 
  mapDbSubscriptionToSubscription 
} from '@/utils/subscription.mapper';

/**
 * Obtiene todos los planes de suscripción disponibles
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  // Since we don't have a subscription_plans table yet, let's use mock data
  try {
    // This would need to be replaced with actual Supabase query when the table exists
    console.warn('Using mock subscription plans - please set up the subscription_plans table');
    return [
      {
        id: 'free',
        name: 'Plan Gratuito',
        description: 'Para empezar a publicar propiedades',
        price: 0,
        currency: 'USD',
        interval: 'month',
        stripe_price_id: null,
        paypal_plan_id: null,
        features: {
          listingsIncluded: 3,
          featuredIncluded: 0,
          listingPriority: 'standard',
          analytics: 'none',
          marketingTools: false
        },
        max_listings: 3,
        max_featured_listings: 0,
        listing_duration: 30,
        active: true,
        trial_period_days: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {}
      },
      {
        id: 'basic',
        name: 'Plan Básico',
        description: 'Para propietarios independientes',
        price: 19.99,
        currency: 'USD',
        interval: 'month',
        stripe_price_id: null,
        paypal_plan_id: null,
        features: {
          listingsIncluded: 10,
          featuredIncluded: 2,
          listingPriority: 'standard',
          analytics: 'basic',
          marketingTools: false
        },
        max_listings: 10,
        max_featured_listings: 2,
        listing_duration: 60,
        active: true,
        trial_period_days: 7,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {}
      },
      {
        id: 'pro',
        name: 'Plan Profesional',
        description: 'Para agencias y profesionales',
        price: 49.99,
        currency: 'USD',
        interval: 'month',
        stripe_price_id: null,
        paypal_plan_id: null,
        features: {
          listingsIncluded: 50,
          featuredIncluded: 10,
          listingPriority: 'premium',
          analytics: 'advanced',
          marketingTools: true
        },
        max_listings: 50,
        max_featured_listings: 10,
        listing_duration: 90,
        active: true,
        trial_period_days: 14,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {}
      }
    ];
  } catch (error) {
    throw new ApiError(
      'Error al obtener planes de suscripción', 
      'SUBSCRIPTION_PLANS_ERROR', 
      500, 
      error as Error
    );
  }
};

/**
 * Obtiene un plan de suscripción por su ID
 */
export const getSubscriptionPlanById = async (planId: string): Promise<SubscriptionPlan> => {
  try {
    const plans = await getSubscriptionPlans();
    const plan = plans.find(p => p.id === planId);
    
    if (!plan) {
      throw new ApiError(
        'Plan de suscripción no encontrado', 
        'SUBSCRIPTION_PLAN_NOT_FOUND', 
        404
      );
    }
    
    return plan;
  } catch (error) {
    throw new ApiError(
      'Error al obtener plan de suscripción', 
      'SUBSCRIPTION_PLAN_ERROR', 
      500, 
      error as Error
    );
  }
};

/**
 * Obtiene la suscripción activa de un usuario
 */
export const getActiveSubscription = async (userId: string): Promise<Subscription | null> => {
  try {
    // For now, return a mock subscription since we don't have the table yet
    return {
      id: 'sub_123',
      user_id: userId,
      plan_id: 'basic',
      plan: await getSubscriptionPlanById('basic'),
      status: 'active',
      stripe_subscription_id: null,
      paypal_subscription_id: null,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
      cancel_at_period_end: false,
      canceled_at: null,
      trial_start: null,
      trial_end: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
};

/**
 * Obtiene todas las suscripciones de un usuario
 */
export const getUserSubscriptions = async (userId: string): Promise<Subscription[]> => {
  try {
    // Return mock data
    const activeSub = await getActiveSubscription(userId);
    return activeSub ? [activeSub] : [];
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    return [];
  }
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
  
  // Mock creating a subscription
  const newSubscription: Subscription = {
    id: `sub_${Date.now()}`,
    user_id: userId,
    plan_id: planId,
    plan,
    status,
    stripe_subscription_id: null,
    paypal_subscription_id: null,
    current_period_start: periodStart.toISOString(),
    current_period_end: endDate.toISOString(),
    cancel_at_period_end: false,
    canceled_at: null,
    trial_start: null,
    trial_end: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return newSubscription;
};

/**
 * Actualiza el estado de una suscripción
 */
export const updateSubscriptionStatus = async (
  subscriptionId: string,
  status: SubscriptionStatus,
  cancelAtPeriodEnd: boolean = false
): Promise<Subscription> => {
  try {
    // Mock updating a subscription
    const mockSub = await getActiveSubscription('user_123');
    if (!mockSub) {
      throw new Error('Subscription not found');
    }
    
    return {
      ...mockSub,
      status,
      cancel_at_period_end: cancelAtPeriodEnd,
      canceled_at: status === 'canceled' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    throw new ApiError(
      'Error al actualizar la suscripción', 
      'UPDATE_SUBSCRIPTION_ERROR', 
      500, 
      error as Error
    );
  }
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
  
  if (!subscription || !subscription.plan) {
    throw new ApiError(
      'Usuario sin suscripción activa', 
      'NO_ACTIVE_SUBSCRIPTION', 
      403
    );
  }
  
  const plan = subscription.plan;
  
  // Mock property count
  const propertyCount = checkType === 'featured' ? 1 : 5;
  
  // Determinar el límite según el tipo de verificación
  const limit = checkType === 'properties' ? plan.max_listings : plan.max_featured_listings;
  
  // Si el límite es null, significa ilimitado
  const hasReachedLimit = limit !== null && propertyCount >= limit;
  
  return {
    hasReachedLimit,
    limit,
    current: propertyCount
  };
};
