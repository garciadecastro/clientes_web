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
    .from("global_chat_messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[global-chat.js] Error al traer mensajes:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Inserta un nuevo mensaje en la tabla global_chat_messages.
 *
 * @param {Object} message - Objeto con los datos del mensaje
 * @param {string} message.email - Correo del usuario que envía
 * @param {string} message.content - Contenido del mensaje
 * @returns {Promise<Array>} Mensaje insertado
 * @throws {Error} Si ocurre un error en la inserción
 */
export async function sendGlobalChatMessage({ email, content }) {
  const { data, error } = await supabase
    .from("global_chat_messages")
    .insert({ email, content });

  if (error) {
    console.error("[global-chat.js] Error al enviar mensaje:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Se suscribe a la tabla global_chat_messages para recibir en tiempo real
 * los nuevos mensajes que se vayan insertando.
 *
 * @param {Function} callback - Función a ejecutar cuando llegue un nuevo mensaje
 */
export function subscribeToNewGlobalChatMessages(callback) {
  const chatChannel = supabase.channel("global_chat_messages");

  chatChannel.on(
    "postgres_changes",
    {
      event: "INSERT",
      table: "global_chat_messages",
      schema: "public",
    },
    payload => {
      callback(payload.new);
    }
  );

  chatChannel.subscribe();
}
