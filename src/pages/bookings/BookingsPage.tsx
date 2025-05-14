
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BookingList } from '@/components/bookings/BookingList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBookings } from '@/hooks/useBookings';
import { BookingStatus } from '@/types/booking.types';

export default function BookingsPage() {
  const { user, userRole } = useAuth();
  const { fetchBookings, loading } = useBookings();
  const [activeTab, setActiveTab] = React.useState<BookingStatus | 'all'>('all');
  
  useEffect(() => {
    if (user) {
      fetchBookings({
        userId: user.id,
        status: activeTab !== 'all' ? activeTab : undefined
      });
    }
  }, [user, activeTab, fetchBookings]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BookingStatus | 'all')}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'all' ? 'All Bookings' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Bookings`}
              </CardTitle>
              <CardDescription>
                {activeTab === 'all' 
                  ? 'View all your property bookings'
                  : `View your ${activeTab} property bookings`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingList 
                filter={{
                  status: activeTab !== 'all' ? activeTab : undefined, 
                  userId: user?.id
                }} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
