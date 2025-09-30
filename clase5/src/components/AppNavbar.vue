<script>
import { logout, subscribeToAuthStateChanges } from '../services/auth';

// Exportación del componente. Este nombre se usa en App.vue.
export default {
  name: 'AppNavbar',

  data() {
    return {
      user: {
        id: null,
        email: null,
      },
    }
  },

  methods: {
  handleLogout() {
    logout();

    // Redireccionamos al login.
    // Esto requiere usar el objeto Router de Vue Router, que lo tenemos en la propiedad especial $router.
    this.$router.push('/ingresar');
  }
},

  mounted() {
        // Nos suscribimos para recibir los datos del estado de autenticación.
        // Cada vez que cambie el estado de autenticación, se ejecutará la función que le pasamos.
        // Esa función recibe como parámetro el nuevo estado de autenticación.
        subscribeToAuthStateChanges(newUserState => this.user = newUserState);
    }

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

          <!-- Si NO hay usuario logueado -->
          <template v-if="user.id === null">
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
          </template>

          <!-- Si hay usuario logueado -->
          <template v-else>
              <li>
                <RouterLink 
                  to="/chat" 
                  class="text-gray-200 hover:text-yellow-400 px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  Chat general
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
                  to="/mi-perfil" 
                  class="text-gray-200 hover:text-yellow-400 px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  Mi perfil
                </RouterLink>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-yellow-400 font-medium">
                  {{ user.username }}
                </span>
                <button 
                  @click.prevent="handleLogout"
                  class="text-gray-200 hover:text-red-400 px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  Cerrar sesión
                </button>
              </li>
          </template>
        </ul>

      </div>
    </div>
  </nav>
</template>
