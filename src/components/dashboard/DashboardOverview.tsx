import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RevenueChart } from './RevenueChart';
import { BookingStats } from './BookingStats';
import { PropertyStats } from './PropertyStats';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import {
  DollarSign,
  Calendar,
  Home,
  Users,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  totalProperties: number;
  totalUsers: number;
  revenueChange: number;
  bookingsChange: number;
}

export function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .eq('user_id', user?.id)
        .eq('time_range', timeRange)
        .single();

      if (error) throw error;
      setStats(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    loading,
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: number;
    loading?: boolean;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-2" />
            ) : (
              <p className="text-2xl font-bold mt-2">{value}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        {change !== undefined && !loading && (
          <div className="flex items-center mt-4">
            {change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`text-sm ml-1 ${
                change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {Math.abs(change)}% from last {timeRange}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <Tabs
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as typeof timeRange)}
        >
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue.toLocaleString() || 0}`}
          icon={DollarSign}
          change={stats?.revenueChange}
          loading={loading}
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={Calendar}
          change={stats?.bookingsChange}
          loading={loading}
        />
        <StatCard
          title="Active Properties"
          value={stats?.totalProperties || 0}
          icon={Home}
          loading={loading}
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          loading={loading}
        />
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart timeRange={timeRange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingStats timeRange={timeRange} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyStats timeRange={timeRange} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
