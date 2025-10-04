<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges, actualizarUsuarioAutentificado } from '../services/auth';

let unsubscribeFromAuth = () => {};

export default {
    name: 'EditarPerfil',
    components: { AppH1 },

    data() {
        return {
                perfilFormulario: {
                
                    email: '',
                    display_name: '',
                    bio: '',
                    elo: '',
                    country: '',
                    title: '',
                    avatar_url: '',
                
                },
                loading: false, // Estado de carga
            };
        },
    
    methods: {
        async guardarPerfil() {
            try {
                this.loading = true;

                await actualizarUsuarioAutentificado(this.perfilFormulario);
            } catch (error) {
                // TODO...
            }
            this.loading = false;
        }
    },



          
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-6 flex justify-center">
    <div class="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-lg border border-yellow-600">

      <!-- Título -->
      <AppH1>Editar mi perfil</AppH1>
      <p class="text-sm text-gray-400 mt-2 text-center">
        Actualizá tu información personal en Gambito Club ♟️
      </p>

      <!-- Formulario -->
      <form @submit.prevent="guardarPerfil" class="mt-8 space-y-6">

        <!-- Avatar -->
        <div class="flex flex-col items-center">
          <div v-if="perfilFormulario.avatar_url" class="w-24 h-24 rounded-full overflow-hidden shadow-lg">
            <img :src="perfilFormulario.avatar_url" alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-20 h-20 rounded-full bg-yellow-600 flex items-center justify-center text-3xl font-bold text-black shadow-lg">
            {{ perfilFormulario.display_name ? perfilFormulario.display_name.charAt(0).toUpperCase() : '?' }}
          </div>

          <label for="avatar_url" class="text-sm text-gray-400 mt-3">URL del avatar</label>
          <input
            id="avatar_url"
            type="text"
            v-model="perfilFormulario.avatar_url"
            class="w-full mt-2 p-2 bg-gray-900 border border-yellow-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="https://..."
          />
        </div>

        <!-- Nombre -->
        <div>
          <label for="display_name" class="block text-sm text-yellow-500 mb-1">Nombre visible</label>
          <input
            id="display_name"
            type="text"
            v-model="perfilFormulario.display_name"
            class="w-full p-2 bg-gray-900 border border-yellow-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            
          />
        </div>

        <!-- Biografía -->
        <div>
          <label for="bio" class="block text-sm text-yellow-500 mb-1">Biografía</label>
          <textarea
            id="bio"
            rows="3"
            v-model="perfilFormulario.bio"
            class="w-full p-2 bg-gray-900 border border-yellow-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Contanos algo sobre vos..."
          ></textarea>
        </div>

        <!-- País -->
        <div>
          <label for="country" class="block text-sm text-yellow-500 mb-1">País</label>
          <input
            id="country"
            type="text"
            v-model="perfilFormulario.country"
            class="w-full p-2 bg-gray-900 border border-yellow-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Ej: Argentina"
          />
        </div>

        <!-- ELO -->
        <div>
          <label for="elo" class="block text-sm text-yellow-500 mb-1">ELO</label>
          <input
            id="elo"
            type="number"
            v-model="perfilFormulario.elo"
            class="w-full p-2 bg-gray-900 border border-yellow-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Tu puntuación ELO"
          />
        </div>

        <!-- Título -->
        <div>
          <label for="title" class="block text-sm text-yellow-500 mb-1">Título</label>
          <input
            id="title"
            type="text"
            v-model="perfilFormulario.title"
            class="w-full p-2 bg-gray-900 border border-yellow-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Ej: Maestro, Gran Maestro, etc."
          />
        </div>

        <!-- Botón -->
        <div class="flex justify-center mt-6">
          <button
            type="submit"
            class="transition px-6 py-2 rounded bg-yellow-600 hover:bg-yellow-500 text-black font-semibold shadow-md flex items-center gap-2 disabled:opacity-50"
            :disabled="loading"
          >
            <template v-if="!loading">
              Guardar cambios
            </template>
            <template v-else>
              <AppLoader /> Guardando...
            </template>
          </button>
        </div>

      </form>
    </div>
  </main>
</template>
