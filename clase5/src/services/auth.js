import { supabase } from "./supabase";
/*
# Ofreciendo los datos del estado de autenticación con el patrón Observer
En nuestra sistema va a ver múltiples componentes y archivos que necesiten saber del estado de autenticación. Esto
incluye enterarse automáticamente de los cambios que ocurran en ese estado.

Para resolverlo de una manera general, que no dependa de ningún framework ni nada por el estilo, vamos a hacer
uso de uno de los patrones de diseño más populares: Observer.

https://refactoring.guru/design-patterns/observer

El patrón Observer permite modelar una relación entre elementos del sistema de 1 a muchos.
Esto se refiere al escenario en que muchos elementos de nuestro sistema (clases, scripts, componentes, etc), que vamos a llamar "observers" están interesados en saber de los cambios de valor o estado, o de comportamientos, de otro elemento, al que vamos a llamar el "subject".

La mayor parte del trabajo va a recaer en el "subject". Los "observers" simplemente van a sacar provecho de esta funcionalidad.

Para los "observers" poder enterarse de los cambios o sucesos ocurridos del "subject", necesitamos primero
"suscribirse" a ellos.
"Suscribirse" es el término tradicional que usamos en el patrón "Observer". Pero también lo pueden ver con otros nombres en otros contextos. Por ejemplo, pueden ver usarse "attach", "listen" o "watch".


Para implementar este patrón, necesitamos cumplir con algunos requisitos:
- Tener un "subject". En nuestro caso, va a ser un objeto con los datos del usuario.
- Tener una variable donde guardar los "observers" que se "suscriben". Nosotros vamos a usar un array.
- Tener una función que permita a un "observer" "suscribirse" a los cambios del "subject".
- Tener una función que permita notificar a los "observers" de los cambios del "subject".
*/ 

let user = {
    id: null,
    email: null,
}
let observers = [];

// Tratamos de cargar los datos del usuario, si es que ya está autenticado. 
loadCurrentUserAuthState();

async function loadCurrentUserAuthState() {
    // Los datos del usuario actual se pueden obtener con el método getUser de la propiedad auth.
    // Nos retorna, si está autenticado, los datos del usuario. Y sino, retorna un error.
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        console.warn('No hay un usuario autenticado.');
        return;
    }

    setUser({
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username || null, // añadimos username
    });

    notifyAll();
}


export async function register(email, password, username) {
    // Para interactuar con la autenticación de Supabase, podemos usar el objeto "auth" del cliente de Supabase.
    // Este objeto tiene varios métodos para interactuar con este sistema, incluyendo el método "signUp" para
    // registrarnos.

    //Recibe como objeto un parámetro con los datos del usuario a registrar.
    // Devuelve el clásico objeto Response de 'Supabaseo' con las propiedades 'data' y 'error'.
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
          username: username, // guardado en user_metadata
        }
    }
    });

    if (error) {
        console.error('[auth.js register] Error al registrar el usuario.', error);
        throw new Error(error.message);
    }

    // console.log("Usuario creado con éxito: ", data);
    setUser({
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username || null, // guardamos también username en el estado local
    });

    notifyAll(); // Notificamos a todos los observers del cambio de estado de autenticación.


}

/**
 * Inicia sesión en Supabase usando email y contraseña.
 *
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} Datos de sesión de Supabase
 * @throws {Error} Si ocurre un error en el inicio de sesión
 */
export async function login(identifier, password) {
  let emailToUse = identifier;

  // 1. Si no parece un email, asumimos que es un username
  if (!identifier.includes("@")) {
    // Buscar el email asociado al username en la tabla interna de usuarios de Supabase
    const { data, error } = await supabase
      .from("user_profiles") // 👈 usamos la vista recién creada
      .select("email")
      .eq("username", identifier) // 👈 ahora es una columna real en la vista
      .single();

    if (error || !data) {
      throw new Error("Usuario no encontrado");
    }

    emailToUse = data.email;
  }

  // 2. Usamos email + password para el login normal
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailToUse,
    password,
  });

  if (error) {
    console.error("[auth.js login] Error al iniciar sesión.", error);
    throw new Error(error.message);
  }

  setUser({
    id: data.user.id,
    email: data.user.email,
    username: data.user.user_metadata?.username || null,
  });

  notifyAll();
}


export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[auth.js logout] Error al cerrar sesión.", error);
    throw new Error(error.message);
  }

  setUser({
    id: null,
    email: null,
    username: null,
  });

  notifyAll();

}

/*--------------------------------------------------------------
| Implementación del Observer
--------------------------------------------------------------*/

/**
 *
 * @param {() => void} callback El observer a adjuntar.
 */

export function subscribeToAuthStateChanges(callback) {
    // El proceso de suscripción de un observer es, simplemente, agregarlo en nuestro array de observers.
    // Además, lo vamos a invocar inmediatamente, para pasarle los datos actuales del usuario.
    // De esta forma, tan pronto se suscriba, va a poder usar la info actual.
    observers.push(callback);

    notify(callback);
}



/**
 *
 * @param {() => void} callback 
 */
function notify(callback) {
  callback({
    ...user
  }); // Noten que pasamos una copia de los datos, no la variable original.
}

/**
 * Notifica a todos los observers del cambio del estado de autenticación.
 * Esta función debe llamarse cada vez que cambiemos el valor de la variable "user".
 */
function notifyAll() {
  // observer.forEach(notify); // Esta es una forma abreviada de hacer lo mismo que la línea de abajo
  observers.forEach(callback => notify(callback) ); //Lo dejo sin abreviar para entenderlo mejor en el futuro.
}

function setUser(data) {
    user = {
        ...user,
        ...data,
    }
    notifyAll();
}