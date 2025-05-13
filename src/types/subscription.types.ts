
// Intervalo de tiempo para la facturación
export type SubscriptionInterval = 'month' | 'year' | 'free';

// Estados de las suscripciones
export type SubscriptionStatus = 
  | 'active'             // Suscripción activa y pagada
  | 'trialing'           // En período de prueba
  | 'past_due'           // Pago vencido pero aún activa
  | 'canceled'           // Cancelada (ya no se renovará)
  | 'incomplete'         // Pago inicial fallido
  | 'incomplete_expired' // Pago inicial fallido y expirado
  | 'unpaid';            // Sin pago pero mantenida

// Niveles de prioridad para los listados
export type ListingPriority = 'standard' | 'priority' | 'premium';

// Niveles de analíticas
export type AnalyticsLevel = 'none' | 'basic' | 'advanced';

// Características de un plan de suscripción
export interface SubscriptionFeatures {
  listingsIncluded: number;      // Número de anuncios incluidos
  featuredIncluded: number;      // Número de destacados incluidos
  listingPriority: ListingPriority; // Prioridad en los listados
  analytics: AnalyticsLevel;     // Nivel de analíticas
  marketingTools: boolean;       // Acceso a herramientas de marketing
}

// Plan de suscripción
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: SubscriptionInterval;
  stripe_price_id: string | null;
  paypal_plan_id: string | null;
  features: SubscriptionFeatures;
  max_listings: number | null;   // null significa ilimitado
  max_featured_listings: number;
  listing_duration: number;      // Duración en días
  created_at: string;
  updated_at: string;
}

// Suscripción de un usuario
export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan?: SubscriptionPlan;       // Plan relacionado (para joins)
  status: SubscriptionStatus;
  stripe_subscription_id: string | null;
  paypal_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}
