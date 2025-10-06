/**
 * @file chat-club.js
 * @description Servicio encargado de gestionar las operaciones del chat global
 * de la aplicación 'Gambito Club', incluyendo lectura, envío y suscripción
 * a mensajes en tiempo real mediante Supabase.
 */

import { supabase } from "./supabase";

/**
 * Obtiene todos los mensajes del chat global ordenados cronológicamente.
 *
 * @async
 * @function fetchLastGlobalChatMessages
 * @returns {Promise<Array>} Lista de mensajes almacenados en la tabla `mensajes_chat`.
 * @throws {Error} Si ocurre un error durante la consulta a Supabase.
 *
 * @description
 * 1. Realiza una consulta a la tabla `mensajes_chat`.
 * 2. Ordena los mensajes por fecha de creación (campo `created_at`).
 * 3. Devuelve los datos obtenidos o lanza un error si la consulta falla.
 */
export async function fetchLastGlobalChatMessages() {
  const { data, error } = await supabase
    .from("mensajes_chat")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[chat-club.js → fetchLastGlobalChatMessages] Error al traer mensajes:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Inserta un nuevo mensaje en la tabla `mensajes_chat`.
 *
 * @async
 * @function sendGlobalChatMessage
 * @param {{
 *  sender_id: string,
 *  email: string,
 *  display_name: string,
 *  content: string
 * }} data - Objeto que contiene la información del mensaje a enviar.
 * @returns {Promise<void>} No retorna datos. Lanza un error si la inserción falla.
 *
 * @description
 * Inserta un nuevo registro en la tabla `mensajes_chat` con los campos
 * del usuario y el contenido del mensaje.
 */
export async function sendGlobalChatMessage({ sender_id, email, display_name, content }) {
  const { error } = await supabase.from("mensajes_chat").insert({
    sender_id,
    email,
    display_name,
    content,
  });

  if (error) {
    console.error(
      "[chat-club.js → sendGlobalChatMessage] Error al enviar el nuevo mensaje:",
      error
    );
    throw new Error(error.message);
  }
}

/**
 * Suscribe a la aplicación a los cambios en tiempo real de la tabla `mensajes_chat`.
 *
 * @function subscribeToNewGlobalChatMessages
 * @param {Function} callback - Función que se ejecuta cada vez que se inserta un nuevo mensaje.
 * @returns {Function} Función para cancelar la suscripción al canal del chat.
 *
 * @description
 * 1. Crea un canal de escucha llamado `'mensajes_chat'`.
 * 2. Escucha los eventos de tipo `INSERT` en la tabla `mensajes_chat`.
 * 3. Llama al `callback` con los datos del nuevo mensaje.
 * 4. Retorna una función que permite cancelar la suscripción.
 */
export function subscribeToNewGlobalChatMessages(callback) {
  const chatChannel = supabase.channel("mensajes_chat");

  chatChannel.on(
    "postgres_changes",
    {
      event: "INSERT",
      table: "mensajes_chat",
      schema: "public",
    },
    (payload) => {
      callback(payload.new);
    }
  );

  chatChannel.subscribe();

  return () => {
    chatChannel.unsubscribe();
  };
}
