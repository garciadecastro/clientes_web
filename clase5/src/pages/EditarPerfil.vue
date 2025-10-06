<script>
/**
 * @file EditarPerfil.vue
 * @description Componente que permite al usuario autenticado editar su información personal.
 * Incluye campos de texto, biografía, país, ELO, título y avatar.
 */

import AppH1 from "../components/AppH1.vue";
import AppLoader from "../components/AppLoader.vue";
import {
  subscribeToAuthStateChanges,
  actualizarUsuarioAutentificado,
} from "../services/auth";

let unsubscribeFromAuth = () => {};

export default {
  name: "EditarPerfil",
  components: { AppH1, AppLoader },

  /**
   * @returns {Object}
   * @property {Object} perfilFormulario - Datos editables del usuario.
   * @property {Boolean} loading - Indica si hay una operación en curso.
   */
  data() {
    return {
      perfilFormulario: {
        email: "",
        display_name: "",
        bio: "",
        elo: "",
        country: "",
        title: "",
        avatar_url: "",
      },
      loading: false,
    };
  },

  methods: {
    /**
     * Guarda los cambios realizados en el perfil del usuario.
     * @async
     * @function guardarPerfil
     * @returns {Promise<void>}
     */
    async guardarPerfil() {
      try {
        this.loading = true;
        await actualizarUsuarioAutentificado(this.perfilFormulario);
        alert("Perfil actualizado correctamente.");
        this.$router.push("/mi-perfil");
      } catch (error) {
        console.error("[EditarPerfil.vue] Error al guardar perfil:", error);
        alert("Error al actualizar el perfil. Intenta nuevamente.");
      }
      this.loading = false;
    },
  },

  /**
   * Al montar, suscribe al estado de autenticación para precargar los datos del perfil.
   * @returns {void}
   */
  mounted() {
    unsubscribeFromAuth = subscribeToAuthStateChanges((newUserState) => {
      this.perfilFormulario = {
        email: newUserState.email,
        display_name: newUserState.display_name,
        bio: newUserState.bio,
        elo: newUserState.elo,
        country: newUserState.country,
        title: newUserState.title,
        avatar_url: newUserState.avatar_url,
      };
    });
  },

  /**
   * Cancela la suscripción de autenticación al desmontar el componente.
   * @returns {void}
   */
  unmounted() {
    unsubscribeFromAuth();
  },
};
</script>

<template>
  <main class="min-h-screen bg-gray-900 text-gray-100 p-6 flex justify-center">
    <div class="w-full max-w-xl bg-gray-800 border border-gray-700 rounded p-6">
      <AppH1>Editar mi perfil</AppH1>
      <p class="text-sm text-gray-400 text-center mb-5">
        Actualizá tu información personal en Gambito Club ♟️
      </p>

      <form @submit.prevent="guardarPerfil" class="space-y-5">
        <!-- Avatar -->
        <div class="flex flex-col items-center">
          <div
            v-if="perfilFormulario.avatar_url"
            class="w-24 h-24 rounded-full overflow-hidden"
          >
            <img
              :src="perfilFormulario.avatar_url"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="w-20 h-20 rounded-full bg-yellow-600 flex items-center justify-center text-3xl font-bold text-black"
          >
            {{
              perfilFormulario.display_name
                ? perfilFormulario.display_name.charAt(0).toUpperCase()
                : "?"
            }}
          </div>

          <label for="avatar_url" class="text-sm text-gray-400 mt-3">
            URL del avatar
          </label>
          <input
            id="avatar_url"
            type="text"
            v-model="perfilFormulario.avatar_url"
            class="w-full mt-2 p-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="https://..."
          />
        </div>

        <!-- Nombre -->
        <div>
          <label for="display_name" class="block text-sm text-yellow-500 mb-1">
            Nombre visible
          </label>
          <input
            id="display_name"
            type="text"
            v-model="perfilFormulario.display_name"
            class="w-full p-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <!-- Biografía -->
        <div>
          <label for="bio" class="block text-sm text-yellow-500 mb-1">
            Biografía
          </label>
          <textarea
            id="bio"
            rows="3"
            v-model="perfilFormulario.bio"
            class="w-full p-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Contanos algo sobre vos..."
          ></textarea>
        </div>

        <!-- País -->
        <div>
          <label for="country" class="block text-sm text-yellow-500 mb-1">
            País
          </label>
          <input
            id="country"
            type="text"
            v-model="perfilFormulario.country"
            class="w-full p-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Ej: Argentina"
          />
        </div>

        <!-- ELO -->
        <div>
          <label for="elo" class="block text-sm text-yellow-500 mb-1">
            ELO
          </label>
          <input
            id="elo"
            type="number"
            v-model="perfilFormulario.elo"
            class="w-full p-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Tu puntuación ELO"
          />
        </div>

        <!-- Título -->
        <div>
          <label for="title" class="block text-sm text-yellow-500 mb-1">
            Título
          </label>
          <input
            id="title"
            type="text"
            v-model="perfilFormulario.title"
            class="w-full p-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Ej: Maestro, Gran Maestro..."
          />
        </div>

        <!-- Botón -->
        <div class="flex justify-center">
          <button
            type="submit"
            class="px-5 py-2 rounded bg-yellow-600 text-black font-medium hover:bg-yellow-500 disabled:opacity-50"
            :disabled="loading"
          >
            <template v-if="!loading">Guardar cambios</template>
            <template v-else><AppLoader /> Guardando...</template>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
