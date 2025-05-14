
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
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
import { getBookingStats } from '@/lib/dashboard.service';

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
      
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      // In a real implementation, you would fetch booking data from Supabase
      // For now, we'll create some mock data
      const endDate = new Date();
      let startDate = new Date();
      
      if (timeRange === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (timeRange === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
      } else {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }
      
      const mockData: BookingData[] = [];
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        mockData.push({
          date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          bookings: Math.floor(Math.random() * 5),
          cancellations: Math.floor(Math.random() * 2),
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setData(mockData);
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
        <BarChart data={data.slice(-7)}>
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
