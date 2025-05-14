import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  getUserNotifications, 
  getUnreadNotificationsCount, 
  markNotificationsAsRead 
} from '@/lib/notification.service';
import { Notification, WebSocketNotification } from '@/types/notification.types';
import { useAuth } from '@/contexts/AuthContext';

interface UseNotificationsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  limit?: number;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { 
    autoRefresh = true, 
    refreshInterval = 60000, // 1 minuto por defecto
    limit = 10
  } = options;
  
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Cargar notificaciones desde la API
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Obtener conteo de no leídas
      const count = await getUnreadNotificationsCount(user.id);
      setUnreadCount(count);

      // Obtener las notificaciones recientes
      const result = await getUserNotifications(user.id, { page: 1, limit });
      setNotifications(result.data);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err : new Error(err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  // Establecer intervalo para actualizar automáticamente
  useEffect(() => {
    fetchNotifications();

    // Configurar intervalo de actualización si está habilitado
    let intervalId: NodeJS.Timeout | undefined;
    if (autoRefresh && refreshInterval > 0) {
      intervalId = setInterval(fetchNotifications, refreshInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchNotifications, autoRefresh, refreshInterval]);

  // Configurar listener de tiempo real para notificaciones nuevas
  useEffect(() => {
    if (!user) return;

    // Suscribirse a cambios en la tabla de notificaciones para este usuario
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Añadir la nueva notificación al inicio del array
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev].slice(0, limit));
          
          // Incrementar contador de no leídas
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Limpieza al desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, limit]);

  // Función para marcar notificaciones como leídas
  const markAsRead = useCallback(async (notificationIds: string[]) => {
    if (!user || notificationIds.length === 0) return;
    
    try {
      await markNotificationsAsRead(user.id, notificationIds);
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(n => 
          notificationIds.includes(n.id) 
            ? { ...n, status: 'read', read_at: new Date().toISOString() }
            : n
        )
      );
      
      // Actualizar contador
      const newUnreadCount = await getUnreadNotificationsCount(user.id);
      setUnreadCount(newUnreadCount);
      
      return true;
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      return false;
    }
  }, [user]);

  // Función para marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    if (!user) return false;
    
    try {
      // Obtener IDs de todas las notificaciones no leídas
      const result = await getUserNotifications(user.id, { limit: 100 }, ['sent', 'delivered']);
      const unreadIds = result.data.map(n => n.id);
      
      if (unreadIds.length === 0) return true;
      
      // Marcarlas como leídas
      return await markAsRead(unreadIds);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  }, [user, markAsRead]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}
