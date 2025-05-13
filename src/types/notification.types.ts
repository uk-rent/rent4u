
// Tipos de notificación
export type NotificationType = 
  | 'subscription' // Relacionada con suscripciones
  | 'payment'      // Relacionada con pagos
  | 'property'     // Relacionada con propiedades
  | 'system'       // Notificaciones del sistema
  | 'message';     // Mensajes de otros usuarios

// Estados de notificación
export type NotificationStatus = 
  | 'sent'      // Enviada pero no entregada
  | 'delivered' // Entregada vía WebSocket/Push
  | 'read'      // Leída por el usuario
  | 'archived'; // Archivada por el usuario

// Notificación completa
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  data: Record<string, any> | null; // Datos adicionales
  status: NotificationStatus;
  read_at: string | null;
  created_at: string;
}

// DTO para crear una notificación
export interface CreateNotificationDto {
  user_id: string;
  type: NotificationType;
  message: string;
  data?: Record<string, any>;
}

// DTO para actualizar una notificación
export interface UpdateNotificationDto {
  status?: NotificationStatus;
  read_at?: string | null;
}

// Payload para WebSocket
export interface WebSocketNotification {
  notification_id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  data?: Record<string, any>;
  created_at: string;
}

// Payload para Web Push
export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    url?: string;
    notification_id?: string;
    type?: NotificationType;
    [key: string]: any;
  };
}
