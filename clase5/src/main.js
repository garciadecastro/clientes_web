/**
 * @file main.js
 * @description Punto de entrada de la aplicación 'Gambito Club'.
 * Inicializa Vue, configura el router y verifica si existe una sesión activa
 * en Supabase antes de montar la aplicación en el DOM.
 *
 */

import "./style.css";
import { createApp } from "vue"; 
import { obtenerUsuarioLogueado } from './services/auth.js';

import router from "./router/router"; 
import App from "./App.vue";  // Componente raíz


/**
 * Inicializa la aplicación principal de Vue.
 *
 * @param {void}
 * @returns {Promise<void>} Retorna una promesa que resuelve al montar la app.
 *
 * @description
 * Esta función realiza las siguientes tareas:
 * 1. Verifica si existe una sesión persistente en Supabase mediante `obtenerUsuarioLogueado()`.
 * 2. Crea la instancia raíz de la aplicación Vue con `createApp(App)`.
 * 3. Registra el router en la aplicación.
 * 4. Monta la app en el elemento con id="app" del DOM.
 */
async function initApp() {

	const currentUser = await obtenerUsuarioLogueado();
	console.log("Usuario logueado:", currentUser);

	const app = createApp(App);


	app.use(router);


	app.mount('#app');
}

initApp();