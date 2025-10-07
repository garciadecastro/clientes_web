/**
 * @file router.js
 * @description Archivo encargado de manejar la navegación principal de la app "Gambito Club".
 * Define las rutas, los componentes asociados a cada una y las reglas
 * de acceso según si el usuario está autenticado o no.
 */

import { createRouter, createWebHistory } from "vue-router";
import { escucharCambiosDeAuth } from "../services/auth";

// Importamos las páginas que componen el sitio.
import Home from "../pages/Home.vue";
import ChatClub from "../pages/ChatClub.vue";
import Login from "../pages/Login.vue";
import Registro from "../pages/Registro.vue";
import Aperturas from "../pages/Aperturas.vue";
import MiPerfil from "../pages/MiPerfil.vue";
import EditarPerfil from "../pages/EditarPerfil.vue";
import MiembrosClub from "../pages/MiembrosClub.vue";
import MiembroClub from "../pages/MiembroClub.vue";
import PublicacionesMiembros from "../pages/PublicacionesMiembros.vue";

/**
 * Listado de todas las rutas disponibles en el sitio.
 * Cada objeto indica el path, el componente que se debe mostrar y
 * si necesita autenticación o no.
 */
const rutas = [
  { path: "/",                    component: Home },
  { path: "/ingresar",            component: Login },
  { path: "/crear-cuenta",        component: Registro },
  { path: "/aperturas",           component: Aperturas, meta: { requiereLogin: true } },
  { path: "/chat",                component: ChatClub, meta: { requiereLogin: true } },
  { path: "/mi-perfil",           component: MiPerfil, meta: { requiereLogin: true } },
  { path: "/mi-perfil/editar",    component: EditarPerfil, meta: { requiereLogin: true } },
  { path: "/miembros",            component: MiembrosClub, meta: { requiereLogin: true } },
  { path: "/miembro/:id",         component: MiembroClub, meta: { requiereLogin: true } },
  { path: "/publicaciones",       component: PublicacionesMiembros, meta: { requiereLogin: true } },
];

/**
 * Crea la instancia principal del router que controla toda la navegación interna.
 */
const router = createRouter({
  history: createWebHistory(),
  routes: rutas,
});

// -----------------------------------------------------------------------------
// Control de acceso según estado de autenticación
// -----------------------------------------------------------------------------

/**
 * Estado local del usuario autenticado.
 * Se mantiene sincronizado con Supabase mediante la función escucharCambiosDeAuth().
 */
let usuario = {
  id: null,
  email: null,
  display_name: null,
};

// Escuchamos cambios en el estado de autenticación y actualizamos el usuario local.
escucharCambiosDeAuth((nuevoEstado) => (usuario = nuevoEstado));

/**
 * Guard global que controla a qué rutas se puede acceder.
 * - Si la ruta requiere autenticación y el usuario no está logueado → redirige al login.
 * - Si el usuario ya está autenticado e intenta ir a login o registro → redirige a su perfil.
 * @param {import('vue-router').RouteLocationNormalized} to - Ruta destino.
 * @param {import('vue-router').RouteLocationNormalized} from - Ruta origen.
 * @returns {(string|undefined)} Devuelve una redirección o permite continuar.
 */
router.beforeEach((to, from) => {
  if (to.meta.requiereLogin && usuario.id === null) {
    return "/ingresar";
  }

  if (usuario.id && (to.path === "/ingresar" || to.path === "/crear-cuenta")) {
    return "/mi-perfil";
  }
});

// Exportamos el router para que sea usado en main.js
export default router;
