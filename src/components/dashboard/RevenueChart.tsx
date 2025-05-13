import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays, subMonths, subYears, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';

interface RevenueData {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  timeRange: 'week' | 'month' | 'year';
}

export function RevenueChart({ timeRange }: RevenueChartProps) {
  const { user } = useAuth();
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      let startDate: Date;
      let interval: 'day' | 'month';

      switch (timeRange) {
        case 'week':
          startDate = subDays(endDate, 7);
          interval = 'day';
          break;
        case 'month':
          startDate = subMonths(endDate, 1);
          interval = 'day';
          break;
        case 'year':
          startDate = subYears(endDate, 1);
          interval = 'month';
          break;
        default:
          startDate = subMonths(endDate, 1);
          interval = 'day';
      }

      const { data: revenueData, error } = await supabase
        .from('revenue')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;

      // Generate all dates in the range
      const dates = interval === 'day'
        ? eachDayOfInterval({ start: startDate, end: endDate })
        : eachMonthOfInterval({ start: startDate, end: endDate });

      // Map revenue data to all dates
      const formattedData = dates.map(date => {
        const dateStr = format(date, interval === 'day' ? 'MMM dd' : 'MMM yyyy');
        const revenue = revenueData?.find(
          r => format(new Date(r.date), interval === 'day' ? 'MMM dd' : 'MMM yyyy') === dateStr
        )?.amount || 0;

        return {
          date: dateStr,
          revenue,
        };
      });

      setData(formattedData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch revenue data',
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
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                labelFormatter={(value: { date: string }) => value.date}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 