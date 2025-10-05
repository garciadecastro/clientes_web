<script>
import { supabase } from '../services/supabase';
import { subscribeToAuthStateChanges } from '../services/auth';

let unsubscribeFromAuth = () => {};

export default {
  name: 'MuroPublicaciones',
  props: {
    userId: { type: String, required: true }, // dueño del muro
  },

  data() {
    return {
      publicaciones: [],
      nuevoTexto: '',
      cargando: false,
      userReacciones: {},
      authUser: null,
    };
  },

  methods: {
    async cargarPublicaciones() {
      // 📜 1. Cargar publicaciones con info del autor
      const { data: posts, error } = await supabase
        .from('muro_publicaciones')
        .select('id, usuario_id, contenido, created_at, perfiles_usuarios(display_name)')
        .eq('usuario_id', this.userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al cargar muro:', error);
        return;
      }

      // 📊 2. Contar reacciones
      const postsWithLikes = await Promise.all(
        posts.map(async post => {
          const { data: reacciones } = await supabase
            .from('muro_reacciones')
            .select('tipo')
            .eq('publicacion_id', post.id);

          const likes = reacciones?.filter(r => r.tipo === 'like').length || 0;
          const dislikes = reacciones?.filter(r => r.tipo === 'dislike').length || 0;

          return {
            ...post,
            likes,
            dislikes,
            autor: post.perfiles_usuarios?.display_name || 'Jugador anónimo',
          };
        })
      );

      this.publicaciones = postsWithLikes;

      // 🧍‍♂️ 3. Reacciones del usuario logueado
      if (this.authUser?.id) {
        const { data: userReacts } = await supabase
          .from('muro_reacciones')
          .select('publicacion_id, tipo')
          .eq('usuario_id', this.authUser.id);

        this.userReacciones = {};
        userReacts?.forEach(r => (this.userReacciones[r.publicacion_id] = r.tipo));
      }
    },

    async publicar() {
      if (!this.nuevoTexto.trim()) return;
      this.cargando = true;

      const { error } = await supabase
        .from('muro_publicaciones')
        .insert([{ usuario_id: this.authUser.id, contenido: this.nuevoTexto.trim() }]); // 👈 usa el usuario actual

      if (error) alert('Error al publicar.');
      else {
        this.nuevoTexto = '';
        await this.cargarPublicaciones();
      }

      this.cargando = false;
    },

    async reaccionar(publicacionId, tipo) {
      if (!this.authUser?.id) {
        alert('Debes iniciar sesión para reaccionar.');
        return;
      }

      const userId = this.authUser.id;
      const reaccionActual = this.userReacciones[publicacionId];

      if (reaccionActual === tipo) {
        await supabase
          .from('muro_reacciones')
          .delete()
          .eq('publicacion_id', publicacionId)
          .eq('usuario_id', userId);
        delete this.userReacciones[publicacionId];
      } else if (!reaccionActual) {
        await supabase
          .from('muro_reacciones')
          .insert([{ publicacion_id: publicacionId, usuario_id: userId, tipo }]);
        this.userReacciones[publicacionId] = tipo;
      } else {
        await supabase
          .from('muro_reacciones')
          .update({ tipo })
          .eq('publicacion_id', publicacionId)
          .eq('usuario_id', userId);
        this.userReacciones[publicacionId] = tipo;
      }

      await this.cargarPublicaciones();
    },
  },

  async mounted() {
    unsubscribeFromAuth = subscribeToAuthStateChanges(async newUser => {
      this.authUser = newUser;
    });

    await this.cargarPublicaciones();
  },

  unmounted() {
    unsubscribeFromAuth();
  },
};
</script>

<template>
  <section class="mt-10 text-center">
    <h3 class="text-lg font-bold text-yellow-500 mb-4">Muro de publicaciones</h3>

    <!-- Formulario solo para el propio perfil -->
    <form v-if="authUser?.id === userId" @submit.prevent="publicar" class="mb-6">
      <textarea
        v-model="nuevoTexto"
        rows="3"
        placeholder="Escribí algo..."
        class="w-full p-3 rounded-lg bg-gray-900 border border-yellow-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      ></textarea>
      <button
        type="submit"
        :disabled="cargando"
        class="mt-3 px-5 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow disabled:opacity-50"
      >
        {{ cargando ? 'Publicando...' : 'Publicar' }}
      </button>
    </form>

    <!-- Lista de publicaciones -->
    <ul class="space-y-4 text-left">
      <li
        v-for="post in publicaciones"
        :key="post.id"
        class="bg-gray-800 border border-yellow-600 rounded-lg p-4 shadow"
      >
        <p class="text-yellow-500 font-semibold mb-1">
          {{ post.autor }} dice:
        </p>
        <p class="text-gray-100 whitespace-pre-line">{{ post.contenido }}</p>
        <p class="text-xs text-gray-400 mt-2 text-right">
          {{ new Date(post.created_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) }}
        </p>

        <!-- Reacciones -->
        <div class="flex items-center justify-end mt-3 gap-3 text-sm">
          <button
            @click="reaccionar(post.id, 'like')"
            :class="[
              'px-3 py-1 rounded font-semibold transition',
              userReacciones[post.id] === 'like'
                ? 'bg-yellow-600 text-black'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600',
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
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600',
            ]"
          >
            👎 {{ post.dislikes }}
          </button>
        </div>
      </li>
    </ul>

    <p v-if="!publicaciones.length" class="text-gray-400 italic mt-4">
      Todavía no hay publicaciones.
    </p>
  </section>
</template>
