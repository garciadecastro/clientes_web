<script>
import AppH1 from '../components/AppH1.vue'
import { supabase } from '../services/supabase'

export default {
  name: 'Aperturas',
  components: { AppH1 },

  data() {
    return {
      aperturas: []
    }
  },

  async mounted() {
    const { data, error } = await supabase
      .from('aperturas')
      .select('*')
      .order('popularidad', { ascending: false }) // más populares primero

    if (error) {
      console.error('Error al cargar aperturas:', error)
    } else {
      this.aperturas = data
    }
  }
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-6">
    <!-- Título -->
    <AppH1>Aperturas de Ajedrez</AppH1>
    <p class="text-gray-400 text-center mb-6">
      Explorá y compartí las aperturas más jugadas en Gambito Club ♟️
    </p>

    <!-- Listado de aperturas -->
    <ul class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <li
        v-for="apertura in aperturas"
        :key="apertura.id"
        class="bg-gray-800 border border-yellow-600 rounded-lg p-5 shadow hover:shadow-lg transition"
      >
        <h2 class="text-xl font-bold text-yellow-500 mb-2">
          {{ apertura.nombre }}
        </h2>
        <p class="text-sm text-gray-300 mb-2">
          {{ apertura.descripcion }}
        </p>
        <p class="text-xs text-gray-400">Código ECO: {{ apertura.eco_code || '—' }}</p>
        <p class="text-xs text-gray-500 mt-2">Popularidad es: {{ apertura.popularidad }}</p>
      </li>
    </ul>
  </main>
</template>
