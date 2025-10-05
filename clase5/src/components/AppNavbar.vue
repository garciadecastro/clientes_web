<script>
import { logout, subscribeToAuthStateChanges } from '../services/auth';
import { obtenerPerfilUsuarioLogueado } from '../services/perfiles-usuarios';

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
    async handleLogout() {
      await logout();  // aseguramos que la sesión se cierre antes de redirigir
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

        // Si el perfil tiene display_name, lo usamos
        // Si no, mostramos el email
        this.user.display_name = profile?.display_name || newUserState.email;
      } else {
        this.user = { id: null, email: null, display_name: null }; // limpiamos por completo
      }
    });
  }
}
</script>

<template>
   <!-- Navbar oscuro con detalles dorados -->
   <nav
      class="bg-gradient-to-r from-gray-900 to-black border-b border-yellow-600 shadow-lg sticky top-0 z-50"
      >
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
            <ul
               class="flex flex-col md:flex-row gap-3 md:gap-8 text-center items-center"
               >
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
                        Club Chat
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
                        to="/miembros"
                        class="text-gray-200 hover:text-yellow-400 px-3 py-2 rounded-lg transition-colors font-medium"
                        >
                        Miembros
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
                     <!-- Nombre o email -->
                     <span class="text-yellow-400 font-medium">
                     {{ user.display_name }}
                     </span>
                     <!-- Botón de logout -->
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