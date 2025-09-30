<script>
import AppH1 from '../components/AppH1.vue';
import { register } from '../services/auth';

export default {
  name: 'Register',
  components: { AppH1 },

  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
      },
      loading: false,
    }
  },

  methods: {
    /**
     * Maneja el envío del formulario de registro.
     */
    async handleSubmit() {
      try {
        this.loading = true;
        await register(this.user.email, this.user.password, this.user.username); // 👈 pasamos username también
        alert("Usuario registrado con éxito.");
      } catch (error) {
        console.error("[Register.vue] Error en registro:", error);
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

      <!-- Formulario estilo profesor -->
      <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
        <div class="mb-4">
          <label for="username" class="block mb-1">Nombre de usuario</label>
          <input 
            type="text"
            id="username"
            v-model="user.username"
            class="w-full p-2 border border-gray-300 rounded text-black"
            placeholder="ej: peoncito123"
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block mb-1">Email</label>
          <input 
            type="email"
            id="email"
            v-model="user.email"
            autocomplete="email"
            class="w-full p-2 border border-gray-300 rounded text-black"
            placeholder="tuemail@ejemplo.com"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block mb-1">Contraseña</label>
          <input 
            type="password"
            id="password"
            v-model="user.password"
            autocomplete="new-password"
            class="w-full p-2 border border-gray-300 rounded text-black"
            placeholder="••••••••"
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

      <!-- Nota temática -->
      <p class="text-xs text-gray-500 mt-6 text-center">
        Cada jugada comienza con un movimiento. Bienvenido al tablero de Gambito Club ♟️
      </p>
    </div>
  </main>
</template>
