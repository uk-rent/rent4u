
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
  Legend,
} from 'recharts';
import { getPropertyStats } from '@/lib/dashboard.service';

interface PropertyStatsProps {
  timeRange: 'week' | 'month' | 'year';
}

export function PropertyStats({ timeRange }: PropertyStatsProps) {
  const { user } = useAuth();
  const [propertyTypeData, setPropertyTypeData] = useState<{ type: string; count: number }[]>([]);
  const [revenueData, setRevenueData] = useState<{ property: string; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropertyData();
  }, [timeRange]);

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      // Mock property type data
      const mockPropertyTypes = [
        { type: 'Apartment', count: 4 },
        { type: 'House', count: 2 },
        { type: 'Villa', count: 1 },
        { type: 'Studio', count: 3 },
        { type: 'Room', count: 2 },
      ];
      
      // Mock revenue data by property
      const mockRevenueByProperty = [
        { property: 'Seaside Apartment', revenue: 5200 },
        { property: 'Downtown Loft', revenue: 4800 },
        { property: 'Mountain Cabin', revenue: 3600 },
        { property: 'City Studio', revenue: 2900 },
        { property: 'Beach House', revenue: 7500 },
      ];
      
      setPropertyTypeData(mockPropertyTypes);
      setRevenueData(mockRevenueByProperty);
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
              <BarChart data={propertyTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="type"
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
                  formatter={(value: number) => [`${value}`, 'Properties']}
                  labelFormatter={(value: string) => `Type: ${value}`}
                />
                <Bar
                  dataKey="count"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
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
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  labelFormatter={(value: string) => `Property: ${value}`}
                />
                <Bar
                  dataKey="revenue"
                  fill="#10b981"
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
