
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Subscription } from '@/types/subscription.types';

interface SubscriptionCardProps {
  subscription: Subscription | null;
  propertiesCount: number;
  featuredPropertiesCount: number;
}

export function SubscriptionCard({ 
  subscription, 
  propertiesCount,
  featuredPropertiesCount
}: SubscriptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu suscripción</CardTitle>
        <CardDescription>
          Información sobre tu plan actual y límites
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscription ? (
          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="p-4 bg-primary/10 rounded-md">
                <h3 className="font-medium">Plan</h3>
                <p className="text-xl">{subscription.plan?.name || 'Plan'}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-md">
                <h3 className="font-medium">Anuncios</h3>
                <p className="text-xl">
                  {propertiesCount} / {subscription.plan?.max_listings === null ? '∞' : subscription.plan?.max_listings}
                </p>
              </div>
              <div className="p-4 bg-primary/10 rounded-md">
                <h3 className="font-medium">Destacados</h3>
                <p className="text-xl">
                  {featuredPropertiesCount} / {subscription.plan?.max_featured_listings || 0}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" asChild>
                <Link to="/dashboard/subscription">Gestionar suscripción</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="mb-4">No tienes una suscripción activa</p>
            <Button asChild>
              <Link to="/dashboard/subscription">Ver planes</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
