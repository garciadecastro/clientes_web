import { supabase } from "./supabase";

/**
 * Devuelve el perfil del usuario autenticado desde la tabla user_profiles.
 * @async
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("[user_profiles.js] Error al obtener perfil:", error);
    return null;
  }
  return data;
}

/**
 * Actualiza el perfil del usuario autenticado en la tabla user_profiles.
 * @async
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise<Object|null>}
 */
export async function updateProfile(updates) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No hay usuario autenticado");

  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    console.error("[user_profiles.js] Error al actualizar perfil:", error);
    throw new Error(error.message);
  }
  return data;
}
