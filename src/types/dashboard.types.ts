export interface DashboardStats {
  totalProperties: number;
  activeListings: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export interface RevenueStats {
  total: number;
  monthly: number;
  yearly: number;
  byProperty: {
    propertyId: string;
    propertyName: string;
    revenue: number;
  }[];
}

export interface PropertyStats {
  total: number;
  active: number;
  pending: number;
  byType: {
    type: string;
    count: number;
  }[];
} 