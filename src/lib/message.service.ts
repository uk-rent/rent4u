
import { Message, Conversation } from '@/types/message.types';
import { v4 as uuidv4 } from 'uuid';

const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: ['user1', 'user2'],
    lastMessage: {
      id: '2',
      conversation_id: '1',
      sender_id: 'user2',
      content: 'Thank you for your interest! What would you like to know?',
      created_at: new Date().toISOString(),
      read: true
    },
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Property Inquiry'
  },
  {
    id: '2',
    participants: ['user1', 'user3'],
    lastMessage: {
      id: '3',
      conversation_id: '2',
      sender_id: 'user3',
      content: 'Is the property still available for next week?',
      created_at: new Date(Date.now() - 43200000).toISOString(),
      read: false
    },
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    title: 'Booking Discussion'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    conversation_id: '1',
    sender_id: 'user1',
    content: 'Hello, I am interested in your property.',
    created_at: new Date(Date.now() - 90000000).toISOString(),
    read: true
  },
  {
    id: '2',
    conversation_id: '1',
    sender_id: 'user2',
    content: 'Thank you for your interest! What would you like to know?',
    created_at: new Date().toISOString(),
    read: true
  },
  {
    id: '3',
    conversation_id: '2',
    sender_id: 'user3',
    content: 'Is the property still available for next week?',
    created_at: new Date(Date.now() - 43200000).toISOString(),
    read: false
  }
];

export const getConversations = async (userId: string): Promise<Conversation[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filter conversations that include the user
  return mockConversations.filter(conv => 
    conv.participants.includes(userId)
  );
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockMessages.filter(message => message.conversation_id === conversationId);
};

export const sendMessage = async (message: Omit<Message, 'id' | 'created_at' | 'read'>): Promise<Message> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newMessage: Message = {
    ...message,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    read: false
  };
  
  // Add to mock messages
  mockMessages.push(newMessage);
  
  // Update the lastMessage in the conversation
  const conversationIndex = mockConversations.findIndex(c => c.id === message.conversation_id);
  if (conversationIndex !== -1) {
    mockConversations[conversationIndex].lastMessage = newMessage;
    mockConversations[conversationIndex].updated_at = newMessage.created_at;
  }
  
  return newMessage;
};

export const createConversation = async (
  participants: string[], 
  initialMessage: string, 
  title?: string
): Promise<Conversation> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const conversationId = uuidv4();
  const now = new Date().toISOString();
  
  // Create the first message
  const message: Message = {
    id: uuidv4(),
    conversation_id: conversationId,
    sender_id: participants[0],
    content: initialMessage,
    created_at: now,
    read: false
  };
  
  // Add message to mock messages
  mockMessages.push(message);
  
  // Create the conversation
  const conversation: Conversation = {
    id: conversationId,
    participants,
    lastMessage: message,
    created_at: now,
    updated_at: now,
    title: title || ''
  };
  
  // Add to mock conversations
  mockConversations.push(conversation);
  
  return conversation;
};
