import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Review, ReviewStats } from '@/types/review.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Star } from 'lucide-react';

interface ReviewListProps {
  propertyId: string;
  showStats?: boolean;
}

export function ReviewList({
  propertyId,
  showStats = true,
}: ReviewListProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    if (showStats) {
      fetchStats();
    }
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users!reviews_user_id_fkey(
            id,
            first_name,
            last_name,
            avatar
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('property_id', propertyId);

      if (error) throw error;

      const ratings = data.map((review) => review.rating);
      const averageRating =
        ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

      const distribution = ratings.reduce(
        (acc, rating) => {
          acc[rating] = (acc[rating] || 0) + 1;
          return acc;
        },
        {} as { [key: number]: number }
      );

      setStats({
        averageRating,
        totalReviews: ratings.length,
        ratingDistribution: distribution,
      });
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
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
    <div className="space-y-6">
      {/* Review Stats */}
      {showStats && stats && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">
                  {stats.averageRating.toFixed(1)}
                </h3>
                <div className="flex items-center space-x-2">
                  {renderStars(Math.round(stats.averageRating))}
                  <span className="text-sm text-muted-foreground">
                    ({stats.totalReviews} reviews)
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm w-8">{rating} stars</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-yellow-400 rounded-full"
                        style={{
                          width: `${
                            ((stats.ratingDistribution[rating] || 0) /
                              stats.totalReviews) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm w-8">
                      {stats.ratingDistribution[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={review.user?.avatar}
                      alt={`${review.user?.first_name} ${review.user?.last_name}`}
                    />
                    <AvatarFallback>
                      {review.user?.first_name?.[0]}
                      {review.user?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {review.user?.first_name} {review.user?.last_name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(review.created_at), 'PPP')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    {review.response && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium mb-2">Owner's Response</h5>
                        <p className="text-gray-600">{review.response}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                No reviews yet
              </h3>
              <p className="mt-2 text-gray-500">
                Be the first to review this property
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 