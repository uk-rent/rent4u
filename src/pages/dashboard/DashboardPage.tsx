
import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/ui/dashboard-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Property } from '@/types/property.types';
import { Subscription } from '@/types/subscription.types';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Building, PlusSquare, Heart } from 'lucide-react';
import { getProperties } from '@/lib/property.service';
import { getActiveSubscription } from '@/lib/subscription.service';

export default function DashboardPage() {
  const { user, userRole } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Cargar datos según el rol del usuario
        if (userRole === 'landlord') {
          // Cargar propiedades del propietario
          const propertiesResult = await getProperties({ userId: user.id, limit: 4 });
          setProperties(propertiesResult.data);

          // Cargar suscripción activa
          const activeSub = await getActiveSubscription(user.id);
          setSubscription(activeSub);
        } else if (userRole === 'tenant') {
          // Cargar propiedades guardadas del inquilino
          const savedResult = await getSavedProperties(user.id, { limit: 4 });
          setSavedProperties(savedResult.data);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, userRole]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">
              Bienvenido, {user?.profile?.first_name || 'Usuario'}
            </p>
          </div>

          {userRole === 'landlord' && (
            <Button asChild>
              <Link to="/dashboard/properties/new">
                <PlusSquare className="mr-2 h-4 w-4" />
                Publicar propiedad
              </Link>
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid place-items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {userRole === 'landlord' && (
              <>
                {/* Estado de la suscripción */}
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
                              {properties.length} / {subscription.plan?.max_listings === null ? '∞' : subscription.plan?.max_listings}
                            </p>
                          </div>
                          <div className="p-4 bg-primary/10 rounded-md">
                            <h3 className="font-medium">Destacados</h3>
                            <p className="text-xl">
                              {properties.filter(p => p.is_featured).length} / {subscription.plan?.max_featured_listings || 0}
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

                {/* Propiedades del propietario */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Tus propiedades</h2>
                    <Button variant="link" asChild>
                      <Link to="/dashboard/properties">
                        Ver todas <Building className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  {properties.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Building className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <h3 className="text-lg font-medium mb-2">No tienes propiedades publicadas</h3>
                        <p className="text-gray-500 mb-4">
                          Comienza a publicar tus propiedades para alquilar.
                        </p>
                        <Button asChild>
                          <Link to="/dashboard/properties/new">Publicar propiedad</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} showActions={false} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {userRole === 'tenant' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Propiedades guardadas</h2>
                  <Button variant="link" asChild>
                    <Link to="/dashboard/saved">
                      Ver todas <Heart className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {savedProperties.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Heart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">No tienes propiedades guardadas</h3>
                      <p className="text-gray-500 mb-4">
                        Guarda propiedades para revisarlas más tarde.
                      </p>
                      <Button asChild>
                        <Link to="/properties">Explorar propiedades</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {savedProperties.map((property) => (
                      <PropertyCard 
                        key={property.id} 
                        property={property} 
                        saved={true}
                        onSaveToggle={(id, saved) => {
                          // Implementar lógica de guardar/quitar favorito
                          console.log(`Toggle save for ${id}: ${saved}`);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardShell>
  );
}
