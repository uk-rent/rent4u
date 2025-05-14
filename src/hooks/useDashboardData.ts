
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Property } from '@/types/property.types';
import { Subscription } from '@/types/subscription.types';
import { getProperties, getSavedProperties } from '@/lib/property.service';
import { getActiveSubscription } from '@/lib/subscription.service';
import { mapDbPropertyToProperty } from '@/utils/property.mapper';

interface DashboardData {
  properties: Property[];
  savedProperties: Property[];
  subscription: Subscription | null;
  loading: boolean;
}

export function useDashboardData(): DashboardData {
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

        // Load data based on user role
        if (userRole === 'landlord') {
          // Load owner properties
          const propertiesResult = await getProperties({ userId: user.id, limit: 4 });
          setProperties(propertiesResult.data.map(mapDbPropertyToProperty));

          // Load active subscription
          const activeSub = await getActiveSubscription(user.id);
          setSubscription(activeSub);
        } else if (userRole === 'tenant') {
          // Load tenant's saved properties
          const savedResult = await getSavedProperties(user.id);
          setSavedProperties(savedResult.data.map(mapDbPropertyToProperty));
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, userRole]);

  return {
    properties,
    savedProperties,
    subscription,
    loading
  };
}
