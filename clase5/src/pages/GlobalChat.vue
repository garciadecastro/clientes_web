<script>
import AppH1 from '../components/AppH1.vue'
import { supabase } from '../services/supabase'

export default {
  name: 'GlobalChat',
  components: { AppH1 },

  // Estado inicial del componente
  data() {
    return {
      messages: [],
      newMessage: {
        email: '',
        content: ''
      }
    }
  },

  methods: {
    // Enviar un mensaje a la tabla "global_chat_messages"
    async handleSubmit() {
      const { data, error } = await supabase
        .from('global_chat_messages')
        .insert({
          email: this.newMessage.email,
          content: this.newMessage.content
        })

      if (error) {
        console.error('[GlobalChat] Error al enviar el mensaje', error)
      } else {
        this.newMessage.content = '' // limpio el input tras enviar
      }
    }
  },

  // Cuando se monta el componente, traigo los mensajes de Supabase
  async mounted() {
    // const { data, error } = await supabase
    //   .from("global_chat_messages")
    //   .select()

    // if (error) {
    //   console.error('Global-Chat no pudo publicar los mensajes', error);
    //   return;
    // } else {
    //   this.messages = data
    // }

    //Usamos la API de Realtime para recibir los nuevos mensajes
    // Se requiere crear un canal
    // De nombre/id podemos poner lo que queramos excepto realtime

    const chatChannel = supabase.channel('global_chat_messages');
    
    // Configurar el evento que queremos escuchar
    // Esto se logra con el método 'on' del canal
    // Recibe 3 parámetros
    // 1. string, el servicio
    // 2. Objeto, contiene los detalles del evento
    // 3. función callback que queremos ejecutar cuando se dispare el evento
    // recibe como parámetro el payload

    chatChannel.on(
      'postgres_changes',
      {
        // En 'postgres_changes': INSERT, DELETE, UPDATE
        event: 'INSERT',
        // Aclaramos la tabla para que no escuche las inserciones en cualquier tabla
        tabla: 'global_chat_messages',
        schema: 'public'
      },

      payload => {
        console.log('Recibimos el mensaje ', payload);
        this.messages.push(payload.new);
      }
    );

      // Nos suscribimos al canal
      // Lo previo era la configuración necesaria para que tenga efecto
    chatChannel.subscribe();

  }
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-6">
    <AppH1>Tablero de conversación</AppH1>
    <p class="text-sm text-gray-400 mb-6">
      El chat global de Gambito Club: jugá tus mejores movimientos con palabras ♟️
    </p>

    <div class="flex gap-6">
      <!-- Lista de mensajes -->
      <section class="flex-1 h-[70vh] overflow-y-auto p-4 bg-gray-800 border border-yellow-600 rounded-lg shadow-inner">
        <h2 class="sr-only">Mensajes</h2>
        <ol class="flex flex-col gap-4">
          <li 
            v-for="message in messages"
            :key="message.id"
            class="p-4 bg-gray-700 rounded-lg border border-gray-600"
          >
            <div class="mb-1">
              <span class="font-bold text-yellow-500">{{ message.email }}</span> dijo:
            </div>
            <div class="mb-1 text-gray-100">{{ message.content }}</div>
            <div class="text-xs text-gray-400">{{ message.createdAt }}</div>
          </li>
        </ol>
      </section>

      <!-- Formulario -->
      <section class="w-80">
        <h2 class="mb-4 text-lg font-semibold text-yellow-500">Enviar un mensaje</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="email" class="block mb-1 text-sm">Email</label>
            <input 
              type="email" 
              id="email" 
              class="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              v-model="newMessage.email"
            >
          </div>
          <div>
            <label for="content" class="block mb-1 text-sm">Mensaje</label>
            <textarea 
              id="content" 
              rows="3"
              class="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              v-model="newMessage.content"
            ></textarea>
          </div>
          <button 
            type="submit" 
            class="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Enviar
          </button>
        </form>
      </section>
    </div>
  </main>
</template>
