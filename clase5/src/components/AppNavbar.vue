<script>
import { logout, subscribeToAuthStateChanges } from '../services/auth';
import { obtenerPerfilUsuarioLogueado } from '../services/user_profiles';

export default {
  name: 'AppNavbar',

  data() {
    return {
      user: {
        id: null,
        email: null,
        display_name: null,
      },
    }
  },

  methods: {
    /**
     * Cierra sesión y redirige al login.
     */
    handleLogout() {
      logout();
      this.$router.push('/ingresar');
    }
  },

  async mounted() {
    // Nos suscribimos a cambios de autenticación
    subscribeToAuthStateChanges(async newUserState => {
      this.user = { ...this.user, ...newUserState };

      // Si hay usuario autenticado, buscamos su perfil
      if (newUserState.id) {
        const profile = await obtenerPerfilUsuarioLogueado();
        this.user.display_name = profile?.display_name || null;
      } else {
        this.user.display_name = null;
      }
    });
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
                  {{ user.display_name ?? user.email }}
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
