
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Link } from 'react-router-dom';
import { Notification, NotificationType } from '@/types/notification.types';
import { getUserNotifications, markNotificationsAsRead, getUnreadNotificationsCount } from '@/lib/notification.service';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Íconos para diferentes tipos de notificaciones
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'subscription':
      return <span className="text-blue-500">💳</span>;
    case 'payment':
      return <span className="text-green-500">💰</span>;
    case 'property':
      return <span className="text-orange-500">🏠</span>;
    case 'message':
      return <span className="text-purple-500">💬</span>;
    case 'system':
    default:
      return <span className="text-gray-500">ℹ️</span>;
  }
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Cargar notificaciones al abrir el popover
  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Obtener conteo de no leídas
      const count = await getUnreadNotificationsCount(user.id);
      setUnreadCount(count);
      
      // Obtener las notificaciones recientes
      const result = await getUserNotifications(user.id, { page: 1, limit: 10 });
      setNotifications(result.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar conteo de notificaciones no leídas al inicio
  useEffect(() => {
    if (user) {
      const fetchUnreadCount = async () => {
        try {
          const count = await getUnreadNotificationsCount(user.id);
          setUnreadCount(count);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      };
      
      fetchUnreadCount();
      
      // Configurar intervalos para actualizar el conteo automáticamente
      const interval = setInterval(fetchUnreadCount, 60000); // Cada minuto
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Manejar apertura del popover
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    
    // Cargar notificaciones cuando se abre
    if (open) {
      loadNotifications();
    }
  };

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    
    try {
      // Filtrar IDs de notificaciones no leídas
      const unreadIds = notifications
        .filter(n => n.status === 'sent' || n.status === 'delivered')
        .map(n => n.id);
        
      if (unreadIds.length === 0) return;
      
      await markNotificationsAsRead(user.id, unreadIds);
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(n => 
          unreadIds.includes(n.id) 
            ? { ...n, status: 'read', read_at: new Date().toISOString() }
            : n
        )
      );
      
      setUnreadCount(0);
      
      toast({
        title: "Notificaciones leídas",
        description: "Todas las notificaciones han sido marcadas como leídas",
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast({
        title: "Error",
        description: "No se pudieron marcar las notificaciones como leídas",
        variant: "destructive",
      });
    }
  };

  // Formatear fecha relativa
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    
    // Para fechas más antiguas, usar formato de fecha estándar
    return date.toLocaleDateString();
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Notificaciones</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Marcar como leídas
          </Button>
        </div>
        <Separator className="my-2" />
        
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-2 rounded-md ${
                    notification.status === 'read' ? 'bg-white' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex gap-2">
                    <div className="text-xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <Separator className="my-2" />
        <div className="text-center">
          <Button variant="link" size="sm" asChild>
            <Link to="/dashboard/notifications">Ver todas</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
