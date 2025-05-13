export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
  // Campos adicionales
  numberOfGuests?: number;
  specialRequests?: string;
  cancellationReason?: string;
}

export interface CreateBookingDto {
  propertyId: string;
  startDate: string;
  endDate: string;
  numberOfGuests?: number;
  specialRequests?: string;
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