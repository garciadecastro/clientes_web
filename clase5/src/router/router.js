// Importo lo necesario para usar el router en Vue
import { createRouter, createWebHistory } from "vue-router";

// Importo las páginas de la carpeta [pages]
import Home from "../pages/Home.vue";
import GlobalChat from "../pages/GlobalChat.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Aperturas from "../pages/Aperturas.vue";
import MyProfile from "../pages/MyProfile.vue"; 

import { subscribeToAuthStateChanges } from "../services/auth";

// Defino las rutas de la app.
// Cada ruta tiene un path (URL) y un component (la vista que se carga).
const routes = [
    { path: '/',                                    component: Home, },
    { path: '/ingresar',                            component: Login, },
    { path: '/crear-cuenta',                        component: Register, },
    { path: '/aperturas',                           component: Aperturas,       meta: { requiresAuth: true, }, },
    { path: '/chat',                                component: GlobalChat,      meta: { requiresAuth: true, }, },
    { path: '/mi-perfil',                           component: MyProfile,       meta: { requiresAuth: true, }, },
];

// Creo el router y le paso las rutas y el historial
const router = createRouter({
  routes,
  history: createWebHistory(),
});
// Protección de rutas para usuarios autenticados.
// Primero, necesitamos obtener los datos del usuario autenticado.
let user = {
    id: null,
    email: null,
    username: null, // 👈 añadido porque en tu app también guardamos el username
}
subscribeToAuthStateChanges(newUserState => user = newUserState);

// Ahora vamos a utilizar el "guard global" del Router: beforeEach
// Un "navigation guard" es una función que puede decidir si permite que ocurra una navegación,
// si lo prohibe (retornando false) o si redirecciona a otra ruta (retornando una nueva URL o ruta).
// Esta función va a recibir 2 parámetros:
// 1. RouteNormalized. La ruta a la que se está navegando.
// 2. RouteNormalized. La ruta de la cual provenimos.
router.beforeEach((to, from) => {
    if (to.meta.requiresAuth && user.id === null) {
        return '/ingresar';
    }

    // console.group('🚦 Routes');
    // console.log('Navegando desde la ruta: ', from);
    // console.log('Navegando a la ruta: ', to);
    // console.groupEnd();
});


// Exporto el router para usarlo en main.js
export default router;
