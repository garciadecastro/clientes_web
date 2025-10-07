/**
 * @file auth.js
 * @description Controla la autenticación en Gambito Club: registro, inicio/cierre de sesión y sincronización del perfil del usuario.
 * Aplica el patrón de diseño Observer para mantener sincronizados los componentes que dependen del estado del usuario.
 */

import { supabase } from './supabase';
import { obtenerPerfilUsuarioLogueado, actualizarPerfilUsuario } from './perfiles-usuarios';

/**
 * "subject", objeto con los datos del usuario.
 */
let usuario = {
  id: null,
  email: null,
  display_name: null,
  bio: null,
  elo: null,
  country: null,
  title: null,
  avatar_url: null,
};

/**
 * variable donde guardar los "observers" que se "suscriben"
 */
let observers = [];

// Al cargar el módulo, intentamos recuperar la sesión activa si existe.
cargarSesionGuardada();

/**
 * Comprueba si existe un usuario autenticado y, si lo hay, carga sus datos básicos.
 * Luego intenta obtener el perfil completo desde la base de datos.
 */
async function cargarSesionGuardada() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return;

  setUser({
    id: data.user.id,
    email: data.user.email,
  });

  // Dejamos cargando el perfil completo del usuario paralelamente.
  obtenerPerfilCompleto();
}

/**
 * Carga el perfil completo del usuario autenticado y actualiza el estado local.
 * Si ocurre un error, mantiene los datos básicos cargados previamente.
 */
async function obtenerPerfilCompleto() {
  try {
    const perfil = await obtenerPerfilUsuarioLogueado();
    setUser({
      ...usuario,
      ...perfil,
    });
  } catch (error) {
    console.warn('No se pudo cargar el perfil completo:', error.message);
  }
}

/**
 * Registra un nuevo usuario y crea su perfil en un solo paso.
 * Combina el alta en Supabase Auth con la inserción directa en la tabla de perfiles,
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña elegida.
 * @param {string} nombreVisible - Nombre de jugador visible en el perfil.
 */
export async function registrarUsuario(email, password, nombreVisible) {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password 
  });

   if(error) {
            console.error('[auth.js register] Error al registrar nuevo usuario.', error);
            throw new Error(error.message);
        }

  const idUsuario = data.user.id;

  const { error: errorPerfil } = await supabase
  // inserción directa en la tabla de perfiles, este cambio lo hice porque así puedo
  // regisrar también un nombre de usuario, algo que no teníamos en la función en clase.
    .from('perfiles_usuarios')
    .insert({
      id: idUsuario,
      email,
      display_name: nombreVisible,
    });

  if (errorPerfil) throw new Error(errorPerfil.message);

  setUser({ id: idUsuario, email, display_name: nombreVisible });
}

/**
 * Inicia sesión mediante correo electrónico o nombre de usuario
 * Si se usa un nombre busca el correo correspondiente antes de autenticar.
 * @param {string} identificador - Email o nombre de jugador.
 * @param {string} password - Contraseña del usuario.
 */
export async function iniciarSesion(identificador, password) {
  // Básicamente lo que he hecho es que la variable identificador pueda ser el email o el nombre
  // Pero al final siempre se va a con el email, que si se usa el nombre lo tomará de la base de datos.
  let emailFinal = identificador;

  // Permite login con nombre
  if (!identificador.includes('@')) {
    const { data, error } = await supabase
      .from('perfiles_usuarios')
      .select('email')
      .eq('display_name', identificador)
      .single();

    if (error || !data) throw new Error('Usuario no encontrado.');
    emailFinal = data.email;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailFinal,
    password,
  });

  if (error) throw new Error(error.message);

  setUser({
    id: data.user.id,
    email: data.user.email,
  });

  obtenerPerfilCompleto();
}

/**
 * Cierra la sesión actual y limpia los datos locales del usuario.
 */
export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);

  setUser({
    id: null,
    email: null,
    display_name: null,
  });
}

/**
 * Actualiza los datos del perfil del usuario autenticado.
 * El cambio se refleja en el estado local sin recargar la aplicación.
 */
export async function actualizarUsuarioActual(datos) {
  try {
    await actualizarPerfilUsuario(usuario.id, datos);

    setUser(datos);
  } catch (error) {
    console.error('Error al actualizar perfil:', error.message);
  }
}

/**
 * -----------------------------------------------------------------------------
 * Implementación del Observer
 * -----------------------------------------------------------------------------
 */

/**
 * Permite que otros módulos se suscriban a los cambios del estado de autenticación.
 * Retorna una función que permite cancelar la suscripción.
 */
export function escucharCambiosDeAuth(callback) {
  observers.push(callback);
  callback({ ...usuario });

  return () => {
    observers = observers.filter(obs => obs !== callback);
  };
}

/**
 * Notifica a todos los observadores con el estado actual del usuario.
 * Omito la función intermedia que notifica a un solo observador,
 * ya que en este contexto solo tengo un "subject" (el usuario autenticado).
 */
function notificarTodos() { 
  observers.forEach(callback => callback({ ...usuario })); 
}

/**
 * Actualiza los datos del usuario local y notifica a los observers registrados.
 */
function setUser(data) {
  usuario = { ...usuario, ...data };
  notificarTodos();
}

/**
 * Esta función se utiliza en main.js para verificar, antes de montar la aplicación,
 * si existe una sesión activa en Supabase. De ese modo, el estado inicial de la app
 * ya sabe si el usuario está autenticado.
 */
export async function obtenerUsuarioActual() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}
