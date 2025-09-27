<script>
// Exportación del componente. Este nombre se usa en App.vue.
export default {
  name: 'AppNavbar',
}
</script>

<template>
  <!-- Navbar oscuro con detalles dorados -->
  <nav class="bg-gradient-to-r from-gray-900 to-black border-b border-yellow-600 shadow-lg">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center justify-between py-4">
        
        <!-- Logo / Nombre del sitio -->
        <RouterLink 
          to="/" 
          class="text-yellow-500 text-2xl font-extrabold tracking-wide hover:text-yellow-400 transition-colors mb-3 md:mb-0"
        >
          Gambito Club ♟️
        </RouterLink>

        <!-- Links de navegación -->
        <ul class="flex flex-col md:flex-row gap-3 md:gap-8 text-center">
          <li>
            <RouterLink 
              to="/" 
              class="text-gray-200 hover:text-yellow-400 px-3 py-2 rounded-lg transition-colors font-medium"
            >
              Home
            </RouterLink>
          </li>
          <li>
            <RouterLink 
              to="/chat" 
              class="text-gray-200 hover:text-yellow-400 px-3 py-2 rounded-lg transition-colors font-medium"
            >
              Chat global
            </RouterLink>
          </li>
          <li>
            <RouterLink 
              to="/aperturas" 
              class="text-gray-200 hover:text-yellow-400 px-3 py-2 rounded-lg transition-colors font-medium"
            >
              Aperturas
            </RouterLink>
          </li>
          <li>
            <RouterLink 
              to="/ingresar" 
              class="text-gray-200 hover:text-yellow-400 px-3 py-2 rounded-lg transition-colors font-medium"
            >
              Ingresar
            </RouterLink>
          </li>
          <li>
            <RouterLink 
              to="/crear-cuenta" 
              class="text-gray-200 hover:text-yellow-400 px-3 py-2 rounded-lg transition-colors font-medium"
            >
              Crear cuenta
            </RouterLink>
          </li>
        </ul>

      </div>
    </div>
  </nav>
</template>
