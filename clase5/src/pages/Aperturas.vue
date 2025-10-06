<script>
/**
 * @file Aperturas.vue
 * @description Vista que muestra la lista de aperturas de ajedrez disponibles.
 * Permite marcar o desmarcar aperturas como favoritas para el usuario autenticado.
 */

import AppH1 from "../components/AppH1.vue";
import { supabase } from "../services/supabase";
import { subscribeToAuthStateChanges } from "../services/auth";

let unsubscribeFromAuth = () => {};

export default {
  name: "Aperturas",
  components: { AppH1 },

  /**
   * @returns {Object}
   * @property {Array} aperturas - Lista de aperturas cargadas desde la base.
   * @property {Object} user - Datos del usuario autenticado.
   * @property {String|null} user.id - ID del usuario autenticado.
   * @property {Array} user.aperturas_favoritas - IDs de las aperturas marcadas como favoritas.
   */
  data() {
    return {
      aperturas: [],
      user: {
        id: null,
        aperturas_favoritas: [],
      },
    };
  },

  methods: {
    /**
     * Marca o desmarca una apertura como favorita.
     * @async
     * @function elegirFavorita
     * @param {String} aperturaId - ID de la apertura seleccionada.
     * @returns {Promise<void>}
     */
    async elegirFavorita(aperturaId) {
      if (!this.user.id) {
        alert("Debes iniciar sesión para guardar tus aperturas favoritas.");
        return;
      }

      if (!Array.isArray(this.user.aperturas_favoritas)) {
        this.user.aperturas_favoritas = [];
      }

      const yaFavorita = this.user.aperturas_favoritas.includes(aperturaId);
      const nuevasFavoritas = yaFavorita
        ? this.user.aperturas_favoritas.filter((id) => id !== aperturaId)
        : [...this.user.aperturas_favoritas, aperturaId];

      const { error } = await supabase
        .from("perfiles_usuarios")
        .update({ aperturas_favoritas: nuevasFavoritas })
        .eq("id", this.user.id);

      if (error) {
        console.error("Error al actualizar favoritas:", error);
        alert("Error al actualizar tus aperturas favoritas.");
      } else {
        this.user.aperturas_favoritas = nuevasFavoritas;
      }
    },
  },

  /**
   * Carga las aperturas y suscribe el estado del usuario autenticado.
   * @async
   * @returns {Promise<void>}
   */
  async mounted() {
    unsubscribeFromAuth = subscribeToAuthStateChanges((newUser) => {
      this.user = newUser;
    });

    const { data, error } = await supabase
      .from("aperturas")
      .select("*")
      .order("popularidad", { ascending: false });

    if (!error) this.aperturas = data;
  },

  /**
   * Cancela la suscripción a los cambios de autenticación al desmontar el componente.
   * @returns {void}
   */
  unmounted() {
    unsubscribeFromAuth();
  },
};
</script>

<template>
  <main class="min-h-screen bg-gray-900 text-gray-100 p-6">
    <AppH1>Aperturas de Ajedrez</AppH1>
    <p class="text-gray-400 text-center mb-5">
      Explorá y marcá tus aperturas favoritas ♟️
    </p>

    <ul class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
      <li
        v-for="apertura in aperturas"
        :key="apertura.id"
        class="bg-gray-800 border border-gray-700 rounded p-3"
      >
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-bold text-yellow-500">
            {{ apertura.nombre }}
          </h2>
          <button
            @click="elegirFavorita(apertura.id)"
            :class="[
              'px-2 py-1 rounded text-sm font-medium',
              user.aperturas_favoritas?.includes(apertura.id)
                ? 'bg-yellow-600 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
            ]"
          >
            {{ user.aperturas_favoritas?.includes(apertura.id)
              ? '★ Favorita'
              : '☆ Agregar' }}
          </button>
        </div>

        <p class="text-sm text-gray-300 mb-1">
          {{ apertura.descripcion }}
        </p>
        <p class="text-xs text-gray-400">
          Código ECO: {{ apertura.eco_code || '—' }}
        </p>
        <p class="text-xs text-gray-500 mt-1">
          Popularidad: {{ apertura.popularidad }}
        </p>
      </li>
    </ul>
  </main>
</template>
