
import React from 'react';
import { DashboardShell } from '@/components/ui/dashboard-shell';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { PropertiesList } from '@/components/dashboard/PropertiesList';
import { SavedPropertiesList } from '@/components/dashboard/SavedPropertiesList';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function DashboardPage() {
  const { user, userRole } = useAuth();
  const { properties, savedProperties, subscription, loading } = useDashboardData();

  const featuredPropertiesCount = properties.filter(p => p.is_featured).length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <DashboardHeader firstName={user?.firstName} userRole={userRole} />

        {loading ? (
          <div className="grid place-items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {userRole === 'landlord' && (
              <>
                <SubscriptionCard
                  subscription={subscription}
                  propertiesCount={properties.length}
                  featuredPropertiesCount={featuredPropertiesCount}
                />

                <PropertiesList
                  properties={properties}
                  onFavoriteToggle={() => {}}
                />
              </>
            )}

            {userRole === 'tenant' && (
              <SavedPropertiesList
                savedProperties={savedProperties}
                onFavoriteToggle={() => {}}
              />
            )}
          </>
        )}
      </div>
    </DashboardShell>
  );
}
