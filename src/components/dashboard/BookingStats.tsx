import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays, subMonths, subYears } from 'date-fns';

interface BookingData {
  date: string;
  bookings: number;
  cancellations: number;
}

interface BookingStatsProps {
  timeRange: 'week' | 'month' | 'year';
}

export function BookingStats({ timeRange }: BookingStatsProps) {
  const { user } = useAuth();
  const [data, setData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingData();
  }, [timeRange]);

  const fetchBookingData = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      let startDate: Date;

      switch (timeRange) {
        case 'week':
          startDate = subDays(endDate, 7);
          break;
        case 'month':
          startDate = subMonths(endDate, 1);
          break;
        case 'year':
          startDate = subYears(endDate, 1);
          break;
        default:
          startDate = subMonths(endDate, 1);
      }

      const { data: bookingData, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process booking data
      const processedData = bookingData.reduce((acc: BookingData[], booking) => {
        const date = format(new Date(booking.created_at), 'MMM dd');
        const existingDate = acc.find(d => d.date === date);

        if (existingDate) {
          if (booking.status === 'cancelled') {
            existingDate.cancellations++;
          } else {
            existingDate.bookings++;
          }
        } else {
          acc.push({
            date,
            bookings: booking.status === 'cancelled' ? 0 : 1,
            cancellations: booking.status === 'cancelled' ? 1 : 0,
          });
        }

        return acc;
      }, []);

      setData(processedData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch booking statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              value,
              name === 'bookings' ? 'Bookings' : 'Cancellations',
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Bar
            dataKey="bookings"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="cancellations"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 