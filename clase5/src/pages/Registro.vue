<script>
/**
 * @file Registro.vue
 * @description Pantalla donde un nuevo usuario puede crear su cuenta en Gambito Club.
 * Incluye el formulario con nombre de usuario, email y contraseña.
 */

import AppH1 from "../components/AppH1.vue";
import { registrarUsuario } from "../services/auth";

export default {
  name: "Registro",
  components: { AppH1 },

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
     * Envía el formulario para crear un nuevo usuario en Supabase.
     * Si el registro es exitoso, redirige al perfil del jugador.
     * Muestra un mensaje de error en caso de fallar.
     */
    async enviarRegistro() {
      try {
        this.loading = true;
        await registrarUsuario(
          this.user.email,
          this.user.password,
          this.user.display_name
        );
        this.$router.push("/mi-perfil");
      } catch (error) {
        console.error("Error al registrar usuario:", error);
        alert("No se pudo completar el registro: " + error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<template>
  <main
    class="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-6"
  >
    <div class="w-full max-w-sm bg-gray-800 border border-gray-700 rounded p-6">
      <!-- Título -->
      <AppH1>Unite a Gambito Club</AppH1>
      <p class="text-sm text-gray-400 text-center mb-5">
        La red social para los amantes del ajedrez ♟️
      </p>

      <!-- Formulario de registro -->
      <form @submit.prevent="enviarRegistro" class="space-y-4">
        <!-- Nombre de usuario -->
        <div>
          <label for="display_name" class="block text-sm text-yellow-500 mb-1">
            Nombre de usuario
          </label>
          <input
            type="text"
            id="display_name"
            v-model="user.display_name"
            class="w-full p-2 bg-gray-900 text-gray-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="peon_DaVinci"
            required
          />
        </div>

        <!-- Correo -->
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
            placeholder="peon_davinci@clientesweb.com"
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

        <!-- Botón de acción -->
        <button
          type="submit"
          class="w-full bg-yellow-600 text-black font-medium py-2 rounded hover:bg-yellow-500 disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? "Registrando..." : "Registrarme" }}
        </button>
      </form>

      <p class="text-xs text-gray-500 mt-5 text-center">
        Bienvenido/a al tablero de Gambito Club.
      </p>
    </div>
  </main>
</template>
