<script>
import AppH1 from '../components/AppH1.vue';
import { login } from '../services/auth.js';

export default {
  name: 'Login',
  components: { AppH1 },

  data() {
    return {
      user: {
        identifier: '', // puede ser email o username
        password: '',
      },
      loading: false,
    }
  },

  methods: {
    /**
     * Maneja el envío del formulario de login.
     */
    async handleSubmit() {
      try {
        this.loading = true;
        await login(this.user.identifier, this.user.password); // usamos identifier
        
        this.$router.push('/mi-perfil');
      } catch (error) {
        console.error("[Login.vue] Error en login:", error);
        
      }
      this.loading = false;
    }
  }
}
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-gray-100">
    <div class="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg border border-yellow-600">
      <!-- Título -->
      <AppH1>Ingresar a Gambito Club</AppH1>
      <p class="text-sm text-gray-400 mt-2">
        Continuá tu partida en la red social de ajedrez ♟️
      </p>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium mb-1">Email - Usuario/a</label>
            <input 
              type="text" 
              id="identifier"
              v-model="user.identifier"
              autocomplete="username"
              class="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" 
              placeholder="tuemail@ejemplo.com o peoncito123"
            />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium mb-1">Contraseña</label>
          <input 
            type="password"
            id="password"
            v-model="user.password"
            autocomplete="current-password"
            class="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" 
            placeholder="••••••••"
          />
        </div>

        <!-- Botón -->
        <button 
          type="submit" 
          class="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? "Ingresando..." : "Ingresar" }}
        </button>
      </form>

      <!-- Nota temática -->
      <p class="text-xs text-gray-500 mt-6 text-center">
        El tablero ya está listo, ¡solo falta tu próximo movimiento! ♟️
      </p>
    </div>
  </main>
</template>
