
import { Booking } from '@/types/booking.types';

export function mapDatabaseBookingToBooking(dbBooking: any): Booking {
  return {
    ...dbBooking,
    propertyId: dbBooking.room_id || dbBooking.property_id,
    userId: dbBooking.tenant_id,
    startDate: dbBooking.start_date,
    endDate: dbBooking.end_date,
    totalAmount: dbBooking.total_amount,
    currency: dbBooking.property?.currency || "USD"
  };
}

export function mapBookingToDatabaseBooking(booking: Partial<Booking>): any {
  return {
    room_id: booking.propertyId,
    tenant_id: booking.userId,
    start_date: booking.startDate,
    end_date: booking.endDate,
    status: booking.status || 'pending',
    payment_status: booking.payment_status || 'pending',
    total_amount: booking.totalAmount
  };
}
