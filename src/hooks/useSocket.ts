
import { useEffect, useState, useRef, useCallback } from 'react';
import { WebSocketNotification } from '@/types/notification.types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// URL del WebSocket - Se debe obtener de variables de entorno
const WS_URL = 'wss://zayphjxnkplzwworctic.supabase.co/realtime/v1/websocket';

export function useSocket() {
  const { user, session } = useAuth();
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  // Función para conectar con WebSocket
  const connect = useCallback(() => {
    if (!user || !session?.access_token || connecting) return;
    
    try {
      setConnecting(true);
      
      // Crear conexión de WebSocket con token de autenticación
      const socket = new WebSocket(`${WS_URL}?token=${session.access_token}`);
      
      socket.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        setConnecting(false);
      };
      
      socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event);
        setConnected(false);
        setConnecting(false);
        
        // Intentar reconectar después de un retraso
        setTimeout(connect, 3000);
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnecting(false);
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Manejar diferentes tipos de mensajes
          if (data.type === 'notification') {
            const notification = data.payload as WebSocketNotification;
            
            // Mostrar notificación como toast
            toast({
              title: `Nueva notificación: ${notification.type}`,
              description: notification.message,
              duration: 5000,
            });
            
            // Emitir evento para actualizaciones de UI
            const notificationEvent = new CustomEvent('new-notification', {
              detail: notification
            });
            window.dispatchEvent(notificationEvent);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      socketRef.current = socket;
      
      // Limpiar recursos al desmontar
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error establishing WebSocket connection:', error);
      setConnecting(false);
    }
  }, [user, session, connecting]);

  // Conectar/Reconectar cuando cambia el usuario o token
  useEffect(() => {
    connect();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect]);

  // Función para enviar un mensaje
  const sendMessage = useCallback((message: any) => {
    if (!connected || !socketRef.current) {
      console.error('Cannot send message: WebSocket not connected');
      return false;
    }
    
    try {
      socketRef.current.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }, [connected]);

  // Función para reconectar manualmente
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    
    connect();
  }, [connect]);

  return {
    connected,
    connecting,
    sendMessage,
    reconnect
  };
}
