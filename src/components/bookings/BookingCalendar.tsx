
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Booking } from '@/types/booking.types';
import { supabase } from '@/integrations/supabase/client';
import { format, isWithinInterval } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { mapDatabaseBookingToBooking } from '@/utils/booking.mapper';

interface BookingCalendarProps {
  propertyId: string;
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

export function BookingCalendar({
  propertyId,
  onDateSelect,
  selectedDate,
}: BookingCalendarProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [propertyId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('room_id', propertyId)
        .in('status', ['confirmed', 'pending']);

      if (error) throw error;
      
      if (data) {
        // Convert database format to our frontend Booking format
        const formattedBookings = data.map(mapDatabaseBookingToBooking);
        setBookings(formattedBookings);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch booking dates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isDateBooked = (date: Date) => {
    return bookings.some((booking) =>
      isWithinInterval(date, {
        start: new Date(booking.startDate || booking.start_date),
        end: new Date(booking.endDate || booking.end_date),
      })
    );
  };

  const disabledDays = (date: Date) => {
    return (
      date < new Date() || // Past dates
      isDateBooked(date) // Booked dates
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={disabledDays}
          className="rounded-md border"
        />
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-200 rounded"></div>
            <span className="text-sm text-gray-600">Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-sm text-gray-600">Past Dates</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
