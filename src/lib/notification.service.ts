
import { supabase } from '@/integrations/supabase/client';
import { 
  Notification,
  NotificationType,
  NotificationStatus,
  CreateNotificationDto,
  UpdateNotificationDto,
  WebSocketNotification,
  PushNotificationPayload
} from '@/types/notification.types';
import { ApiError, PaginationParams } from '@/types/api.types';
import { PushSubscription } from '@/types/user.types';

/**
 * Crear una nueva notificación
 */
export const createNotification = async (
  notificationData: CreateNotificationDto
): Promise<Notification> => {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notificationData)
    .select()
    .single();

  if (error) {
    throw new ApiError(
      'Error al crear la notificación',
      'CREATE_NOTIFICATION_ERROR',
      500,
      error
    );
  }

  return data as Notification;
};

/**
 * Obtener notificaciones de un usuario con paginación
 */
export const getUserNotifications = async (
  userId: string,
  pagination: PaginationParams = {},
  status?: NotificationStatus | NotificationStatus[]
): Promise<{ data: Notification[], total: number, page: number, limit: number, pages: number }> => {
  const { page = 1, limit = 10 } = pagination;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  // Filtrar por status si se proporciona
  if (status) {
    if (Array.isArray(status)) {
      query = query.in('status', status);
    } else {
      query = query.eq('status', status);
    }
  }

  // Ordenar y paginar
  query = query.order('created_at', { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new ApiError(
      'Error al obtener notificaciones',
      'FETCH_NOTIFICATIONS_ERROR',
      500,
      error
    );
  }

  const total = count || 0;
  const pages = Math.ceil(total / limit);

  return {
    data: data as Notification[],
    total,
    page,
    limit,
    pages
  };
};

/**
 * Actualizar el estado de una notificación
 */
export const updateNotification = async (
  id: string,
  userId: string,
  updates: UpdateNotificationDto
): Promise<Notification> => {
  // Verificar que la notificación pertenece al usuario
  const { data: notification, error: fetchError } = await supabase
    .from('notifications')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    throw new ApiError(
      'Notificación no encontrada',
      'NOTIFICATION_NOT_FOUND',
      404,
      fetchError
    );
  }

  // Si se está marcando como leída y no tiene fecha de lectura
  if (updates.status === 'read' && !updates.read_at) {
    updates.read_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('notifications')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new ApiError(
      'Error al actualizar la notificación',
      'UPDATE_NOTIFICATION_ERROR',
      500,
      error
    );
  }

  return data as Notification;
};

/**
 * Marcar múltiples notificaciones como leídas
 */
export const markNotificationsAsRead = async (
  userId: string,
  notificationIds: string[]
): Promise<void> => {
  const now = new Date().toISOString();
  
  const { error } = await supabase
    .from('notifications')
    .update({
      status: 'read',
      read_at: now
    })
    .eq('user_id', userId)
    .in('id', notificationIds);

  if (error) {
    throw new ApiError(
      'Error al marcar notificaciones como leídas',
      'UPDATE_NOTIFICATIONS_ERROR',
      500,
      error
    );
  }
};

/**
 * Obtener el conteo de notificaciones no leídas de un usuario
 */
export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .in('status', ['sent', 'delivered']);

  if (error) {
    throw new ApiError(
      'Error al obtener conteo de notificaciones no leídas',
      'UNREAD_COUNT_ERROR',
      500,
      error
    );
  }

  return count || 0;
};

/**
 * Registrar una nueva suscripción de notificaciones push
 */
export const registerPushSubscription = async (
  userId: string,
  endpoint: string,
  p256dh: string,
  auth: string
): Promise<PushSubscription> => {
  // Verificar si ya existe una suscripción con este endpoint
  const { data: existing } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('endpoint', endpoint)
    .limit(1);

  // Si existe una suscripción con este endpoint, pero pertenece a otro usuario, eliminarla
  if (existing && existing.length > 0 && existing[0].user_id !== userId) {
    await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint);
  }

  // Insertar la nueva suscripción
  const { data, error } = await supabase
    .from('push_subscriptions')
    .upsert({
      user_id: userId,
      endpoint,
      p256dh,
      auth
    })
    .select()
    .single();

  if (error) {
    throw new ApiError(
      'Error al registrar la suscripción push',
      'PUSH_SUBSCRIPTION_ERROR',
      500,
      error
    );
  }

  return data as PushSubscription;
};

/**
 * Obtener todas las suscripciones push de un usuario
 */
export const getUserPushSubscriptions = async (userId: string): Promise<PushSubscription[]> => {
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new ApiError(
      'Error al obtener suscripciones push',
      'FETCH_PUSH_SUBSCRIPTIONS_ERROR',
      500,
      error
    );
  }

  return data as PushSubscription[];
};
