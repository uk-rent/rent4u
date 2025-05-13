import React, { createContext, useContext, ReactNode } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { Property, PropertyFilterOptions } from '@/types/property.types';

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  error: string | null;
  stats: any;
  filters: PropertyFilterOptions;
  updateFilters: (filters: PropertyFilterOptions) => void;
  resetFilters: () => void;
  refetch: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const propertyData = useProperties();

  return (
    <PropertyContext.Provider value={propertyData}>
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertyContext() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
} 