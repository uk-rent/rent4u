
import { Json } from '@/integrations/supabase/types';
import { SubscriptionPlan, Subscription, SubscriptionPayment } from '@/types/subscription.types';

/**
 * Maps a Supabase subscription plan database record to our application's SubscriptionPlan type
 */
export function mapDbPlanToSubscriptionPlan(dbPlan: any): SubscriptionPlan {
  return {
    id: dbPlan.id,
    name: dbPlan.name,
    price: dbPlan.price,
    currency: dbPlan.currency || 'USD',
    interval: dbPlan.interval,
    max_listings: dbPlan.max_listings,
    max_featured_listings: dbPlan.max_featured_listings,
    features: dbPlan.features || {
      listingsIncluded: 0,
      featuredIncluded: 0,
      listingPriority: 'standard',
      analytics: 'none', 
      marketingTools: false
    },
    listing_duration: dbPlan.listing_duration,
    stripe_price_id: dbPlan.stripe_price_id,
    paypal_plan_id: dbPlan.paypal_plan_id,
    created_at: dbPlan.created_at,
    updated_at: dbPlan.updated_at
  };
}

/**
 * Maps a Supabase subscription database record to our application's Subscription type
 */
export function mapDbSubscriptionToSubscription(dbSubscription: any): Subscription {
  return {
    id: dbSubscription.id,
    user_id: dbSubscription.user_id,
    plan_id: dbSubscription.plan_id,
    status: dbSubscription.status,
    stripe_subscription_id: dbSubscription.stripe_subscription_id,
    paypal_subscription_id: dbSubscription.paypal_subscription_id,
    current_period_start: dbSubscription.current_period_start,
    current_period_end: dbSubscription.current_period_end,
    canceled_at: dbSubscription.canceled_at,
    cancel_at_period_end: dbSubscription.cancel_at_period_end || false,
    trial_start: dbSubscription.trial_start,
    trial_end: dbSubscription.trial_end,
    created_at: dbSubscription.created_at,
    updated_at: dbSubscription.updated_at
  };
}

/**
 * Maps a Supabase subscription payment database record to our application's SubscriptionPayment type
 */
export function mapDbPaymentToSubscriptionPayment(dbPayment: any): SubscriptionPayment {
  return {
    id: dbPayment.id,
    user_id: dbPayment.user_id,
    subscription_id: dbPayment.subscription_id,
    amount: dbPayment.amount,
    currency: dbPayment.currency || 'USD',
    status: dbPayment.status,
    payment_method: dbPayment.payment_method,
    transaction_id: dbPayment.transaction_id,
    invoice_id: dbPayment.invoice_id,
    created_at: dbPayment.created_at,
    updated_at: dbPayment.updated_at
  };
}
