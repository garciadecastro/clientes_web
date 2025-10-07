<script>
/**
 * @file PublicacionesMiembros.vue
 * @description Vista que reúne todas las publicaciones de los usuarios del Gambito Club.
 * Actúa como un muro general donde cualquiera puede ver los mensajes del resto.
 * También permite dejar reacciones (likes o dislikes) en cada publicación.
 */

import { supabase } from "../services/supabase";
import { escucharCambiosDeAuth } from "../services/auth";
import AppH1 from "../components/AppH1.vue";

// Variable para guardar la función que desuscribe los cambios de auth.
let desuscribirDeAuth = () => {};

export default {
  name: "PublicacionesMiembros",
  components: { AppH1 },

 data() {
    return {
      publicaciones: [],
      userReacciones: {},
      authUser: null,
      cargando: false,
    };
  },

  methods: {
    /**
     * Carga todas las publicaciones con los nombres de los autores
     * y las ordena por fecha de creación (más recientes primero).
     * Cuenta los likes y dislikes de cada una.
     */
    async cargarPublicaciones() {
      this.cargando = true;

      const { data: posts, error } = await supabase
        .from("muro_publicaciones")
        .select("id, usuario_id, contenido, created_at, perfiles_usuarios(display_name)")
        .order("created_at", { ascending: false });
        // 'ascending: false' para que las más nuevas aparezcan primero

      if (error) {
        console.error("Error al cargar publicaciones:", error);
        this.cargando = false;
        return;
      }

      // Para cada publicación, contamos cuántos likes y dislikes tiene
      const postsProcesados = await Promise.all(
        posts.map(async (post) => {
          const { data: reacciones } = await supabase
            .from("muro_reacciones")
            .select("tipo")
            .eq("publicacion_id", post.id);

          const likes = reacciones?.filter((r) => r.tipo === "like").length || 0;
          const dislikes = reacciones?.filter((r) => r.tipo === "dislike").length || 0;

          return {
            ...post,
            autor: post.perfiles_usuarios?.display_name || "Usuario anónimo",
            likes,
            dislikes,
          };
        })
      );

      this.publicaciones = postsProcesados;

      // Si el usuario está logueado, traemos sus reacciones previas
      if (this.authUser?.id) {
        const { data: userReacts } = await supabase
          .from("muro_reacciones")
          .select("publicacion_id, tipo")
          .eq("usuario_id", this.authUser.id);

        this.userReacciones = {};
        userReacts?.forEach((r) => (this.userReacciones[r.publicacion_id] = r.tipo));
      }

      this.cargando = false;
    },

    /**
     * Permite al usuario dejar o quitar una reacción (like o dislike)
     * sobre una publicación. Si repite la misma, la borra.
     */
    async reaccionar(publicacionId, tipo) {
      if (!this.authUser?.id) {
        alert("Tenés que iniciar sesión para reaccionar.");
        return;
      }

      const userId = this.authUser.id;
      const reaccionActual = this.userReacciones[publicacionId];

      if (reaccionActual === tipo) {
        // Si el usuario repite la misma reacción, la quitamos
        await supabase
          .from("muro_reacciones")
          .delete()
          .eq("publicacion_id", publicacionId)
          .eq("usuario_id", userId);
        delete this.userReacciones[publicacionId];
      } else if (!reaccionActual) {
        // Si no había reaccionado, insertamos una nueva
        await supabase
          .from("muro_reacciones")
          .insert([{ publicacion_id: publicacionId, usuario_id: userId, tipo }]);
        this.userReacciones[publicacionId] = tipo;
      } else {
        // Si cambia de like a dislike o viceversa, actualizamos el tipo
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
   * Se ejecuta cuando el componente se monta.
   * Suscribe a los cambios de autenticación y carga las publicaciones iniciales.
   */
  async mounted() {
    desuscribirDeAuth = escucharCambiosDeAuth(async (nuevoUsuario) => {
      this.authUser = nuevoUsuario;
      await this.cargarPublicaciones();
    });
  },

  /**
   * Se ejecuta cuando el componente se desmonta.
   * Cancela la suscripción.
   */
  unmounted() {
    desuscribirDeAuth();
  },
};
</script>

<template>
  <main class="min-h-screen bg-gray-900 text-gray-100 p-6">
    <AppH1>Publicaciones de los miembros</AppH1>
    <p class="text-sm text-gray-400 text-center mb-6">
      Todas las publicaciones del club, ordenadas por fecha
    </p>

    <!-- Listado de publicaciones -->
    <section v-if="!cargando && publicaciones.length" class="space-y-4 max-w-3xl mx-auto">
      <article
        v-for="post in publicaciones"
        :key="post.id"
        class="bg-gray-800 border border-yellow-600 p-4 rounded-lg shadow"
      >
        <p class="text-yellow-500 font-semibold mb-1">{{ post.autor }} dice:</p>
        <p class="text-gray-100 whitespace-pre-line">{{ post.contenido }}</p>
        <p class="text-xs text-gray-400 mt-2 text-right">
          {{
            new Date(post.created_at).toLocaleString("es-ES", {
              dateStyle: "short",
              timeStyle: "short",
            })
          }}
        </p>

        <!-- Botones de reacción -->
        <div class="flex items-center justify-end mt-3 gap-3 text-sm">
          <button
            @click="reaccionar(post.id, 'like')"
            :class="[
              'px-3 py-1 rounded font-semibold transition',
              userReacciones[post.id] === 'like'
                ? 'bg-yellow-600 text-black'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            ]"
          >
            👍 {{ post.likes }}
          </button>

          <button
            @click="reaccionar(post.id, 'dislike')"
            :class="[
              'px-3 py-1 rounded font-semibold transition',
              userReacciones[post.id] === 'dislike'
                ? 'bg-red-600 text-black'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            ]"
          >
            👎 {{ post.dislikes }}
          </button>
        </div>
      </article>
    </section>

    <p v-if="cargando" class="text-center text-gray-400 mt-6">Cargando publicaciones...</p>
    <p v-if="!cargando && !publicaciones.length" class="text-center text-gray-500 mt-6">
      No hay publicaciones disponibles.
    </p>
  </main>
</template>
