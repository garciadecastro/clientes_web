<script>
/**
 * @file Login.vue
 * @description Vista que permite a los usuarios autenticarse en Gambito Club.
 * El usuario puede ingresar con su correo electrónico o nombre de jugador.
 */

import AppH1 from "../components/AppH1.vue";
import { login } from "../services/auth.js";

export default {
  name: "Login",
  components: { AppH1 },

  /**
   * @returns {Object}
   * @property {Object} user - Datos ingresados en el formulario de inicio de sesión.
   * @property {String} user.identifier - Email o nombre de usuario.
   * @property {String} user.password - Contraseña.
   * @property {Boolean} loading - Indica si se está procesando el inicio de sesión.
   */
  data() {
    return {
      user: {
        identifier: "",
        password: "",
      },
      loading: false,
    };
  },

  methods: {
    /**
     * Envía las credenciales del usuario y gestiona el inicio de sesión.
     * @async
     * @function handleSubmit
     * @returns {Promise<void>}
     */
    async handleSubmit() {
      try {
        this.loading = true;
        await login(this.user.identifier, this.user.password);
        this.$router.push("/mi-perfil");
      } catch (error) {
        console.error("[Login.vue] Error en login:", error);
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
      <AppH1>Ingresar a Gambito Club</AppH1>
      <p class="text-sm text-gray-400 text-center mb-5">
        Continuá tu partida en la red social de ajedrez ♟️
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Identificador -->
        <div>
          <label for="identifier" class="block text-sm text-yellow-500 mb-1">
            Email o Nombre de jugador
          </label>
          <input
            type="text"
            id="identifier"
            v-model="user.identifier"
            autocomplete="username"
            class="w-full p-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="tuemail@ejemplo.com o peoncito123"
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
            autocomplete="current-password"
            class="w-full p-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
          {{ loading ? "Ingresando..." : "Ingresar" }}
        </button>
      </form>

      <p class="text-xs text-gray-500 mt-5 text-center">
        El tablero ya está listo, ¡solo falta tu próximo movimiento! ♟️
      </p>
    </div>
  </main>
</template>
