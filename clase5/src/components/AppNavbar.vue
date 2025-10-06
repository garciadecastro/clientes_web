<script>
/**
 * @file AppNavbar.vue
 * @description Barra de navegación principal de Gambito Club.
 * Muestra enlaces diferentes según si el usuario está autenticado o no.
 */

import { logout, subscribeToAuthStateChanges } from "../services/auth";
import { obtenerPerfilUsuarioLogueado } from "../services/perfiles-usuarios";

export default {
  name: "AppNavbar",

  /**
   * @returns {Object} Datos reactivos del componente.
   * @property {Object} user - Información del usuario autenticado.
   * @property {String|null} user.id - ID del usuario o null si no hay sesión.
   * @property {String|null} user.email - Correo electrónico del usuario.
   * @property {String|null} user.display_name - Nombre visible del usuario.
   */
  data() {
    return {
      user: {
        id: null,
        email: null,
        display_name: null,
      },
    };
  },

  methods: {
    /**
     * Cierra la sesión actual y redirige al login.
     * @async
     * @function handleLogout
     * @param {void}
     * @returns {Promise<void>}
     */
    async handleLogout() {
      await logout();
      this.$router.push("/ingresar");
    },
  },

  /**
   * Suscribe el componente a los cambios en la autenticación
   * y actualiza la información del usuario en tiempo real.
   * @async
   * @returns {Promise<void>}
   */
  async mounted() {
    subscribeToAuthStateChanges(async (newUserState) => {
      this.user = { ...this.user, ...newUserState };

      if (newUserState.id) {
        const profile = await obtenerPerfilUsuarioLogueado();
        this.user.display_name = profile?.display_name || newUserState.email;
      } else {
        this.user = { id: null, email: null, display_name: null };
      }
    });
  },
};
</script>

<template>
  <!-- Barra superior fija -->
  <nav class="bg-gray-900 text-gray-100 border-b border-yellow-500">
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center p-3">
      
      <!-- Logo -->
      <RouterLink
        to="/"
        class="text-yellow-400 text-xl font-semibold hover:text-yellow-300 mb-2 md:mb-0"
      >
        Gambito Club
      </RouterLink>

      <!-- Enlaces -->
      <ul class="flex flex-col md:flex-row gap-2 items-center text-sm">
        <!-- Si no hay usuario logueado -->
        <template v-if="user.id === null">
          <li>
            <RouterLink to="/ingresar" class="hover:text-yellow-300 px-2 py-1 rounded">
              Ingresar
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/crear-cuenta" class="hover:text-yellow-300 px-2 py-1 rounded">
              Crear cuenta
            </RouterLink>
          </li>
        </template>

        <!-- Si hay usuario logueado -->
        <template v-else>
          <li>
            <RouterLink
              to="/publicaciones"
              class="hover:text-yellow-300 px-2 py-1 rounded"
            >
              Publicaciones
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/chat" class="hover:text-yellow-300 px-2 py-1 rounded">
              Chat
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/aperturas" class="hover:text-yellow-300 px-2 py-1 rounded">
              Aperturas
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/miembros" class="hover:text-yellow-300 px-2 py-1 rounded">
              Miembros
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/mi-perfil" class="hover:text-yellow-300 px-2 py-1 rounded">
              Mi perfil
            </RouterLink>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-yellow-400 font-medium">{{ user.display_name }}</span>
            <button
              @click.prevent="handleLogout"
              class="hover:text-red-400 px-2 py-1 rounded"
            >
              Cerrar sesión
            </button>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>
