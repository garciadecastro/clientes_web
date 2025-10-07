<script>
/**
 * @file App.vue
 * @description Componente raíz de la aplicación "Gambito Club".
 * Define la estructura principal: barra de navegación, contenido dinámico y pie de página.
 */

import AppFooter from './components/AppFooter.vue';
import AppNavbar from './components/AppNavbar.vue';

export default {
  name: 'App',

  /**
   * Componentes reutilizados en la vista principal.
   */
  components: {
    AppNavbar,
    AppFooter,
  },
};
</script>

<template>
  <div>
    <AppNavbar />

    <main class="container bg-yellow-50 border border-gray-200 p-4 rounded-md mx-auto">
      <!-- RouterView muestra el componente de la ruta activa, por ejemplo el perfil de un miembro o la lista de aperturas -->
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>
