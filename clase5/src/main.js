/**
 * @file main.js
 * @description Archivo principal que arranca la aplicación "Gambito Club".
 * Se encarga de crear la instancia de Vue, conectar el router
 * y verificar si hay un usuario con sesión activa en Supabase antes de montar la app.
 */

import './style.css';
import { createApp } from 'vue';
import { obtenerUsuarioActual } from './services/auth.js';
import router from './router/router';
import App from './App.vue';

/**
 * Inicia la aplicación principal de Vue.
 * 
 * Verifica si existe una sesión previa en Supabase
 * y luego monta la app en el elemento con id="app".
 */
async function iniciarAplicacion() {
  const usuarioActual = await obtenerUsuarioActual();
  console.log('Usuario autenticado:', usuarioActual);

  const app = createApp(App);
  app.use(router);
  app.mount('#app');
}

// Ejecuta la función al cargar el archivo
iniciarAplicacion();
