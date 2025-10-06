<script>
/**
 * @file AppFooter.vue
 * @description Pie de página principal de la aplicación Gambito Club.
 * Muestra la autoría del proyecto y un enlace al perfil de GitHub del desarrollador.
 */
export default {
  name: "AppFooter",
};
</script>

<template>
  
  <footer class="bg-gray-900 text-gray-300 border-t border-yellow-500 py-4">
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-3 text-sm">
      
      <!-- Texto principal -->
      <p>
        © 2025 Gambito Club · Creado por Carlos García de Castro · Da Vinci
      </p>

      <!-- Enlace a GitHub -->
      <a 
        href="https://github.com/garciadecastro"
        target="_blank"
        class="text-yellow-400 hover:text-yellow-300 font-medium"
      >
        GitHub
      </a>

    </div>
  </footer>
</template>
