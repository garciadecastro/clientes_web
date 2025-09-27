// Importo lo necesario para usar el router en Vue
import { createRouter, createWebHistory } from "vue-router";

// Importo las páginas de la carpeta [pages]
import Home from "../pages/Home.vue";
import GlobalChat from "../pages/GlobalChat.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Aperturas from "../pages/Aperturas.vue";

// Defino las rutas de la app.
// Cada ruta tiene un path (URL) y un component (la vista que se carga).
const routes = [
  { path: '/', component: Home },
  { path: '/chat', component: GlobalChat },
  { path: '/ingresar', component: Login },
  { path: '/aperturas', component: Aperturas },
  { path: '/crear-cuenta', component: Register },
];

// Creo el router y le paso las rutas y el historial
const router = createRouter({
  routes,
  history: createWebHistory(),
});

// Exporto el router para usarlo en main.js
export default router;
