<script>
import AppH1 from '../components/AppH1.vue';
import { supabase } from '../services/supabase';

export default {
  name: 'MiembroClub',
  components: { AppH1 },

  data() {
    return {
      miembro: null,
      loading: true,
      error: null,
    };
  },

  async mounted() {
    const miembroId = this.$route.params.id;

    try {
      const { data, error } = await supabase
        .from('perfiles_usuarios')
        .select('*')
        .eq('id', miembroId)
        .single();

      if (error) throw error;
      this.miembro = data;
    } catch (err) {
      console.error('[MiembroClub.vue] Error al cargar perfil:', err.message);
      this.error = 'No se pudo cargar el perfil del jugador.';
    } finally {
      this.loading = false;
    }
  },
};
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-6 flex justify-center">
    <div v-if="miembro && !loading" class="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-lg border border-yellow-600">
      <AppH1>{{ miembro.display_name || 'Jugador desconocido' }}</AppH1>
      <p class="text-sm text-gray-400 mt-2 text-center">Miembro del Gambito Club ♟️</p>

      <section class="mt-6 space-y-6">
        <div class="flex flex-col items-center">
          <div v-if="miembro.avatar_url" class="w-24 h-24 rounded-full overflow-hidden shadow-lg">
            <img :src="miembro.avatar_url" alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-20 h-20 rounded-full bg-yellow-600 flex items-center justify-center text-3xl font-bold text-black shadow-lg">
            {{ miembro.display_name ? miembro.display_name.charAt(0).toUpperCase() : '?' }}
          </div>

          <h2 class="mt-3 text-xl font-semibold text-yellow-500">{{ miembro.display_name }}</h2>
          <p class="text-gray-400 text-sm">{{ miembro.bio || 'Sin biografía disponible...' }}</p>
        </div>

        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <dt class="text-sm font-bold text-yellow-500">Elo</dt>
            <dd class="text-gray-200">{{ miembro.elo || 'No asignado' }}</dd>
          </div>
          <div>
            <dt class="text-sm font-bold text-yellow-500">Título</dt>
            <dd class="text-gray-200">{{ miembro.title || 'Sin título' }}</dd>
          </div>
          <div>
            <dt class="text-sm font-bold text-yellow-500">País</dt>
            <dd class="text-gray-200">{{ miembro.country || 'Sin especificar...' }}</dd>
          </div>
        </dl>
      </section>
    </div>

    <p v-if="loading" class="text-center text-gray-400 mt-8">Cargando perfil...</p>
    <p v-if="error" class="text-center text-red-500 mt-8">{{ error }}</p>
  </main>
</template>
