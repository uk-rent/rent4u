
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription.types';
import { getSubscriptionPlans, getActiveSubscription } from '@/lib/subscription.service';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlansProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  currentPlanId?: string;
}

export function SubscriptionPlans({ onSelectPlan, currentPlanId }: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [activePlan, setActivePlan] = useState<string | undefined>(currentPlanId);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Cargar planes de suscripción
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const fetchedPlans = await getSubscriptionPlans();
        setPlans(fetchedPlans);
        
        // Si no se proporcionó un plan activo, intentar obtenerlo
        if (!currentPlanId && user) {
          const activeSubscription = await getActiveSubscription(user.id);
          if (activeSubscription) {
            setActivePlan(activeSubscription.plan_id as unknown as string);
          }
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los planes de suscripción',
          variant: 'destructive'
        });
        console.error('Error loading subscription plans:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPlans();
  }, [user, currentPlanId, toast]);

  // Función para formatear precio
  const formatPrice = (price: number, interval: string) => {
    if (price === 0) return 'Gratis';
    
    // Formato de precio según intervalo
    if (interval === 'month') {
      return `$${price.toFixed(2)}/mes`;
    } else if (interval === 'year') {
      return `$${price.toFixed(2)}/año`;
    }
    
    return `$${price.toFixed(2)}`;
  };

  // Función para verificar si un plan es el activo
  const isPlanActive = (planId: string) => {
    return activePlan === planId;
  };

  if (loading) {
    return (
      <div className="w-full text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-500">Cargando planes disponibles...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className={`flex flex-col ${isPlanActive(plan.id) ? 'border-primary shadow-md' : ''}`}
        >
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{plan.name}</CardTitle>
              {isPlanActive(plan.id) && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                  Actual
                </Badge>
              )}
            </div>
            <CardDescription>
              {plan.interval === 'free' ? 'Plan básico sin costos' : 'Amplía tus posibilidades'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-4">
              <span className="text-3xl font-bold">
                {formatPrice(plan.price, plan.interval)}
              </span>
            </div>
            
            <ul className="space-y-2 mb-6">
              {/* Anuncios incluidos */}
              <li className="flex items-center">
                {plan.max_listings === null ? (
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <span className="font-medium mr-2">{plan.max_listings}×</span>
                )}
                <span>
                  {plan.max_listings === null ? 'Anuncios ilimitados' : 
                   plan.max_listings === 1 ? 'Anuncio incluido' : 'Anuncios incluidos'}
                </span>
              </li>
              
              {/* Anuncios destacados */}
              <li className="flex items-center">
                {plan.max_featured_listings > 0 ? (
                  <>
                    <span className="font-medium mr-2">{plan.max_featured_listings}×</span>
                    <span>
                      {plan.max_featured_listings === 1 ? 
                        'Anuncio destacado' : 'Anuncios destacados'}
                    </span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-gray-500">Sin anuncios destacados</span>
                  </>
                )}
              </li>
              
              {/* Prioridad de listado */}
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>
                  Prioridad {
                    plan.features?.listingPriority === 'premium' ? 'premium' :
                    plan.features?.listingPriority === 'priority' ? 'alta' : 'estándar'
                  }
                </span>
              </li>
              
              {/* Duración de anuncio */}
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Duración: {plan.listing_duration} días por anuncio</span>
              </li>
              
              {/* Estadísticas */}
              <li className="flex items-center">
                {plan.features?.analytics !== 'none' ? (
                  <>
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>
                      Estadísticas {
                        plan.features?.analytics === 'advanced' ? 'avanzadas' : 'básicas'
                      }
                    </span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-gray-500">Sin estadísticas</span>
                  </>
                )}
              </li>
              
              {/* Herramientas de marketing */}
              <li className="flex items-center">
                {plan.features?.marketingTools ? (
                  <>
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Herramientas de marketing</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-gray-500">Sin herramientas de marketing</span>
                  </>
                )}
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant={isPlanActive(plan.id) ? "outline" : "default"}
              disabled={isPlanActive(plan.id)}
              onClick={() => onSelectPlan(plan)}
            >
              {isPlanActive(plan.id) ? 'Plan actual' : 
               plan.price > 0 ? 'Seleccionar plan' : 'Comenzar gratis'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
