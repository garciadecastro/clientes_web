/**
 * @file vite.config.js
 * @description Configuración principal de Vite para el proyecto Gambito Club.
 * Incluye la integración con Vue 3 y Tailwind CSS.
 * 
 */

import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default {
  plugins: [vue(), tailwindcss()],
};
