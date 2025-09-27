// Archivo de configuración de Vite.
// Siempre debe exportar un objeto de configuración por defecto.
//
// Instalé el plugin de Vue con:
//   npm install -D @vitejs/plugin-vue
// El flag "-D" significa que es solo para desarrollo.
//
// Diferencia rápida:
// - "dependencies": se necesitan siempre para que la app funcione.
// - "devDependencies": solo en desarrollo o testing.

import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default {
  // La propiedad "plugins" guarda los plugins que usa el proyecto.
  plugins: [vue(), tailwindcss()],
}
