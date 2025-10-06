/**
 * @file perfiles-usuarios.js
 * @description Módulo de gestión de perfiles de usuario para la aplicación 'Gambito Club'.
 * Contiene funciones para obtener, crear y actualizar perfiles en la tabla `perfiles_usuarios`
 * dentro de la base de datos de Supabase.
 */

import { supabase } from "./supabase";

/**
 * Obtiene el perfil del usuario autenticado desde la tabla `perfiles_usuarios`.
 *
 * @async
 * @function obtenerPerfilUsuarioLogueado
 * @returns {Promise<Object|null>} Devuelve un objeto con los datos del perfil
 * o `null` si no hay sesión activa o se produce un error.
 *
 * @description
 * 1. Obtiene el usuario actual desde `supabase.auth.getUser()`.
 * 2. Si no hay sesión, retorna `null`.
 * 3. Consulta la tabla `perfiles_usuarios` filtrando por el `id` del usuario autenticado.
 */
export async function obtenerPerfilUsuarioLogueado() {
  const response = await supabase.auth.getUser();
  const user = response.data.user;

  if (!user) return null;

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
 * Crea un nuevo perfil de usuario en la tabla `perfiles_usuarios`.
 *
 * @async
 * @function crearPerfildeUsuario
 * @param {{id: String, email: String, display_name?: String|null, bio?: String|null, career?: String|null}} data
 * Objeto con los datos del perfil a insertar.
 * @returns {Promise<void>} No retorna datos. Lanza un error si la inserción falla.
 *
 * @description
 * Inserta un nuevo registro en `perfiles_usuarios` utilizando el `id` del usuario autenticado
 * como clave primaria. Los campos adicionales son opcionales.
 */
export async function crearPerfildeUsuario(data) {
  const { error } = await supabase.from("perfiles_usuarios").insert(data);

  if (error) {
    console.error(
      "[perfiles-usuarios.js → crearPerfildeUsuario] Error al crear perfil del usuario:",
      data?.id,
      error
    );
    throw new Error(error.message);
  }
}

/**
 * Actualiza los datos del perfil del usuario autenticado.
 *
 * @async
 * @function actualizarPerfil
 * @param {String} id - ID único del usuario (UUID de Supabase).
 * @param {{
 *  display_name?: String|null,
 *  bio?: String|null,
 *  elo?: Number|null,
 *  country?: String|null,
 *  title?: String|null,
 *  avatar_url?: String|null
 * }} data - Campos del perfil a actualizar.
 * @returns {Promise<void>} Lanza un error si la actualización falla.
 *
 * @description
 * Modifica los campos del perfil del usuario en la tabla `perfiles_usuarios`
 * de acuerdo al identificador (`id`) recibido.
 */
export async function actualizarPerfil(id, data) {
  const { error } = await supabase
    .from("perfiles_usuarios")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error(
      "[perfiles-usuarios.js → actualizarPerfil] Error al actualizar perfil del usuario:",
      id,
      error
    );
    throw new Error(error.message);
  }
}
