<script>
import AppH1 from '../components/AppH1.vue';

export default {
  name: 'Register',
  components: { AppH1 },
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
      <form class="mt-6 space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Usuario</label>
          <input 
            type="text" 
            class="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" 
            placeholder="Ej: MagnusCarlsen"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            class="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" 
            placeholder="tuemail@ejemplo.com"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Contraseña</label>
          <input 
            type="password" 
            class="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" 
            placeholder="••••••••"
          />
        </div>

        <!-- Botón -->
        <button 
          type="submit" 
          class="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-colors"
        >
          ¡Registrarme y jugar!
        </button>
      </form>

      <!-- Nota temática -->
      <p class="text-xs text-gray-500 mt-6 text-center">
        Cada jugada comienza con un movimiento. Bienvenido al tablero de Gambito Club ♟️
      </p>
    </div>
  </main>
</template>
