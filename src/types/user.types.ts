
export type UserRole = 'tenant' | 'landlord' | 'admin';

export interface UserProfile {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  avatar?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserWithProfile {
  id: string;
  email?: string;
  profile?: {
    id: string;
    first_name?: string;
    last_name?: string;
    role: UserRole;
    avatar_url?: string;
    phone?: string;
    created_at: string;
    updated_at: string;
  };
}
