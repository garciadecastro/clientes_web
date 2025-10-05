<script>
import AppH1 from '../components/AppH1.vue';
import { register } from '../services/auth';

export default {
  name: 'Register',
  components: { AppH1 },

  data() {
    return {
      user: {
        display_name: '', 
        email: '',
        password: '',
      },
      loading: false,
    }
  },

  methods: {
    /**
     * Maneja el envío del formulario de registro.
     * @async
     * @returns {Promise<void>}
     */
    async handleSubmit() {
      try {
        this.loading = true;
        await register(this.user.email, this.user.password, this.user.display_name);
        this.$router.push('/mi-perfil');
      } catch (error) {
        console.error("[registro.vue] Error en registro:", error);
        alert("Error: " + error.message);
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
      <AppH1>Unite a Gambito Club</AppH1>
      <p class="text-sm text-gray-400 mt-2">
        Una red social para los verdaderos amantes del ajedrez ♟️
      </p>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
        
        <!-- Display Name -->
        <div class="mb-4">
          <label for="display_name" class="block mb-1">Nombre de jugador</label>
          <input 
            type="text"
            id="display_name"
            v-model="user.display_name"
            class="w-full p-2 border border-gray-300 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
            placeholder="ej: peoncito123"
            required
          />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block mb-1">Email</label>
          <input 
            type="email"
            id="email"
            v-model="user.email"
            autocomplete="email"
            class="w-full p-2 border border-gray-300 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
            placeholder="tuemail@ejemplo.com"
            required
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label for="password" class="block mb-1">Contraseña</label>
          <input 
            type="password"
            id="password"
            v-model="user.password"
            autocomplete="new-password"
            class="w-full p-2 border border-gray-300 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
            placeholder="••••••••"
            required
          />
        </div>

        <!-- Botón -->
        <button 
          type="submit" 
          class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 w-full font-bold"
          :disabled="loading"
        >
          {{ loading ? "Registrando..." : "Registrarme y jugar" }}
        </button>
      </form>

      <!-- Nota -->
      <p class="text-xs text-gray-500 mt-6 text-center">
        Cada jugada comienza con un movimiento. Bienvenido al tablero de Gambito Club ♟️
      </p>
    </div>
  </main>
</template>
