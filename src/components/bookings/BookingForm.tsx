import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Property } from '@/types/property.types';
import { CreateBookingDto } from '@/types/booking.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, differenceInDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface BookingFormProps {
  property: Property;
  onSuccess?: () => void;
}

export function BookingForm({ property, onSuccess }: BookingFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateBookingDto>({
    propertyId: property.id,
    startDate: '',
    endDate: '',
    paymentMethod: 'credit_card',
  });

  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const calculateTotalAmount = () => {
    if (!selectedDates.from || !selectedDates.to) return 0;
    const days = differenceInDays(selectedDates.to, selectedDates.from);
    return days * property.price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to make a booking',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!selectedDates.from || !selectedDates.to) {
      toast({
        title: 'Invalid Dates',
        description: 'Please select both check-in and check-out dates',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([
          {
            property_id: property.id,
            tenant_id: user.id,
            start_date: selectedDates.from.toISOString(),
            end_date: selectedDates.to.toISOString(),
            total_amount: calculateTotalAmount(),
            status: 'pending',
            payment_status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Booking Created',
        description: 'Your booking request has been submitted successfully',
      });

      onSuccess?.();
      navigate(`/bookings/${booking.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create booking',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book This Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Select Dates</Label>
            <Calendar
              mode="range"
              selected={{
                from: selectedDates.from,
                to: selectedDates.to,
              }}
              onSelect={(range) => {
                setSelectedDates({
                  from: range?.from,
                  to: range?.to,
                });
                if (range?.from) {
                  setFormData({
                    ...formData,
                    startDate: range.from.toISOString(),
                    endDate: range.to?.toISOString() || '',
                  });
                }
              }}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          {/* Booking Summary */}
          {selectedDates.from && selectedDates.to && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium">Booking Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>{format(selectedDates.from, 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span>{format(selectedDates.to, 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>
                    {differenceInDays(selectedDates.to, selectedDates.from)} days
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span>
                    {property.currency} {calculateTotalAmount()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              id="paymentMethod"
              value={formData.paymentMethod}
              onValueChange={(value) =>
                setFormData({ ...formData, paymentMethod: value })
              }
            >
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="paypal">PayPal</option>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !selectedDates.from || !selectedDates.to}
          >
            {loading ? 'Processing...' : 'Book Now'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
