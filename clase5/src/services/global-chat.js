// Servicio para todas las funciones del chat global
import { supabase } from "./supabase";

/**
 * Trae los mensajes de la tabla global_chat_messages
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
 * Inserta un nuevo mensaje en la tabla
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
 * Se suscribe a nuevos mensajes en tiempo real
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
