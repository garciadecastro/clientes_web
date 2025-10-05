// Servicio para todas las funciones del chat global
import { supabase } from "./supabase";

/**
 * Obtiene todos los mensajes existentes del chat global,
 * ordenados cronológicamente por la fecha de creación.
 *
 * @returns {Promise<Array>} Lista de mensajes
 * @throws {Error} Si ocurre un error en la consulta a Supabase
 */
export async function fetchLastGlobalChatMessages() {
  const { data, error } = await supabase
    .from('mensajes_chat')
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[global-chat.js] Error al traer mensajes:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Inserta un nuevo mensaje en la tabla mensajes_chat.
 *
 * @param {Object} message - Objeto con los datos del mensaje
 * @param {string} message.email - Correo del usuario que envía
 * @param {string} message.content - Contenido del mensaje
 * @returns {Promise<Array>} Mensaje insertado
 * @throws {Error} Si ocurre un error en la inserción
 */
/**
 * Envía un nuevo mensaje al chat global.
 * 
 * @param {{ sender_id: string, email: string, display_name: string, content: string }} data 
 */
export async function sendGlobalChatMessage({ sender_id, email, display_name, content }) {
  const { data, error } = await supabase
    .from('mensajes_chat')
    .insert({
      sender_id,
      email,
      display_name,
      content,
    });

  if (error) {
    console.error('[chat-club.js sendGlobalChatMessage] Error al enviar el nuevo mensaje.', error);
    throw new Error(error.message);
  }
}

/**
 * Se suscribe a la tabla mensajes_chat para recibir en tiempo real
 * los nuevos mensajes que se vayan insertando.
 *
 * @param {Function} callback - Función a ejecutar cuando llegue un nuevo mensaje
 */
export function subscribeToNewGlobalChatMessages(callback) {
  const chatChannel = supabase.channel('mensajes_chat');

  chatChannel.on(
    "postgres_changes",
    {
      event: "INSERT",
      table: 'mensajes_chat',
      schema: "public",
    },
    payload => {
      callback(payload.new);
    }
  );

  chatChannel.subscribe();

  // Retornamos una función que cancele la suscripción.
    return () => {
        chatChannel.unsubscribe();
    }
}
