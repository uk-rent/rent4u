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
  Legend,
} from 'recharts';
import { format, subDays, subMonths, subYears } from 'date-fns';

interface PropertyData {
  property: string;
  bookings: number;
  revenue: number;
  occupancy: number;
}

interface PropertyStatsProps {
  timeRange: 'week' | 'month' | 'year';
}

export function PropertyStats({ timeRange }: PropertyStatsProps) {
  const { user } = useAuth();
  const [data, setData] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropertyData();
  }, [timeRange]);

  const fetchPropertyData = async () => {
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

      const { data: propertyData, error } = await supabase
        .from('properties')
        .select(`
          *,
          bookings:bookings(*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process property data
      const processedData = propertyData.map(property => {
        const relevantBookings = property.bookings.filter(
          booking =>
            new Date(booking.created_at) >= startDate &&
            new Date(booking.created_at) <= endDate
        );

        const totalDays = Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const bookedDays = relevantBookings.reduce((total, booking) => {
          const start = new Date(booking.start_date);
          const end = new Date(booking.end_date);
          const days = Math.ceil(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
          );
          return total + days;
        }, 0);

        return {
          property: property.name,
          bookings: relevantBookings.length,
          revenue: property.price * bookedDays,
          occupancy: bookedDays / totalDays,
        };
      });

      setData(processedData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch property statistics',
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
    <Card>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="property"
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
                  labelFormatter={(value: number) => `Property: ${value}`}
                />
                <Bar
                  dataKey="bookings"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="revenue"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="occupancy"
                  fill="#82ca9d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 