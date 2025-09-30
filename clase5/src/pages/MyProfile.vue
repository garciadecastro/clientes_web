<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges } from '../services/auth';

export default {
  name: 'MyProfile',
  components: { AppH1 },

  data() {
    return {
      user: {
        id: null,
        email: null,
        username: null,
        bio: null,
        career: null,
      },
    };
  },

  mounted() {
    subscribeToAuthStateChanges(newUserState => this.user = newUserState);
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
        <!-- Avatar con inicial -->
        <div class="flex flex-col items-center">
          <div class="w-20 h-20 rounded-full bg-yellow-600 flex items-center justify-center text-3xl font-bold text-black shadow-lg">
            {{ user.username ? user.username.charAt(0).toUpperCase() : '?' }}
          </div>
          <h2 class="mt-3 text-xl font-semibold text-yellow-500">
            {{ user.username ?? 'Jugador Anónimo' }}
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
            <dt class="text-sm font-bold text-yellow-500">Carrera</dt>
            <dd class="text-gray-200">{{ user.career ?? 'Sin especificar...' }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </main>
</template>
