
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Review } from '@/types/review.types';
import { formatDate } from '@/lib/utils';

// Mock data for reviews since we're having issues with the database queries
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    propertyId: 'prop1',
    userId: 'user1',
    rating: 4,
    comment: 'Great property, very clean and convenient location.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: 'user1',
      name: 'John Doe',
      avatar: '/placeholder.svg'
    }
  },
  {
    id: '2',
    propertyId: 'prop1',
    userId: 'user2',
    rating: 5,
    comment: 'Excellent service and beautiful property.',
    response: 'Thank you for your kind review!',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 'user2',
      name: 'Jane Smith',
      avatar: '/placeholder.svg'
    }
  }
];

interface ReviewListProps {
  propertyId?: string;
  limit?: number;
}

export function ReviewList({ propertyId, limit = 5 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Using mock data for now
        setTimeout(() => {
          const filteredReviews = propertyId 
            ? MOCK_REVIEWS.filter(review => review.propertyId === propertyId)
            : MOCK_REVIEWS;
          
          setReviews(filteredReviews.slice(0, limit));
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
        setLoading(false);
      }
    };

    fetchReviews();
  }, [propertyId, limit]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="rounded-full bg-gray-200 w-10 h-10 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={review.user.avatar} alt={review.user.name} />
                <AvatarFallback>{review.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{review.user.name}</p>
                <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-3">
            <p>{review.comment}</p>
          </div>
          
          {review.response && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium">Owner's Response:</p>
              <p className="text-sm">{review.response}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
