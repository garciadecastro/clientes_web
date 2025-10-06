<script>
/**
 * @file App.vue
 * @description Componente raíz de la aplicación Gambito Club.
 * Contiene la estructura principal de la interfaz: barra de navegación,
 * contenido dinámico (RouterView) y pie de página.
 */

import AppFooter from "./components/AppFooter.vue";
import AppNavbar from "./components/AppNavbar.vue";

export default {
  name: "App",

  /**
   *  Componentes hijos utilizados en esta vista principal.
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
      <!--
        RouterView representa el componente asociado a la ruta activa.
        Es el área donde se cargan dinámicamente las distintas vistas.
      -->
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>
