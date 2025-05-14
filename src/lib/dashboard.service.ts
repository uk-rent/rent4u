
import { DashboardStats, BookingStats, RevenueStats, PropertyStats } from '@/types/dashboard.types';
import { supabase } from '@/integrations/supabase/client';

const mockDashboardStats: DashboardStats = {
  totalProperties: 12,
  activeListings: 8,
  totalBookings: 36,
  activeBookings: 14,
  totalRevenue: 24500,
  monthlyRevenue: 3500,
  averageRating: 4.7,
  totalReviews: 28
};

const mockBookingStats: BookingStats = {
  total: 36,
  pending: 5,
  confirmed: 14,
  completed: 12,
  cancelled: 5
};

const mockRevenueStats: RevenueStats = {
  total: 24500,
  monthly: 3500,
  yearly: 42000,
  byProperty: [
    { propertyId: '1', propertyName: 'Apartment 1A', revenue: 5000 },
    { propertyId: '2', propertyName: 'Villa Sunset', revenue: 8000 },
    { propertyId: '3', propertyName: 'Cozy Studio', revenue: 3500 },
    { propertyId: '4', propertyName: 'Family House', revenue: 6000 }
  ]
};

const mockPropertyStats: PropertyStats = {
  total: 12,
  active: 8,
  pending: 2,
  byType: [
    { type: 'apartment', count: 5 },
    { type: 'house', count: 3 },
    { type: 'room', count: 2 },
    { type: 'commercial', count: 1 },
    { type: 'studio', count: 1 }
  ]
};

export const getDashboardStats = async (userId: string, timeRange: 'week' | 'month' | 'year'): Promise<DashboardStats> => {
  // In a real implementation, you would fetch this from Supabase
  return mockDashboardStats;
};

export const getBookingStats = async (userId: string, timeRange: 'week' | 'month' | 'year'): Promise<BookingStats> => {
  // In a real implementation, you would fetch this from Supabase
  return mockBookingStats;
};

export const getRevenueStats = async (userId: string, timeRange: 'week' | 'month' | 'year'): Promise<RevenueStats> => {
  // In a real implementation, you would fetch this from Supabase
  return mockRevenueStats;
};

export const getPropertyStats = async (userId: string, timeRange: 'week' | 'month' | 'year'): Promise<PropertyStats> => {
  // In a real implementation, you would fetch this from Supabase
  return mockPropertyStats;
};

// Function to get revenue data for the chart
export const getRevenueChartData = async (userId: string, timeRange: 'week' | 'month' | 'year') => {
  const endDate = new Date();
  let startDate = new Date();
  
  // Adjust the start date based on time range
  if (timeRange === 'week') {
    startDate.setDate(endDate.getDate() - 7);
  } else if (timeRange === 'month') {
    startDate.setMonth(endDate.getMonth() - 1);
  } else {
    startDate.setFullYear(endDate.getFullYear() - 1);
  }
  
  // Generate sample data
  const data = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const date = currentDate.toISOString().split('T')[0];
    data.push({
      date: timeRange === 'year' 
        ? new Date(currentDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : new Date(currentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 500) + 100
    });
    
    if (timeRange === 'year') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  return data;
};
