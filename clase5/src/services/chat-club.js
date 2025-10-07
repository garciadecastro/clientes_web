/**
 * @file chat-club.js
 * @description Funciones para manejar el chat global de Gambito Club.
 * Permiten leer los mensajes, enviar nuevos y escuchar las actualizaciones en tiempo real.
 */

import { supabase } from './supabase';

/**
 * Trae todos los mensajes guardados del chat global.
 * 
 * Los devuelve en orden cronológico (de más antiguo a más nuevo).
 */
export async function obtenerMensajesChatGlobal() {
  const { data, error } = await supabase
    .from('mensajes_chat')
    .select('*')
    .order('created_at');

  if (error) {
    console.error('[chat-club.js → obtenerMensajesChatGlobal] Error al traer mensajes:', error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Envía un nuevo mensaje al chat global.
 * 
 * Recibe los datos del usuario y el texto del mensaje.
 */
export async function enviarMensajeChatGlobal({ sender_id, email, display_name, content }) {
  const { error } = await supabase.from('mensajes_chat').insert({
    sender_id,
    email,
    display_name,
    content,
  });

  if (error) {
    console.error('[chat-club.js → enviarMensajeChatGlobal] Error al enviar mensaje:', error);
    throw new Error(error.message);
  }
}

/**
 * Escucha en tiempo real los nuevos mensajes que se publiquen en la tabla.
 * 
 * Cada vez que alguien escribe, ejecuta el callback con los datos del nuevo mensaje.
 */
export function escucharNuevosMensajesChat(callback) {
  const canalChat = supabase.channel('mensajes_chat');

  canalChat.on(
    'postgres_changes',
    {
      event: 'INSERT',
      table: 'mensajes_chat',
      schema: 'public',
    },
    payload => {
      callback(payload.new);
    }
  );

  canalChat.subscribe();

  // Retorna una función para cancelar la suscripción si hace falta.
  return () => {
    canalChat.unsubscribe();
  };
}
