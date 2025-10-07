<script>
/**
 * @file MuroPublicaciones.vue
 * @description Componente encargado de mostrar y gestionar las publicaciones de un usuario.
 * Permite crear nuevas publicaciones (si el muro pertenece al usuario autenticado)
 * y reaccionar con "like" o "dislike".
 */

import { supabase } from "../services/supabase";
import { escucharCambiosDeAuth } from "../services/auth";

let desuscribirDeAuth = () => {};

export default {
  name: "MuroPublicaciones",

  /**
   * @property {String} userId - ID del usuario dueño del muro.
   */
  props: {
    userId: { type: String, required: true },
  },

  /**
   * Datos reactivos del componente.
   * @returns {Object}
   * @property {Array} publicaciones - Lista de publicaciones.
   * @property {String} nuevoTexto - Texto de la nueva publicación.
   * @property {Boolean} cargando - Estado de carga.
   * @property {Object} userReacciones - Reacciones del usuario actual.
   * @property {Object|null} authUser - Usuario autenticado.
   */
  data() {
    return {
      publicaciones: [],
      nuevoTexto: "",
      cargando: false,
      userReacciones: {},
      authUser: null,
    };
  },

  methods: {
    /**
     * Carga las publicaciones del usuario junto con las reacciones.
     * @async
     * @function cargarPublicaciones
     * @returns {Promise<void>}
     */
    async cargarPublicaciones() {
      const { data: posts, error } = await supabase
        .from("muro_publicaciones")
        .select(
          "id, usuario_id, contenido, created_at, perfiles_usuarios(display_name)"
        )
        .eq("usuario_id", this.userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar muro:", error);
        return;
      }

      const postsWithLikes = await Promise.all(
        posts.map(async (post) => {
          const { data: reacciones } = await supabase
            .from("muro_reacciones")
            .select("tipo")
            .eq("publicacion_id", post.id);

          const likes = reacciones?.filter((r) => r.tipo === "like").length || 0;
          const dislikes =
            reacciones?.filter((r) => r.tipo === "dislike").length || 0;

          return {
            ...post,
            likes,
            dislikes,
            autor: post.perfiles_usuarios?.display_name || "Jugador anónimo",
          };
        })
      );

      this.publicaciones = postsWithLikes;

      if (this.authUser?.id) {
        const { data: userReacts } = await supabase
          .from("muro_reacciones")
          .select("publicacion_id, tipo")
          .eq("usuario_id", this.authUser.id);

        this.userReacciones = {};
        userReacts?.forEach(
          (r) => (this.userReacciones[r.publicacion_id] = r.tipo)
        );
      }
    },

    /**
     * Publica un nuevo mensaje en el muro.
     * @async
     * @function publicar
     * @returns {Promise<void>}
     */
    async publicar() {
      if (!this.nuevoTexto.trim()) return;
      this.cargando = true;

      const { error } = await supabase.from("muro_publicaciones").insert([
        { usuario_id: this.authUser.id, contenido: this.nuevoTexto.trim() },
      ]);

      if (error) {
        alert("Error al publicar.");
      } else {
        this.nuevoTexto = "";
        await this.cargarPublicaciones();
      }

      this.cargando = false;
    },

    /**
     * Registra o actualiza una reacción (like/dislike) del usuario.
     * @async
     * @function reaccionar
     * @param {String} publicacionId - ID de la publicación.
     * @param {String} tipo - Tipo de reacción ("like" o "dislike").
     * @returns {Promise<void>}
     */
    async reaccionar(publicacionId, tipo) {
      if (!this.authUser?.id) {
        alert("Debes iniciar sesión para reaccionar.");
        return;
      }

      const userId = this.authUser.id;
      const reaccionActual = this.userReacciones[publicacionId];

      if (reaccionActual === tipo) {
        await supabase
          .from("muro_reacciones")
          .delete()
          .eq("publicacion_id", publicacionId)
          .eq("usuario_id", userId);
        delete this.userReacciones[publicacionId];
      } else if (!reaccionActual) {
        await supabase
          .from("muro_reacciones")
          .insert([{ publicacion_id: publicacionId, usuario_id: userId, tipo }]);
        this.userReacciones[publicacionId] = tipo;
      } else {
        await supabase
          .from("muro_reacciones")
          .update({ tipo })
          .eq("publicacion_id", publicacionId)
          .eq("usuario_id", userId);
        this.userReacciones[publicacionId] = tipo;
      }

      await this.cargarPublicaciones();
    },
  },

  /**
   * Al montar el componente, se suscribe a cambios de autenticación
   * y carga las publicaciones iniciales.
   * @async
   * @returns {Promise<void>}
   */
  async mounted() {
    desuscribirDeAuth = escucharCambiosDeAuth(async (nuevoUsuario) => {
      this.authUser = nuevoUsuario;
    });

    await this.cargarPublicaciones();
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
  <section class="mt-8 text-center">
    <h3 class="text-lg font-bold text-yellow-500 mb-3">Muro de publicaciones</h3>

    <!-- Formulario para publicar -->
    <form v-if="authUser?.id === userId" @submit.prevent="publicar" class="mb-5">
      <textarea
        v-model="nuevoTexto"
        rows="3"
        placeholder="Escribí algo..."
        class="w-full p-2 border border-gray-700 bg-gray-900 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
      ></textarea>
      <button
        type="submit"
        :disabled="cargando"
        class="mt-2 px-4 py-1 bg-yellow-600 text-black rounded hover:bg-yellow-500 disabled:opacity-50"
      >
        {{ cargando ? "Publicando..." : "Publicar" }}
      </button>
    </form>

    <!-- Lista de publicaciones -->
    <ul class="space-y-3 text-left">
      <li
        v-for="post in publicaciones"
        :key="post.id"
        class="bg-gray-800 border border-gray-700 rounded p-3"
      >
        <p class="text-yellow-400 font-semibold mb-1">
          {{ post.autor }} dice:
        </p>
        <p class="text-gray-100 whitespace-pre-line">{{ post.contenido }}</p>
        <p class="text-xs text-gray-400 mt-1 text-right">
          {{
            new Date(post.created_at).toLocaleString("es-ES", {
              dateStyle: "short",
              timeStyle: "short",
            })
          }}
        </p>

        <!-- Reacciones -->
        <div class="flex items-center justify-end mt-2 gap-2 text-sm">
          <button
            @click="reaccionar(post.id, 'like')"
            :class="[
              'px-3 py-1 rounded font-semibold',
              userReacciones[post.id] === 'like'
                ? 'bg-yellow-600 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
            ]"
          >
            👍 {{ post.likes }}
          </button>

          <button
            @click="reaccionar(post.id, 'dislike')"
            :class="[
              'px-3 py-1 rounded font-semibold',
              userReacciones[post.id] === 'dislike'
                ? 'bg-red-600 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
            ]"
          >
            👎 {{ post.dislikes }}
          </button>
        </div>
      </li>
    </ul>

    <p v-if="!publicaciones.length" class="text-gray-500 italic mt-4">
      Todavía no hay publicaciones.
    </p>
  </section>
</template>
