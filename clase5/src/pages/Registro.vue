<script>
/**
 * @file Registro.vue
 * @description Vista de registro de nuevos usuarios en Gambito Club.
 * Permite crear una cuenta con nombre de jugador, correo electrónico y contraseña.
 */

import AppH1 from "../components/AppH1.vue";
import { register } from "../services/auth";

export default {
  name: "Registro",
  components: { AppH1 },

  /**
   * @returns {Object}
   * @property {Object} user - Datos ingresados en el formulario.
   * @property {String} user.display_name - Nombre de jugador.
   * @property {String} user.email - Correo electrónico del usuario.
   * @property {String} user.password - Contraseña del usuario.
   * @property {Boolean} loading - Estado del envío del formulario.
   */
  data() {
    return {
      user: {
        display_name: "",
        email: "",
        password: "",
      },
      loading: false,
    };
  },

  methods: {
    /**
     * Envía los datos del formulario para registrar al nuevo usuario.
     * @async
     * @function handleSubmit
     * @returns {Promise<void>}
     */
    async handleSubmit() {
      try {
        this.loading = true;
        await register(this.user.email, this.user.password, this.user.display_name);
        this.$router.push("/mi-perfil");
      } catch (error) {
        console.error("[Registro.vue] Error en registro:", error);
        alert("Error: " + error.message);
      }
      this.loading = false;
    },
  },
};
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-6">
    <div class="w-full max-w-sm bg-gray-800 border border-gray-700 rounded p-6">
      <AppH1>Unite a Gambito Club</AppH1>
      <p class="text-sm text-gray-400 text-center mb-5">
        Una red social para los amantes del ajedrez ♟️
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nombre de jugador -->
        <div>
          <label for="display_name" class="block text-sm text-yellow-500 mb-1">
            Nombre de jugador
          </label>
          <input
            type="text"
            id="display_name"
            v-model="user.display_name"
            class="w-full p-2 bg-gray-900 text-gray-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="peoncito123"
            required
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm text-yellow-500 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            v-model="user.email"
            autocomplete="email"
            class="w-full p-2 bg-gray-900 text-gray-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="tuemail@ejemplo.com"
            required
          />
        </div>

        <!-- Contraseña -->
        <div>
          <label for="password" class="block text-sm text-yellow-500 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            v-model="user.password"
            autocomplete="new-password"
            class="w-full p-2 bg-gray-900 text-gray-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="••••••••"
            required
          />
        </div>

        <!-- Botón -->
        <button
          type="submit"
          class="w-full bg-yellow-600 text-black font-medium py-2 rounded hover:bg-yellow-500 disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? "Registrando..." : "Registrarme" }}
        </button>
      </form>

      <p class="text-xs text-gray-500 mt-5 text-center">
        Cada jugada comienza con un movimiento. Bienvenido al tablero de Gambito Club ♟️
      </p>
    </div>
  </main>
</template>
