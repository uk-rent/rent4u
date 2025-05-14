
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  room_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
  
  // Frontend properties
  propertyId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  totalAmount?: number;
  numberOfGuests?: number;
  specialRequests?: string;
  cancellationReason?: string;
  currency?: string;
  
  // Relations
  property?: any;
  tenant?: any;
}

export interface CreateBookingDto {
  propertyId: string;
  startDate: string;
  endDate: string;
  numberOfGuests?: number;
  specialRequests?: string;
  paymentMethod?: string; // Add this to fix the TS error
}

export interface BookingFilterOptions {
  status?: BookingStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  propertyId?: string;
  userId?: string;
}
