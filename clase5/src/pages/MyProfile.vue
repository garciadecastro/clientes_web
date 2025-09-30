<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges } from '../services/auth';
import { getCurrentUserProfile } from '../services/user_profiles'; // 👈 nuevo servicio

export default {
  name: 'MyProfile',
  components: { AppH1 },

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
      },
    };
  },

  async mounted() {
    // 1. Subscribirse a cambios de auth (email, id)
    subscribeToAuthStateChanges(async (newUserState) => {
      if (!newUserState.id) {
        this.user = { id: null, email: null };
        return;
      }

      // 2. Cargar datos completos desde user_profiles
      const profile = await getCurrentUserProfile();
      this.user = { ...this.user, ...newUserState, ...profile };
    });
  }
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-6 flex justify-center">
    <div class="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-lg border border-yellow-600">
      
      <!-- Título -->
      <AppH1>Mi Perfil</AppH1>
      <p class="text-sm text-gray-400 mt-2 text-center">
        Tu tablero personal en Gambito Club ♟️
      </p>

      <!-- Sección de usuario -->
      <section class="mt-6 space-y-6">
        <!-- Avatar -->
        <div class="flex flex-col items-center">
          <div v-if="user.avatar_url"
               class="w-24 h-24 rounded-full overflow-hidden shadow-lg">
            <img :src="user.avatar_url" alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <div v-else
               class="w-20 h-20 rounded-full bg-yellow-600 flex items-center justify-center text-3xl font-bold text-black shadow-lg">
            {{ user.display_name ? user.display_name.charAt(0).toUpperCase() : '?' }}
          </div>

          <h2 class="mt-3 text-xl font-semibold text-yellow-500">
            {{ user.display_name ?? 'Jugador Anónimo' }}
          </h2>
          <p class="text-gray-400 text-sm">{{ user.bio ?? 'Sin biografía aún...' }}</p>
        </div>

        <!-- Información del perfil -->
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <dt class="text-sm font-bold text-yellow-500">Email</dt>
            <dd class="text-gray-200">{{ user.email }}</dd>
          </div>
          <div>
            <dt class="text-sm font-bold text-yellow-500">País</dt>
            <dd class="text-gray-200">{{ user.country ?? 'Sin especificar...' }}</dd>
          </div>
          <div>
            <dt class="text-sm font-bold text-yellow-500">Elo</dt>
            <dd class="text-gray-200">{{ user.elo ?? 'No asignado' }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </main>
</template>
