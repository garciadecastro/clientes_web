<script>
/**
 * @file Home.vue
 * @description Página de inicio de Gambito Club.
 * Si el usuario está autenticado, redirige automáticamente a su perfil.
 */

import AppH1 from "../components/AppH1.vue";
import { escucharCambiosDeAuth } from "../services/auth";

export default {
  name: "Home",
  components: { AppH1 },

  /**
   * @returns {Object}
   * @property {Object} usuario - Datos del usuario autenticado.
   * @property {Function} desuscribir - Función para cancelar la suscripción a la autenticación.
   */
  data() {
    return {
      usuario: { id: null },
      desuscribir: () => {},
    };
  },

  /**
   * Al montar, se suscribe al estado de autenticación y redirige
   * al perfil si el usuario ya está autenticado.
   * @returns {void}
   */
  mounted() {
    this.desuscribir = escucharCambiosDeAuth((nuevoUsuario) => {
      this.usuario = nuevoUsuario;
      if (this.usuario.id) {
        this.$router.push("/mi-perfil");
      }
    });
  },

  /**
   * Cancela la suscripción a la autenticación al desmontar el componente.
   * @returns {void}
   */
  unmounted() {
    this.desuscribir();
  },
};
</script>

<template>
  <main class="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-6">
    <div class="text-center max-w-xl">
      <AppH1>Bienvenidos a Gambito Club desde otra rama</AppH1>
      <p class="text-base text-gray-400 mt-2">
        La red social donde cada jugada cuenta ♟️
      </p>

      <blockquote class="mt-6 text-lg italic font-medium text-yellow-500">
        “El ajedrez es el gimnasio de la mente.” – Blaise Pascal
      </blockquote>

      <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/ingresar"
          class="bg-yellow-600 text-black font-medium py-2 px-5 rounded hover:bg-yellow-500"
        >
          Ingresar
        </a>
        <a
          href="/crear-cuenta"
          class="bg-gray-800 text-gray-100 font-medium py-2 px-5 rounded border border-gray-600 hover:bg-gray-700"
        >
          Crear cuenta
        </a>
      </div>
    </div>
  </main>
</template>
