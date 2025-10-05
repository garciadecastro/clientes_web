<script>
import AppH1 from '../components/AppH1.vue'
import {
    supabase
} from '../services/supabase'
// Importamos el servicio de autenticación para conocer el usuario logueado
import {
    subscribeToAuthStateChanges
} from '../services/auth'

// variable para desuscribirse cuando el componente se elimine
let unsubscribeFromAuth = () => {}

export default {
    name: 'Aperturas',
    components: {
        AppH1
    },

    data() {
        return {
            aperturas: [],
            // agregamos la información del usuario y sus aperturas favoritas
            user: {
                id: null,
                aperturas_favoritas: []
            },
        }
    },

    methods: {
        // método para agregar o quitar aperturas favoritas
        async elegirFavorita(aperturaId) {
            if (!this.user.id) {
                alert('Debes iniciar sesión para guardar tus aperturas favoritas.');
                return;
            }

            // Asegurar que el array existe
            if (!Array.isArray(this.user.aperturas_favoritas)) {
                this.user.aperturas_favoritas = [];
            }

            const yaFavorita = this.user.aperturas_favoritas.includes(aperturaId);
            let nuevasFavoritas;

            if (yaFavorita) {
                nuevasFavoritas = this.user.aperturas_favoritas.filter(id => id !== aperturaId);
            } else {
                nuevasFavoritas = [...this.user.aperturas_favoritas, aperturaId];
            }

            console.log('Guardando favoritas en Supabase:', nuevasFavoritas);

            // Guardar en la base
            const {
                error
            } = await supabase
                .from('perfiles_usuarios')
                .update({
                    aperturas_favoritas: nuevasFavoritas
                }) // jsonb permite array directo
                .eq('id', this.user.id);

            if (error) {
                console.error('Error al actualizar favoritas:', error);
                alert('Error al actualizar tus aperturas favoritas.');
            } else {
                console.log('Favoritas actualizadas correctamente.');
                this.user.aperturas_favoritas = nuevasFavoritas;
            }
        },
    },

    async mounted() {
        // suscribirse al estado del usuario autenticado
        unsubscribeFromAuth = subscribeToAuthStateChanges(newUser => {
            this.user = newUser
        })

        // Cargar las aperturas desde la base 
        const {
            data,
            error
        } = await supabase
            .from('aperturas')
            .select('*')
            .order('popularidad', {
                ascending: false
            }) // más populares primero

        if (error) {
            console.error('Error al cargar aperturas:', error)
        } else {
            this.aperturas = data
        }
    },
    // limpiar la suscripción al desmontar el componente
    unmounted() {
        unsubscribeFromAuth()
    },
}
</script>

<template>
   <main class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-6">
      <!-- Título -->
      <AppH1>Aperturas de Ajedrez</AppH1>
      <p class="text-gray-400 text-center mb-6">
         Explorá y marcá tus aperturas favoritas ♟️ <!-- texto actualizado -->
      </p>
      <!-- Listado de aperturas -->
      <ul class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
         <li
            v-for="apertura in aperturas"
            :key="apertura.id"
            class="bg-gray-800 border border-yellow-600 rounded-lg p-5 shadow hover:shadow-lg transition"
            >
            <!-- contenedor con botón -->
            <div class="flex justify-between items-center mb-2">
               <h2 class="text-xl font-bold text-yellow-500">{{ apertura.nombre }}</h2>
               <!-- botón que marca o desmarca favoritas -->
               <button
                  @click="elegirFavorita(apertura.id)"
                  :class="[
                  'px-2 py-1 rounded text-sm font-semibold transition',
                  user.aperturas_favoritas?.includes(apertura.id)
                  ? 'bg-yellow-600 text-black'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  ]"
                  >
               {{ user.aperturas_favoritas?.includes(apertura.id) ? '★ Favorita' : '☆ Agregar' }}
               </button>
            </div>
            <!-- Texto original sin cambios -->
            <p class="text-sm text-gray-300 mb-2">{{ apertura.descripcion }}</p>
            <p class="text-xs text-gray-400">Código ECO: {{ apertura.eco_code || '—' }}</p>
            <p class="text-xs text-gray-500 mt-2">Popularidad: {{ apertura.popularidad }}</p>
         </li>
      </ul>
   </main>
</template>
