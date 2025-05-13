import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile as UserProfileType } from '@/types/user.types';
import { formatDate } from '@/lib/utils';

export function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Aquí iría la llamada a la API para obtener el perfil
        // const response = await api.getUserProfile(user.id);
        // setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback>
              {profile.firstName[0]}{profile.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-500">{profile.email}</p>
            <Badge variant="outline" className="mt-2">
              {profile.role}
            </Badge>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {profile.phone && (
            <div>
              <h3 className="font-medium">Phone</h3>
              <p className="text-gray-600">{profile.phone}</p>
            </div>
          )}

          {profile.bio && (
            <div>
              <h3 className="font-medium">Bio</h3>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          )}

          <div>
            <h3 className="font-medium">Member Since</h3>
            <p className="text-gray-600">{formatDate(profile.createdAt)}</p>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="outline" asChild>
            <a href="/profile/edit">Edit Profile</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 