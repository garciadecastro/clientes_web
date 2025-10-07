/**
 * @file perfiles-usuarios.js
 * @description Funciones para manejar los perfiles de los miembros del Gambito Club en la base de datos de Supabase.
 * Permite obtener, crear y actualizar los datos personales de cada usuario.
 */

import { supabase } from './supabase';

/**
 * Devuelve el perfil del usuario actualmente logueado.
 * 
 * Busca en la tabla `perfiles_usuarios` los datos del jugador que tiene la sesión activa.
 * Si no hay sesión, o ocurre un error, devuelve `null`.
 */
export async function obtenerPerfilUsuarioLogueado() {
  const { data: userData } = await supabase.auth.getUser();
  const usuario = userData?.user;

  if (!usuario) return null;

  const { data, error } = await supabase
    .from('perfiles_usuarios')
    .select('*')
    .eq('id', usuario.id)
    .single();

  if (error) {
    console.error('[perfiles-usuarios.js] Error al obtener perfil:', error);
    return null;
  }

  return data;
}

/**
 * Crea un nuevo registro de perfil en la tabla `perfiles_usuarios`.
 * 
 * Se usa normalmente cuando un usuario se registra por primera vez.
 */
export async function crearPerfilUsuario(datos) {
  const { error } = await supabase.from('perfiles_usuarios').insert(datos);

  if (error) {
    console.error(
      '[perfiles-usuarios.js → crearPerfilUsuario] Error al crear perfil del usuario:',
      datos?.id,
      error
    );
    throw new Error(error.message);
  }
}

/**
 * Actualiza la información de un perfil existente.
 * 
 * Modifica los campos del perfil según el `id` del usuario.
 */
export async function actualizarPerfilUsuario(id, datos) {
  const { error } = await supabase
    .from('perfiles_usuarios')
    .update(datos)
    .eq('id', id);

  if (error) {
    console.error(
      '[perfiles-usuarios.js → actualizarPerfilUsuario] Error al actualizar perfil:',
      id,
      error
    );
    throw new Error(error.message);
  }
}
