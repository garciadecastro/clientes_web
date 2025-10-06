<script>
/**
 * @file MiembroClub.vue
 * @description Muestra el perfil público de un miembro del Gambito Club.
 * Incluye datos básicos, avatar, información adicional y su muro de publicaciones.
 */

import AppH1 from "../components/AppH1.vue";
import { supabase } from "../services/supabase";
import MuroPublicaciones from "../components/MuroPublicaciones.vue";

export default {
  name: "MiembroClub",
  components: { AppH1, MuroPublicaciones },

  /**
   * @returns {Object}
   * @property {Object|null} miembro - Datos del jugador cargados desde la base.
   * @property {Boolean} loading - Indica si los datos están cargándose.
   * @property {String|null} error - Mensaje de error en caso de fallo.
   * @property {Boolean} showInfo - Controla la visibilidad de la información detallada.
   */
  data() {
    return {
      miembro: null,
      loading: true,
      error: null,
      showInfo: false,
    };
  },

  /**
   * Carga los datos del miembro según el ID recibido en la ruta.
   * @async
   * @returns {Promise<void>}
   */
  async mounted() {
    const miembroId = this.$route.params.id;

    try {
      const { data, error } = await supabase
        .from("perfiles_usuarios")
        .select("*")
        .eq("id", miembroId)
        .single();

      if (error) throw error;
      this.miembro = data;
    } catch (err) {
      console.error("[MiembroClub.vue] Error al cargar perfil:", err.message);
      this.error = "No se pudo cargar el perfil del jugador.";
    } finally {
      this.loading = false;
    }
  },
};
</script>

<template>
  <main class="min-h-screen bg-gray-900 text-gray-100 p-6 flex justify-center">
    <div
      v-if="miembro && !loading"
      class="w-full max-w-xl bg-gray-800 border border-gray-700 rounded p-6"
    >
      <AppH1>{{ miembro.display_name || "Jugador desconocido" }}</AppH1>
      <p class="text-sm text-gray-400 text-center mb-4">
        Miembro del Gambito Club ♟️
      </p>

      <!-- Avatar y nombre -->
      <div class="flex flex-col items-center">
        <div
          v-if="miembro.avatar_url"
          class="w-24 h-24 rounded-full overflow-hidden"
        >
          <img
            :src="miembro.avatar_url"
            alt="Avatar"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="w-20 h-20 rounded-full bg-yellow-600 flex items-center justify-center text-3xl font-bold text-black"
        >
          {{
            miembro.display_name
              ? miembro.display_name.charAt(0).toUpperCase()
              : "?"
          }}
        </div>

        <h2 class="mt-3 text-lg font-semibold text-yellow-500">
          {{ miembro.display_name }}
        </h2>
        <p class="text-gray-400 text-sm text-center">
          {{ miembro.bio || "Sin biografía disponible..." }}
        </p>
      </div>

      <!-- Botón de información -->
      <div class="text-center mt-5">
        <button
          @click="showInfo = !showInfo"
          class="text-yellow-500 font-medium underline"
        >
          {{ showInfo ? "Ocultar información" : "Ver información detallada" }}
        </button>
      </div>

      <!-- Información desplegable -->
      <dl v-if="showInfo" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <div>
          <dt class="text-sm font-bold text-yellow-500">ELO</dt>
          <dd class="text-gray-200">{{ miembro.elo || "No asignado" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-bold text-yellow-500">Título</dt>
          <dd class="text-gray-200">{{ miembro.title || "Sin título" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-bold text-yellow-500">País</dt>
          <dd class="text-gray-200">
            {{ miembro.country || "Sin especificar" }}
          </dd>
        </div>
      </dl>

      <!-- Muro del usuario -->
      <MuroPublicaciones :userId="miembro.id" class="mt-8" />
    </div>

    <p v-if="loading" class="text-center text-gray-400 mt-6">
      Cargando perfil...
    </p>
    <p v-if="error" class="text-center text-red-500 mt-6">{{ error }}</p>
  </main>
</template>
