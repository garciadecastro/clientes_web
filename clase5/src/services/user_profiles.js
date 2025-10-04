import { supabase } from "./supabase";

/**
 * Devuelve el perfil del usuario autenticado desde la tabla user_profiles.
 * @async
 * @returns {Promise<Object|null>}
 */
export async function obtenerPerfilUsuarioLogueado() {
    // Pedimos a Supabase Auth los datos de la sesión actual.
    const response = await supabase.auth.getUser();

    // Obtenemos el usuario actual desde Supabase Auth (tabla interna auth.users).
    const user = response.data.user;

    // Si no hay usuario logueado, devolvemos null
    if (!user) {
      return null;
    }


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
 * 
 * @param {{id: String, email: String, display_name?: String|null, bio?: String|null, career?: String|null}} data 
 */
export async function crearPerfildeUsuario(data) {
    const { error } = await supabase
        .from('user_profiles')
        .insert(data);

    if(error) {
        console.error('[user-profils.js createUserProfile] Error al crear el perfil del usuario', id, error);
        throw new Error(error.message);
    }
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
