import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Booking, BookingStatus } from '@/types/booking.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface BookingListProps {
  filter?: {
    status?: BookingStatus;
    propertyId?: string;
    userId?: string;
  };
  showActions?: boolean;
}

export function BookingList({
  filter = {},
  showActions = true,
}: BookingListProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('bookings')
        .select(`
          *,
          property:properties(*),
          tenant:users!bookings_tenant_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filter.status) {
        query = query.eq('status', filter.status);
      }
      if (filter.propertyId) {
        query = query.eq('property_id', filter.propertyId);
      }
      if (filter.userId) {
        query = query.eq('tenant_id', filter.userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Booking status updated successfully',
      });

      fetchBookings();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update booking status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div
                    className="cursor-pointer hover:underline"
                    onClick={() => navigate(`/properties/${booking.propertyId}`)}
                  >
                    {booking.property?.title}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>From: {format(new Date(booking.startDate), 'PPP')}</div>
                    <div>To: {format(new Date(booking.endDate), 'PPP')}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {booking.currency} {booking.totalAmount}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}
                  >
                    {booking.paymentStatus}
                  </Badge>
                </TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                      >
                        View
                      </Button>
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(booking.id, 'confirmed')
                            }
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(booking.id, 'cancelled')
                            }
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No bookings found
            </h3>
            <p className="mt-2 text-gray-500">
              {filter.status
                ? `No ${filter.status} bookings found`
                : 'You have no bookings yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 