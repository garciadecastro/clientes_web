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
        rel="noopener"
        class="flex items-center gap-2 text-sm md:text-base font-semibold text-yellow-500 hover:text-yellow-400 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
             fill="currentColor" class="w-5 h-5">
          <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.53-1.36-1.3-1.73-1.3-1.73-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.22 1.8 1.22 1.05 1.8 2.75 1.28 3.42.98.1-.76.41-1.28.74-1.58-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.2-3.07-.12-.29-.52-1.45.11-3.03 0 0 .97-.31 3.18 1.17a11.1 11.1 0 0 1 5.8 0c2.2-1.48 3.17-1.17 3.17-1.17.63 1.58.23 2.74.11 3.03.75.8 1.2 1.82 1.2 3.07 0 4.41-2.68 5.39-5.24 5.67.42.37.8 1.1.8 2.22 0 1.6-.01 2.88-.01 3.27 0 .31.21.67.8.56A10.51 10.51 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5z"/>
        </svg>
        GitHub
      </a>

    </div>
  </footer>
</template>
