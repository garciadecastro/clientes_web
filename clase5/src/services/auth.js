import { supabase } from "./supabase";
import { obtenerPerfilUsuarioLogueado, actualizarPerfil } from "./user_profiles";
/*
# Ofreciendo los datos del estado de autenticación con el patrón Observer
En nuestra sistema va a ver múltiples componentes y archivos que necesiten saber del estado de autenticación. Esto
incluye enterarse automáticamente de los cambios que ocurran en ese estado.

Para resolverlo de una manera general, que no dependa de ningún framework ni nada por el estilo, vamos a hacer
uso de uno de los patrones de diseño más populares: Observer.

El patrón Observer permite modelar una relación entre elementos del sistema de 1 a muchos.
Esto se refiere al escenario en que muchos elementos de nuestro sistema (clases, scripts, componentes, etc), que
vamos a llamar "observers" están interesados en saber de los cambios de valor o estado, o de comportamientos, de
otro elemento, al que vamos a llamar el "subject".
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

let observers = [];

// Tratamos de cargar los datos del usuario, si es que ya está autenticado.
loadCurrentUserAuthState();

/**
 * Carga el estado actual del usuario autenticado desde Supabase
 * y su perfil correspondiente desde la tabla `user_profiles`.
 * @async
 * @returns {Promise<void>}
 */
async function loadCurrentUserAuthState() {
    // Los datos del usuario actual se pueden obtener con el método getUser de la propiedad auth.
    // Nos retorna, si está autenticado, los datos del usuario. Y sino, retorna un error.
    const { data, error } = await supabase.auth.getUser();

    if(error) {
        console.warn('No hay un usuario autenticado.');
        return;
    }

    setUser({
        id: data.user.id,
        email: data.user.email,
    });

    // En paralelo, dejamos cargando el perfil completo del usuario.
    fechPerfilCompleto();
}

/**
 * Carga la data del perfil completo del usaurio.
 */
async function fechPerfilCompleto () {
  try {
    const userProfile = await obtenerPerfilUsuarioLogueado();
    setUser({ 
      ...user, 
      ...userProfile 
    });
    
  } catch (error) {
    
  }
}







/**
 * Registra un nuevo usuario en Supabase Auth y crea su perfil
 * en la tabla pública `user_profiles`.
 * 
 * @async
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} display_name - Nombre visible (apodo o username público)
 * @throws {Error} Si ocurre un error al registrar
 * @returns {Promise<void>}
 */
export async function register(email, password, display_name) {
  // 1. Crear usuario en Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("[auth.js register] Error al registrar el usuario:", error);
    throw new Error(error.message);
  }

  const userId = data.user.id;

  // 2. Insertar perfil en user_profiles
  const { data: profile, error: insertError } = await supabase
    .from("user_profiles")
    .insert({
      id: userId,
      email: email,
      display_name: display_name,
      bio: null,
      elo: null,
      country: null,
      avatar_url: null,
    })
    .select(); 

  if (insertError) {
    console.error("[auth.js register] Error al crear perfil:", insertError);
    throw new Error(insertError.message);
  }

  console.log("[auth.js register] Perfil creado:", profile);

  // 3. Actualizar estado local
  setUser({
    id: userId,
    email: email,
    display_name: display_name,
  });
}

/**
 * Inicia sesión en Supabase usando email o display_name.
 * 
 * - Si el identificador contiene "@", se asume que es un email.
 * - Si no contiene "@", se busca el email asociado en `user_profiles`.
 * 
 * @async
 * @param {string} identifier - Correo electrónico o display_name del usuario
 * @param {string} password - Contraseña del usuario
 * @throws {Error} Si ocurre un error al iniciar sesión
 * @returns {Promise<void>}
 */
export async function login(identifier, password) {
  let emailToUse = identifier;

  // Si no parece un email, buscamos en user_profiles
  if (!identifier.includes("@")) {
    const { data, error } = await supabase
      .from("user_profiles")
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
    console.error("[auth.js login] Error al iniciar sesión.", error);
    throw new Error(error.message);
  }

  const userId = data.user.id;

  // Cargar display_name desde la tabla user_profiles
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name")
    .eq("id", userId)
    .single();

  setUser({
    id: userId,
    email: data.user.email,
    display_name: profile?.display_name || null,
  });

  fechPerfilCompleto();
}

/**
 * Cierra la sesión actual en Supabase.
 * @async
 * @throws {Error} Si ocurre un error al cerrar sesión
 * @returns {Promise<void>}
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[auth.js logout] Error al cerrar sesión.", error);
    throw new Error(error.message);
  }

  setUser({
    id: null,
    email: null,
    display_name: null,
  });
}

/**
 * 
 * @param {{display_name?: String|null, bio?: String|null, career?: String|null}} data
 */
export async function actualizarUsuarioAutentificado(data) {
    try {
        await actualizarPerfil(user.id, data);

        // Actualizamos los datos locales del perfil con la nueva info.
        setUser(data);
    } catch (error) {
        // TODO
    }
}


/*--------------------------------------------------------------
| Implementación del patrón Observer
--------------------------------------------------------------*/

/**
 * Permite a un componente suscribirse a los cambios de estado
 * de autenticación. El callback se invoca inmediatamente con
 * el estado actual y luego cada vez que cambie.
 * 
 * @param {(userState: {id: string|null, email: string|null, display_name: string|null}) => void} callback 
 */
export function subscribeToAuthStateChanges(callback) {
  observers.push(callback);
  notify(callback);
}

/**
 * Notifica a un observer individual.
 * @param {(userState: {id: string|null, email: string|null, display_name: string|null}) => void} callback 
 */
function notify(callback) {
  callback({ ...user }); // Pasamos una copia, no el objeto original
}

/**
 * Notifica a todos los observers registrados.
 */
function notifyAll() {
  observers.forEach(callback => notify(callback));
}

/**
 * Actualiza el estado interno del usuario y notifica a los observers.
 * @param {Partial<{id: string|null, email: string|null, display_name: string|null}>} data 
 */
function setUser(data) {
  user = {
    ...user,
    ...data,
  };
  notifyAll();
}
