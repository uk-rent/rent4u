import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Payment, PaymentStatus } from '@/types/payment.types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PaymentHistoryProps {
  bookingId?: string;
  userId?: string;
}

export function PaymentHistory({
  bookingId,
  userId,
}: PaymentHistoryProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');

  useEffect(() => {
    fetchPayments();
  }, [bookingId, userId, statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('payments')
        .select(`
          *,
          booking:bookings(*)
        `)
        .order('created_at', { ascending: false });

      if (bookingId) {
        query = query.eq('booking_id', bookingId);
      }
      if (userId) {
        query = query.eq('user_id', userId);
      }
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch payment history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      case 'refunded':
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
      {/* Filters */}
      <div className="flex justify-end">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as PaymentStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments Table */}
      {payments.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {format(new Date(payment.createdAt), 'PPP')}
                </TableCell>
                <TableCell>
                  {payment.currency} {payment.amount}
                </TableCell>
                <TableCell className="capitalize">
                  {payment.method.replace('_', ' ')}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {payment.transactionId}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/payments/${payment.id}`)}
                    >
                      View
                    </Button>
                    {payment.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/payments/${payment.id}/refund`)}
                      >
                        Refund
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No payments found
            </h3>
            <p className="mt-2 text-gray-500">
              {statusFilter !== 'all'
                ? `No ${statusFilter} payments found`
                : 'No payment history available'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 