
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Booking, BookingStatus } from '@/types/booking.types';
import { toast } from '@/components/ui/use-toast';

export function useBookings() {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = useCallback(async (filters?: {
    status?: BookingStatus | BookingStatus[];
    propertyId?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('bookings')
        .select(`
          *,
          property:properties(*)
        `)
        .order('created_at', { ascending: false });

      if (filters) {
        if (filters.status) {
          if (Array.isArray(filters.status)) {
            query = query.in('status', filters.status);
          } else {
            query = query.eq('status', filters.status);
          }
        }
        
        if (filters.propertyId) {
          query = query.eq('room_id', filters.propertyId);
        }
        
        if (filters.userId) {
          query = query.eq('tenant_id', filters.userId);
        }
        
        if (filters.startDate) {
          query = query.gte('start_date', filters.startDate);
        }
        
        if (filters.endDate) {
          query = query.lte('end_date', filters.endDate);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Format bookings to match our frontend format
      const formattedBookings: Booking[] = (data || []).map(booking => ({
        ...booking,
        propertyId: booking.room_id,
        userId: booking.tenant_id,
        startDate: booking.start_date,
        endDate: booking.end_date,
        totalAmount: booking.total_amount,
        currency: booking.property?.currency || "USD"
      }));
      
      setBookings(formattedBookings);
      return formattedBookings;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBookingStatus = useCallback(async (bookingId: string, status: BookingStatus) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Booking status updated to ${status}`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update booking status',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    bookings,
    fetchBookings,
    updateBookingStatus
  };
}
