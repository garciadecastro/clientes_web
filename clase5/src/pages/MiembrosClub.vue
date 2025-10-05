<script>
import AppH1 from '../components/AppH1.vue';
import { supabase } from '../services/supabase';

export default {
  name: 'MiembrosClub',
  components: { AppH1 },

  data() {
    return {
      miembros: [],
      loading: true,
      error: null,
    };
  },

  async mounted() {
    try {
      const { data, error } = await supabase
        .from('perfiles_usuarios')
        .select('id, display_name, country, title, avatar_url')
        .order('display_name', { ascending: true });

      if (error) throw error;
      this.miembros = data;
    } catch (err) {
      console.error('[MiembrosClub.vue] Error al cargar miembros:', err.message);
      this.error = 'Error al cargar la lista de miembros.';
    } finally {
      this.loading = false;
    }
  },
};
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-6">
    <AppH1>Miembros del Gambito Club</AppH1>
    <p class="text-sm text-gray-400 mb-6 text-center">
      Explorá a los jugadores registrados ♟️
    </p>

    <section
      v-if="!loading && !error"
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
    >
      <article
        v-for="miembro in miembros"
        :key="miembro.id"
        class="bg-gray-800 border border-yellow-600 rounded-xl p-4 flex flex-col items-center text-center shadow hover:shadow-yellow-700/30 transition cursor-pointer"
        @click="$router.push(`/miembro/${miembro.id}`)"
      >
        <div v-if="miembro.avatar_url" class="w-20 h-20 rounded-full overflow-hidden mb-3">
          <img :src="miembro.avatar_url" alt="Avatar" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-20 h-20 rounded-full bg-yellow-600 flex items-center justify-center text-2xl font-bold text-black mb-3">
          {{ miembro.display_name ? miembro.display_name.charAt(0).toUpperCase() : '?' }}
        </div>

        <h2 class="text-yellow-500 font-semibold">{{ miembro.display_name || 'Jugador Anónimo' }}</h2>
        <p class="text-sm text-gray-400">{{ miembro.title || 'Sin título' }}</p>
        <p class="text-xs text-gray-500">{{ miembro.country || 'País desconocido' }}</p>
      </article>
    </section>

    <p v-if="loading" class="text-center text-gray-400 mt-8">Cargando miembros...</p>
    <p v-if="error" class="text-center text-red-500 mt-8">{{ error }}</p>
  </main>
</template>
