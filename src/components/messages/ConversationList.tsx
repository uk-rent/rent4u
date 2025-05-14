
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation, Message } from '@/types/message.types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { SearchIcon } from 'lucide-react';
import { getConversations } from '@/lib/message.service';

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

export function ConversationList({
  onSelectConversation,
  selectedConversationId,
}: ConversationListProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConversations();
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const fetchedConversations = await getConversations(user.id);
      setConversations(fetchedConversations);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch conversations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getParticipantName = (participantId: string) => {
    // This would typically come from a users table
    return participantId === user?.id ? 'You' : 'Other User';
  };

  const filteredConversations = conversations.filter((conversation) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      getParticipantName(conversation.participants[0])
        .toLowerCase()
        .includes(searchLower) ||
      (conversation.lastMessage?.content.toLowerCase().includes(searchLower) ?? false)
    );
  });

  return (
    <Card className="h-[600px] flex flex-col">
      <CardContent className="p-0">
        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="overflow-y-auto h-[calc(600px-73px)]">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading conversations...
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`w-full p-4 border-b hover:bg-muted/50 transition-colors ${
                  conversation.id === selectedConversationId
                    ? 'bg-muted'
                    : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${conversation.participants[0]}`}
                      alt={getParticipantName(conversation.participants[0])}
                    />
                    <AvatarFallback>
                      {getParticipantName(conversation.participants[0])
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium truncate">
                        {getParticipantName(conversation.participants[0])}
                      </p>
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(conversation.lastMessage.created_at),
                            'HH:mm'
                          )}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {searchQuery
                ? 'No conversations found'
                : 'No conversations yet'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
