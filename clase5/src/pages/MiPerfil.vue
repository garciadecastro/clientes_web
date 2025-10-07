<script>
/**
 * @file MiPerfil.vue
 * @description Muestra el perfil del usuario autenticado en Gambito Club.
 * Incluye información personal, detalles del perfil, aperturas favoritas y muro de publicaciones.
 */

import AppH1 from "../components/AppH1.vue";
import { supabase } from "../services/supabase";
import { escucharCambiosDeAuth } from "../services/auth";
import MuroPublicaciones from "../components/MuroPublicaciones.vue";

let desuscribirDeAuth = () => {};

export default {
  name: "MiPerfil",
  components: { AppH1, MuroPublicaciones },

  /**
   * @returns {Object}
   * @property {Object} user - Datos del usuario autenticado.
   * @property {Array} aperturasFavoritasData - Aperturas favoritas cargadas desde la base de datos.
   * @property {Boolean} mostrarDetalles - Controla el despliegue del panel de detalles.
   */
  data() {
    return {
      user: {
        id: null,
        email: null,
        display_name: null,
        bio: null,
        elo: null,
        country: null,
        avatar_url: null,
        aperturas_favoritas: [],
      },
      aperturasFavoritasData: [],
      mostrarDetalles: false,
    };
  },

  /**
   * Suscribe el estado del usuario autenticado y carga sus aperturas favoritas.
   * @async
   * @returns {Promise<void>}
   */
  async mounted() {
    desuscribirDeAuth = escucharCambiosDeAuth(async (nuevoUsuario) => {
      this.user = nuevoUsuario;

      if (
        this.user.aperturas_favoritas &&
        typeof this.user.aperturas_favoritas === "string"
      ) {
        try {
          this.user.aperturas_favoritas = JSON.parse(
            this.user.aperturas_favoritas
          );
        } catch {
          this.user.aperturas_favoritas = [];
        }
      }

      if (this.user.aperturas_favoritas?.length > 0) {
        const { data, error } = await supabase
          .from("aperturas")
          .select("id, nombre")
          .in("id", this.user.aperturas_favoritas);

        if (!error && data) {
          this.aperturasFavoritasData = data;
        } else {
          console.error("Error al cargar aperturas favoritas:", error);
        }
      }
    });
  },

  /**
   * Cancela la suscripción de autenticación al desmontar el componente.
   * @returns {void}
   */
  unmounted() {
    desuscribirDeAuth();
  },
};
</script>

<template>
  <main class="min-h-screen bg-gray-900 text-gray-100 p-6 flex justify-center">
    <div class="w-full max-w-xl bg-gray-800 border border-gray-700 rounded p-6">
      <AppH1>Mi Perfil</AppH1>
      <p class="text-sm text-gray-400 text-center mb-5">
        Tu tablero personal en Gambito Club ♟️
      </p>

      <!-- Información del usuario -->
      <section class="space-y-6">
        <div class="flex flex-col items-center">
          <div v-if="user.avatar_url" class="w-24 h-24 rounded-full overflow-hidden">
            <img :src="user.avatar_url" alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <div
            v-else
            class="w-20 h-20 rounded-full bg-yellow-600 flex items-center justify-center text-3xl font-bold text-black"
          >
            {{ user.display_name ? user.display_name.charAt(0).toUpperCase() : "?" }}
          </div>

          <h2 class="mt-3 text-lg font-semibold text-yellow-500">
            {{ user.display_name ?? "Jugador Anónimo" }}
          </h2>
          <p class="text-gray-400 text-sm text-center">
            {{ user.bio ?? "Sin biografía aún..." }}
          </p>
        </div>

        <!-- Panel desplegable -->
        <div>
          <button
            @click="mostrarDetalles = !mostrarDetalles"
            class="w-full flex justify-between items-center px-4 py-2 bg-gray-900 border border-gray-700 rounded text-yellow-500 font-medium"
          >
            <span>Ver detalles del perfil</span>
            <span>{{ mostrarDetalles ? "▲" : "▼" }}</span>
          </button>

          <div v-if="mostrarDetalles" class="mt-4 bg-gray-900 border border-gray-700 rounded p-4">
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <dt class="text-sm font-bold text-yellow-500">Email</dt>
                <dd class="text-gray-200">{{ user.email }}</dd>
              </div>
              <div>
                <dt class="text-sm font-bold text-yellow-500">País</dt>
                <dd class="text-gray-200">{{ user.country ?? "Sin especificar" }}</dd>
              </div>
              <div>
                <dt class="text-sm font-bold text-yellow-500">ELO</dt>
                <dd class="text-gray-200">{{ user.elo ?? "No asignado" }}</dd>
              </div>
              <div>
                <dt class="text-sm font-bold text-yellow-500">Título</dt>
                <dd class="text-gray-200">{{ user.title ?? "Sin título" }}</dd>
              </div>
              <div>
                <dt class="text-sm font-bold text-yellow-500">Creado el</dt>
                <dd class="text-gray-200">
                  {{ user.created_at ? new Date(user.created_at).toLocaleDateString() : "Desconocido" }}
                </dd>
              </div>
            </dl>

            <!-- Aperturas favoritas -->
            <div v-if="aperturasFavoritasData.length" class="mt-6 text-center">
              <h3 class="text-lg font-bold text-yellow-500 mb-2">
                Aperturas favoritas
              </h3>
              <ul class="space-y-1 text-gray-200">
                <li
                  v-for="apertura in aperturasFavoritasData"
                  :key="apertura.id"
                >
                  {{ apertura.nombre }}
                </li>
              </ul>
            </div>
            <p v-else class="text-center text-gray-400 italic mt-4">
              Aún no seleccionaste tus aperturas favoritas.
            </p>
          </div>
        </div>

        <!-- Botón editar -->
        <div class="flex justify-center">
          <router-link
            to="/mi-perfil/editar"
            class="px-5 py-2 rounded bg-yellow-600 text-black font-medium hover:bg-yellow-500"
          >
            Editar perfil
          </router-link>
        </div>

        <!-- Muro de publicaciones -->
        <MuroPublicaciones v-if="user.id" :userId="user.id" />
      </section>
    </div>
  </main>
</template>
