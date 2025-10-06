/**
 * @file auth.js
 * @description Módulo de autenticación de la aplicación 'Gambito Club'.
 * Implementa el control de sesión, registro, inicio y cierre de sesión de usuarios
 * mediante Supabase, así como la sincronización de su perfil público.
 * 
 * Además, aplica el patrón de diseño **Observer** para notificar cambios de estado
 * de autenticación a todos los componentes suscritos.
 */

import { supabase } from "./supabase";
import { obtenerPerfilUsuarioLogueado, actualizarPerfil } from "./perfiles-usuarios";

// -----------------------------------------------------------------------------
// Estado interno y estructura base
// -----------------------------------------------------------------------------

/**
 * Estado actual del usuario autenticado.
 * @type {{
 *  id: string|null,
 *  email: string|null,
 *  display_name: string|null,
 *  bio: string|null,
 *  elo: number|null,
 *  country: string|null,
 *  title: string|null,
 *  last_online: string|null,
 *  created_at: string|null,
 *  avatar_url: string|null
 * }}
 */
let user = {
  id: null,
  email: null,
  display_name: null,
  bio: null,
  elo: null,
  country: null,
  title: null,
  last_online: null,
  created_at: null,
  avatar_url: null,
};

/**
 * Lista de observadores (componentes o funciones) suscritos a cambios de autenticación.
 * @type {Function[]}
 */
let observers = [];

// Intentamos cargar el estado del usuario al iniciar la aplicación.
loadCurrentUserAuthState();

// -----------------------------------------------------------------------------
// Funciones internas
// -----------------------------------------------------------------------------

/**
 * Carga el estado actual del usuario autenticado y su perfil desde Supabase.
 *
 * @async
 * @function loadCurrentUserAuthState
 * @returns {Promise<void>}
 *
 * @description
 * 1. Verifica si existe una sesión activa en Supabase.
 * 2. Si existe, actualiza el estado local con los datos básicos del usuario.
 * 3. Llama a `fechtPerfilCompleto()` para complementar con los datos del perfil público.
 */
async function loadCurrentUserAuthState() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.warn("[auth.js] No hay un usuario autenticado actualmente.");
    return;
  }

  setUser({
    id: data.user.id,
    email: data.user.email,
  });

  fechtPerfilCompleto();
}

/**
 * Carga y actualiza en memoria el perfil completo del usuario autenticado.
 *
 * @async
 * @function fechtPerfilCompleto
 * @returns {Promise<void>}
 */
async function fechtPerfilCompleto() {
  try {
    const userProfile = await obtenerPerfilUsuarioLogueado();
    setUser({
      ...user,
      ...userProfile,
    });
  } catch (error) {
    console.error("[auth.js → fechtPerfilCompleto] Error al obtener perfil:", error);
  }
}

// -----------------------------------------------------------------------------
// Funciones públicas de autenticación
// -----------------------------------------------------------------------------

/**
 * Registra un nuevo usuario y crea su perfil público en `perfiles_usuarios`.
 *
 * @async
 * @function register
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña elegida por el usuario.
 * @param {string} display_name - Nombre visible o apodo público.
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error durante el registro o la creación del perfil.
 */
export async function register(email, password, display_name) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("[auth.js → register] Error al registrar el usuario:", error);
    throw new Error(error.message);
  }

  const userId = data.user.id;

  const { error: insertError } = await supabase.from("perfiles_usuarios").insert({
    id: userId,
    email,
    display_name,
    bio: null,
    elo: null,
    country: null,
    avatar_url: null,
  });

  if (insertError) {
    console.error("[auth.js → register] Error al crear perfil:", insertError);
    throw new Error(insertError.message);
  }

  setUser({ id: userId, email, display_name });
}

/**
 * Inicia sesión en Supabase mediante correo o nombre de jugador.
 *
 * @async
 * @function login
 * @param {string} identifier - Puede ser el correo electrónico o el nombre de jugador.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<void>}
 * @throws {Error} Si las credenciales son inválidas o el usuario no existe.
 *
 * @description
 * 1. Determina si el identificador es un correo o un nombre de jugador.
 * 2. Obtiene el correo desde `perfiles_usuarios` si se usó `display_name`.
 * 3. Inicia sesión con Supabase Auth.
 * 4. Carga y actualiza los datos de perfil completos.
 */
export async function login(identifier, password) {
  let emailToUse = identifier;

  if (!identifier.includes("@")) {
    const { data, error } = await supabase
      .from("perfiles_usuarios")
      .select("email")
      .eq("display_name", identifier)
      .single();

    if (error || !data) {
      throw new Error("Usuario no encontrado");
    }

    emailToUse = data.email;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailToUse,
    password,
  });

  if (error) {
    console.error("[auth.js → login] Error al iniciar sesión:", error);
    throw new Error(error.message);
  }

  const userId = data.user.id;

  const { data: profile } = await supabase
    .from("perfiles_usuarios")
    .select("display_name")
    .eq("id", userId)
    .single();

  setUser({
    id: userId,
    email: data.user.email,
    display_name: profile?.display_name || null,
  });

  fechtPerfilCompleto();
}

/**
 * Cierra la sesión actual en Supabase.
 *
 * @async
 * @function logout
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error al cerrar sesión.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[auth.js → logout] Error al cerrar sesión:", error);
    throw new Error(error.message);
  }

  setUser({
    id: null,
    email: null,
    display_name: null,
  });
}

/**
 * Actualiza los datos del perfil del usuario autenticado en Supabase.
 *
 * @async
 * @function actualizarUsuarioAutentificado
 * @param {{display_name?: String|null, bio?: String|null, career?: String|null}} data
 * Campos a actualizar en la tabla `perfiles_usuarios`.
 * @returns {Promise<void>}
 */
export async function actualizarUsuarioAutentificado(data) {
  try {
    await actualizarPerfil(user.id, data);
    setUser(data);
  } catch (error) {
    console.error("[auth.js → actualizarUsuarioAutentificado] Error al actualizar usuario:", error);
  }
}

// -----------------------------------------------------------------------------
// Implementación del patrón Observer
// -----------------------------------------------------------------------------

/**
 * Permite suscribirse a los cambios en el estado de autenticación.
 *
 * @function subscribeToAuthStateChanges
 * @param {(userState: {id: string|null, email: string|null, display_name: string|null}) => void} callback
 * Función que será llamada cada vez que cambie el estado del usuario.
 * @returns {Function} Función que cancela la suscripción.
 *
 * @description
 * 1. Agrega el callback a la lista de observadores.
 * 2. Notifica inmediatamente el estado actual.
 * 3. Devuelve una función para anular la suscripción.
 */
export function subscribeToAuthStateChanges(callback) {
  observers.push(callback);
  notify(callback);

  return () => {
    observers = observers.filter((obs) => callback !== obs);
  };
}

/**
 * Notifica a un observador individual con el estado actual.
 * @param {(userState: Object) => void} callback
 */
function notify(callback) {
  callback({ ...user });
}

/**
 * Notifica a todos los observadores registrados.
 * @returns {void}
 */
function notifyAll() {
  observers.forEach((callback) => notify(callback));
}

/**
 * Actualiza el estado interno del usuario y notifica a todos los observadores.
 *
 * @function setUser
 * @param {Partial<{id: string|null, email: string|null, display_name: string|null}>} data
 * Objeto con los campos a actualizar en el estado local.
 */
function setUser(data) {
  user = {
    ...user,
    ...data,
  };
  notifyAll();
}

/**
 * Devuelve el usuario autenticado actual, si existe una sesión persistente.
 *
 * @async
 * @function obtenerUsuarioLogueado
 * @returns {Promise<Object|null>} Datos del usuario autenticado o `null` si no hay sesión activa.
 */
export async function obtenerUsuarioLogueado() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}
