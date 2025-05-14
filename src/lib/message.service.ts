
import { Message, Conversation } from '@/types/message.types';
import { supabase } from '@/integrations/supabase/client';

const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: ['user1', 'user2'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Property Inquiry'
  },
  {
    id: '2',
    participants: ['user1', 'user3'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Booking Discussion'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    conversation_id: '1',
    sender_id: 'user1',
    content: 'Hello, I am interested in your property.',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    conversation_id: '1',
    sender_id: 'user2',
    content: 'Thank you for your interest! What would you like to know?',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    conversation_id: '2',
    sender_id: 'user3',
    content: 'Is the property still available for next week?',
    created_at: new Date().toISOString()
  }
];

export const getConversations = async (userId: string): Promise<Conversation[]> => {
  // In a real implementation, you would fetch this from Supabase
  return mockConversations;
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  // In a real implementation, you would fetch this from Supabase
  return mockMessages.filter(message => message.conversation_id === conversationId);
};

export const sendMessage = async (message: Omit<Message, 'id' | 'created_at'>): Promise<Message> => {
  // In a real implementation, you would send this to Supabase
  const newMessage: Message = {
    ...message,
    id: Math.random().toString(36).substring(2, 15),
    created_at: new Date().toISOString()
  };
  return newMessage;
};
