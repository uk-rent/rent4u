import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Payment } from '@/types/payment.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface RefundFormProps {
  payment: Payment;
  onSuccess?: () => void;
}

export function RefundForm({ payment, onSuccess }: RefundFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: payment.amount,
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to process a refund',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Create refund intent
      const { data: refundIntent, error: intentError } = await supabase
        .functions.invoke('create-refund-intent', {
          body: {
            payment_id: payment.id,
            amount: formData.amount,
            reason: formData.reason,
          },
        });

      if (intentError) throw intentError;

      // Update payment status
      const { error: updateError } = await supabase
        .from('payments')
        .update({ status: 'refunded' })
        .eq('id', payment.id);

      if (updateError) throw updateError;

      // Create refund record
      const { error: refundError } = await supabase
        .from('refunds')
        .insert([
          {
            payment_id: payment.id,
            amount: formData.amount,
            reason: formData.reason,
            status: 'completed',
            processed_by: user.id,
          },
        ]);

      if (refundError) throw refundError;

      toast({
        title: 'Refund Successful',
        description: 'The refund has been processed successfully',
      });

      onSuccess?.();
      navigate(`/payments/${payment.id}`);
    } catch (error) {
      toast({
        title: 'Refund Failed',
        description: error instanceof Error ? error.message : 'Failed to process refund',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Refund</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Payment Details</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Original Amount:</span>
                <span>
                  {payment.currency} {payment.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="capitalize">
                  {payment.method.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-mono">{payment.transactionId}</span>
              </div>
            </div>
          </div>

          {/* Refund Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Refund Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              max={payment.amount}
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: parseFloat(e.target.value),
                })
              }
              required
            />
            <p className="text-sm text-gray-500">
              Maximum refund amount: {payment.currency} {payment.amount}
            </p>
          </div>

          {/* Refund Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Refund</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              placeholder="Please provide a reason for the refund"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || formData.amount <= 0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Refund...
              </>
            ) : (
              `Refund ${payment.currency} ${formData.amount}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 