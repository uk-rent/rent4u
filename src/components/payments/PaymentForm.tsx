import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Payment, PaymentMethod, PaymentStatus } from '@/types/payment.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import {
  CreditCard,
  Banknote,
  CreditCardIcon,
  Loader2,
} from 'lucide-react';
import { createPayment } from '@/lib/payment.service';

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  currency: string;
  onSuccess?: (payment: Payment) => void;
}

interface CardDetails {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

export function PaymentForm({
  bookingId,
  amount,
  currency,
  onSuccess,
}: PaymentFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to make a payment',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Create a new payment using the mock service
      const newPayment: Payment = await createPayment({
        userId: user.id,
        bookingId,
        amount,
        currency,
        paymentMethod,
        description: `Payment for booking ${bookingId}`
      });

      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully',
      });

      onSuccess?.(newPayment);
      navigate(`/payments/${newPayment.id}`);
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Failed to process payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const processCreditCardPayment = async (
    clientSecret: string,
    cardDetails: CardDetails
  ) => {
    // Implement credit card processing logic here
    // This would typically involve integrating with Stripe or another payment processor
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const processBankTransfer = async (paymentIntentId: string) => {
    // Implement bank transfer logic here
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const processPayPalPayment = async (paymentIntentId: string) => {
    // Implement PayPal integration here
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Payment Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>
                  {currency} {amount}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label>Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="credit_card"
                  id="credit_card"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="credit_card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCard className="mb-3 h-6 w-6" />
                  Credit Card
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="bank_transfer"
                  id="bank_transfer"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="bank_transfer"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Banknote className="mb-3 h-6 w-6" />
                  Bank Transfer
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="paypal"
                  id="paypal"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="paypal"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCardIcon className="mb-3 h-6 w-6" />
                  PayPal
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Credit Card Details */}
          {paymentMethod === 'credit_card' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardDetails.number}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, number: e.target.value })
                  }
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    value={cardDetails.expiry}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, expiry: e.target.value })
                    }
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    value={cardDetails.cvc}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvc: e.target.value })
                    }
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input
                  id="cardName"
                  value={cardDetails.name}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, name: e.target.value })
                  }
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          )}

          {/* Bank Transfer Details */}
          {paymentMethod === 'bank_transfer' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Bank Account Details</h4>
                <div className="space-y-1 text-sm">
                  <p>Bank: Example Bank</p>
                  <p>Account Number: 1234567890</p>
                  <p>Routing Number: 987654321</p>
                  <p>Reference: {bookingId}</p>
                </div>
              </div>
            </div>
          )}

          {/* PayPal Button */}
          {paymentMethod === 'paypal' && (
            <div className="space-y-4">
              <Button
                type="button"
                className="w-full bg-[#0070ba] hover:bg-[#005ea6]"
                onClick={() => {
                  // Implement PayPal button logic
                }}
              >
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Pay with PayPal
              </Button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${currency} ${amount}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
