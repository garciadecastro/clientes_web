import { supabase } from "./supabase";

/**
 * Devuelve el perfil del usuario autenticado desde la tabla perfiles_usuarios.
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
    .from("perfiles_usuarios")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("[perfiles-usuarios.js] Error al obtener perfil:", error);
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
        .from('perfiles_usuarios')
        .insert(data);

    if(error) {
        console.error('[perfiles-usuarios.js createUserProfile] Error al crear el perfil del usuario', id, error);
        throw new Error(error.message);
    }
}


/**
 * Actualiza los datos del perfil del usuario en la tabla perfiles_usuarios
 * 
 * @param {String} id - ID del usuario autenticado (UUID de Supabase)
 * @param {{display_name?: String|null, bio?: String|null, elo?: Number|null, country?: String|null, title?: String|null, avatar_url?: String|null}} data 
 */
export async function actualizarPerfil(id, data) {
  const { error } = await supabase
    .from('perfiles_usuarios')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error('[user_profile.js → actualizarPerfil] Error al actualizar el perfil del usuario:', id, error);
    throw new Error(error.message);
  }
}

