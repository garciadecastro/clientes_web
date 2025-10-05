<script>
export default {
  name: 'AppFooter',
}
</script>

<template>
  <!-- Footer integrado a la estética de Gambito Club -->
  <footer class="mt-auto bg-gradient-to-r from-gray-900 to-black border-t border-yellow-600 text-gray-300 py-6">
    <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      
      <!-- Texto principal -->
      <p class="text-sm md:text-base font-medium">
        © 2025 Gambito Club · Creado por Carlos García de Castro · Da Vinci
      </p>

      <!-- Enlace a GitHub -->
      <a 
        href="https://github.com/garciadecastro"
        target="_blank"
        class="flex items-center gap-2 text-sm md:text-base font-semibold text-yellow-500 hover:text-yellow-400 transition-colors"
      >
        GitHub
      </a>

    </div>
  </footer>
</template>
