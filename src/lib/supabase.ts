
// Mock Supabase client for reviews functionality

const mockData = {
  reviews: [
    {
      id: 'review-1',
      property_id: 'property-1',
      user_id: 'user-1',
      rating: 4,
      comment: 'Great property, would recommend!',
      created_at: '2023-03-15T10:00:00Z',
      updated_at: '2023-03-15T10:00:00Z',
      user: {
        id: 'user-1',
        first_name: 'John',
        last_name: 'Doe',
        avatar: '/placeholder.svg'
      }
    }
  ]
};

export const supabase = {
  from: (table: string) => {
    return {
      select: (query = '*') => {
        return {
          eq: (column: string, value: any) => {
            return {
              order: (column: string, { ascending = true } = {}) => {
                return {
                  data: mockData[table].filter(item => item[column] === value),
                  error: null
                };
              }
            };
          }
        };
      },
      insert: (data: any) => {
        return {
          select: () => {
            return {
              single: () => {
                const newItem = {
                  id: `review-${Date.now()}`,
                  ...data,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                mockData[table].push(newItem);
                return { data: newItem, error: null };
              }
            };
          }
        };
      }
    };
  },
  auth: {
    signOut: () => ({ error: null }),
    signInWithPassword: () => ({ error: null, data: {} }),
    signUp: () => ({ error: null, data: {} }),
    resetPasswordForEmail: () => ({ error: null }),
    updateUser: () => ({ error: null, data: {} }),
  }
};
