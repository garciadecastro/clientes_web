/**
 * @file router.js
 * @description Configuración de rutas principales de la aplicación 'Gambito Club'.
 * Define las páginas disponibles, sus respectivas protecciones de acceso,
 * y establece la lógica de navegación según el estado de autenticación del usuario.
 */

import { createRouter, createWebHistory } from "vue-router";

// Importación de las vistas principales desde la carpeta [pages]
import Home from "../pages/Home.vue";
import GlobalChat from "../pages/ChatClub.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Registro.vue";
import Aperturas from "../pages/Aperturas.vue";
import MyProfile from "../pages/MiPerfil.vue";
import EditarPerfil from "../pages/EditarPerfil.vue";
import MiembrosClub from "../pages/MiembrosClub.vue";
import MiembroClub from "../pages/MiembroClub.vue";
import PublicacionesMiembros from "../pages/PublicacionesMiembros.vue";

import { subscribeToAuthStateChanges } from "../services/auth";

/**
 * @constant {Array<Object>} routes
 * @description Define la lista de rutas de la aplicación, donde cada objeto
 * representa una página accesible del sitio.
 *
 * @example
 * {
 *   path: '/aperturas',
 *   component: Aperturas,
 *   meta: { requiresAuth: true }
 * }
 */
const routes = [
  { path: "/", component: Home },
  { path: "/ingresar", component: Login },
  { path: "/crear-cuenta", component: Register },
  { path: "/aperturas", component: Aperturas, meta: { requiresAuth: true } },
  { path: "/chat", component: GlobalChat, meta: { requiresAuth: true } },
  { path: "/mi-perfil", component: MyProfile, meta: { requiresAuth: true } },
  { path: "/mi-perfil/editar", component: EditarPerfil, meta: { requiresAuth: true } },
  { path: "/miembros", component: MiembrosClub, meta: { requiresAuth: true } },
  { path: "/miembro/:id", component: MiembroClub, meta: { requiresAuth: true } },
  { path: "/publicaciones", component: PublicacionesMiembros, meta: { requiresAuth: true } },
  
];

/**
 * @constant {Router} router
 * @description Instancia principal del enrutador de Vue Router.
 * Utiliza el modo de historial HTML5 y la configuración definida en `routes`.
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// -----------------------------------------------------------------------------
// Protección de rutas según autenticación
// -----------------------------------------------------------------------------

/**
 * Estado local del usuario autenticado.
 * Se actualiza automáticamente con `subscribeToAuthStateChanges()`.
 * @type {{id: string|null, email: string|null, display_name: string|null}}
 */
let user = {
  id: null,
  email: null,
  display_name: null,
};

// Suscribimos el estado del usuario para mantenerlo sincronizado con Supabase.
subscribeToAuthStateChanges((newUserState) => (user = newUserState));

/**
 * Guard global de navegación.
 *
 * @function router.beforeEach
 * @param {import('vue-router').RouteLocationNormalized} to - Ruta destino.
 * @param {import('vue-router').RouteLocationNormalized} from - Ruta de origen.
 * @returns {(string|undefined)} Redirige a otra ruta o continúa la navegación.
 *
 * @description
 * 1. Si la ruta requiere autenticación (`meta.requiresAuth`) y no hay usuario logueado,
 *    redirige a `/ingresar`.
 * 2. Si el usuario ya está autenticado e intenta ir a `/ingresar` o `/crear-cuenta`,
 *    redirige a `/mi-perfil`.
 */
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && user.id === null) {
    return "/ingresar";
  }

  if (user.id && (to.path === "/ingresar" || to.path === "/crear-cuenta")) {
    return "/mi-perfil";
  }
});

// Exportamos el router para su uso en main.js
export default router;
