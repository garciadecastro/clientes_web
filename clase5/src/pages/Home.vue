<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges } from '../services/auth';


export default {
  name: 'Home',
  components: { AppH1 },

  data() {
    return {
      user: { id: null },
      unsubscribe: () => {},
    };
  },

  mounted() {
    this.unsubscribe = subscribeToAuthStateChanges((newUser) => {
      this.user = newUser;

      // Si hay usuario logueado, redirige al perfil
      if (this.user.id) {
        this.$router.push('/mi-perfil');
      }
    });
  },

  unmounted() {
    this.unsubscribe();
  },
};
</script>

<template>
  <main class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-gray-100 p-6">
    <div class="text-center max-w-2xl">
      <!-- Título principal -->
      <AppH1>Bienvenidos a Gambito Club</AppH1>
      <p class="text-lg text-gray-400 mt-2">
        La red social donde cada jugada cuenta ♟️
      </p>

      <!-- Frase inspiradora -->
      <blockquote class="mt-6 text-xl italic font-semibold text-yellow-500">
        “El ajedrez es el gimnasio de la mente.” – Blaise Pascal
      </blockquote>

      <!-- Botones de acción -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="/ingresar"
          class="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition-colors shadow-lg"
        >
          Ingresar
        </a>
        <a 
          href="/crear-cuenta"
          class="bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-6 rounded-lg transition-colors shadow-lg border border-yellow-600"
        >
          Crear cuenta
        </a>
      </div>
    </div>
  </main>
</template>
