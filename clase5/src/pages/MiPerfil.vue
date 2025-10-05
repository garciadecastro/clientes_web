<script>
import AppH1 from '../components/AppH1.vue';
import { supabase } from '../services/supabase';
import { subscribeToAuthStateChanges } from '../services/auth';
import MuroPublicaciones from '../components/MuroPublicaciones.vue';
import '../style.css'


let unsubscribeFromAuth = () => {};

export default {
  name: 'MyProfile',
  components: { AppH1,  MuroPublicaciones },

  data() {
    return {
      user: {
        id: null,
        email: null,
        display_name: null,
        bio: null,
        elo: null,
        country: null,
        avatar_url: null,
        aperturas_favoritas: [],
      },
       aperturasFavoritasData: [], // nombres reales
       mostrarDetalles: false,
    };
  },

  async mounted() {
    unsubscribeFromAuth = subscribeToAuthStateChanges(async newUserState => {
      this.user = newUserState;

      // Si el campo viene como string, convertirlo
      if (this.user.aperturas_favoritas && typeof this.user.aperturas_favoritas === 'string') {
        try {
          this.user.aperturas_favoritas = JSON.parse(this.user.aperturas_favoritas);
        } catch {
          this.user.aperturas_favoritas = [];
        }
      }

      // Cargar los nombres de las aperturas favoritas
      if (this.user.aperturas_favoritas?.length > 0) {
        const { data, error } = await supabase
          .from('aperturas')
          .select('id, nombre')
          .in('id', this.user.aperturas_favoritas); // obtener solo las favoritas

        if (!error && data) {
          this.aperturasFavoritasData = data;
        } else {
          console.error('Error al cargar aperturas favoritas:', error);
        }
      }
    });
  },

  // unmounted(), se ejecuta cuando el componente se elimina del DOM
  unmounted() {
        unsubscribeFromAuth();
    },
}
</script>

<template>
   <main class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-6 flex justify-center">
      <div class="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-lg border border-yellow-600">
         <!-- Título -->
         <AppH1>Mi Perfil</AppH1>
         <p class="text-sm text-gray-400 mt-2 text-center">
            Tu tablero personal en Gambito Club ♟️
         </p>
         <!-- Sección de usuario -->
         <section class="mt-6 space-y-6">
            <!-- Avatar + Nombre -->
            <div class="flex flex-col items-center">
               <div v-if="user.avatar_url"
                  class="w-24 h-24 rounded-full overflow-hidden shadow-lg">
                  <img :src="user.avatar_url" alt="Avatar" class="w-full h-full object-cover" />
               </div>
               <div v-else
                  class="w-20 h-20 rounded-full bg-yellow-600 flex items-center justify-center text-3xl font-bold text-black shadow-lg">
                  {{ user.display_name ? user.display_name.charAt(0).toUpperCase() : '?' }}
               </div>
               <h2 class="mt-3 text-xl font-semibold text-yellow-500">
                  {{ user.display_name ?? 'Jugador Anónimo' }}
               </h2>
               <p class="text-gray-400 text-sm">{{ user.bio ?? 'Sin biografía aún...' }}</p>
            </div>
            
            <!-- Panel desplegable -->
<div class="mt-8">
  <button
    @click="mostrarDetalles = !mostrarDetalles"
    class="w-full flex items-center justify-between px-4 py-3 bg-gray-900 border border-yellow-600 rounded-lg text-yellow-500 font-semibold hover:bg-gray-800 transition"
  >
    <span>Ver detalles del perfil</span>
    <span>{{ mostrarDetalles ? '▲' : '▼' }}</span>
  </button>

  <!-- Contenido del desplegable -->
  <transition name="fade">
    <div v-if="mostrarDetalles" class="mt-4 bg-gray-900 border border-yellow-600 rounded-lg p-4">
      
      <!-- Información del perfil -->
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <dt class="text-sm font-bold text-yellow-500">Email</dt>
          <dd class="text-gray-200">{{ user.email }}</dd>
        </div>
        <div>
          <dt class="text-sm font-bold text-yellow-500">País</dt>
          <dd class="text-gray-200">{{ user.country ?? 'Sin especificar...' }}</dd>
        </div>
        <div>
          <dt class="text-sm font-bold text-yellow-500">Elo</dt>
          <dd class="text-gray-200">{{ user.elo ?? 'No asignado' }}</dd>
        </div>
        <div>
          <dt class="text-sm font-bold text-yellow-500">Título</dt>
          <dd class="text-gray-200">{{ user.title ?? 'Sin título' }}</dd>
        </div>
        <div>
          <dt class="text-sm font-bold text-yellow-500">Creado el</dt>
          <dd class="text-gray-200">
            {{ user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Desconocido' }}
          </dd>
        </div>
      </dl>

      <!-- Mostrar nombres reales de aperturas favoritas en lista centrada -->
      <div v-if="aperturasFavoritasData.length" class="mt-8 text-center">
        <h3 class="text-lg font-bold text-yellow-500 mb-4">Aperturas favoritas</h3>
        <ul class="space-y-2 list-none text-center">
          <li
            v-for="apertura in aperturasFavoritasData"
            :key="apertura.id"
            class="text-gray-200 text-base leading-relaxed"
          >
            {{ apertura.nombre }}
          </li>
        </ul>
      </div>
      <div v-else class="text-center text-gray-400 italic mt-4">
        Aún no seleccionaste tus aperturas favoritas.
      </div>
    </div>
  </transition>
</div>

            <div class="flex justify-center mt-8">
               <router-link 
                  to="/mi-perfil/editar"
                  class="transition px-6 py-2 rounded bg-yellow-600 hover:bg-yellow-500 text-black font-semibold shadow-md"
                  >
                  Editar perfil
               </router-link>
            </div>

            <!-- Muro de publicaciones -->
            <MuroPublicaciones v-if="user.id" :userId="user.id" />

            
         </section>
      </div>
   </main>
</template>
