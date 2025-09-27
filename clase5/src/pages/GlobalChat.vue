<script>
import AppH1 from '../components/AppH1.vue';
import { 
  fetchLastGlobalChatMessages, 
  sendGlobalChatMessage, 
  subscribeToNewGlobalChatMessages 
} from '../services/global-chat';

export default {
  name: 'GlobalChat',
  components: { AppH1 },

  data() {
    return {
      messages: [],
      newMessage: {
        email: '',
        content: '',
      }
    }
  },

  methods: {
    async handleSubmit() {
      try {
        await sendGlobalChatMessage({
          email: this.newMessage.email,
          content: this.newMessage.content,
        });
      } catch (error) {
        console.error("[GlobalChat.vue] Error al enviar mensaje:", error);
      }
      
      this.newMessage.content = ''; // limpiar input después de enviar
    }
  },

  async mounted() {
    // Escuchar mensajes nuevos en tiempo real
    subscribeToNewGlobalChatMessages(async newMessage => {
      this.messages.push(newMessage);

      await this.$nextTick();
      this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
    });

    // Cargar los mensajes existentes desde Supabase
    this.messages = await fetchLastGlobalChatMessages();

    await this.$nextTick();
    this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
  }
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-6">
    <AppH1>Tablero de conversación</AppH1>
    <p class="text-sm text-gray-400 mb-6 text-center">
      El chat global de Gambito Club: jugá tus mejores movimientos con palabras ♟️
    </p>

    <div class="flex gap-6 max-w-6xl mx-auto">
      <!-- Lista de mensajes -->
      <section 
        class="flex-1 h-[70vh] overflow-y-auto p-4 bg-gray-800 border border-yellow-600 rounded-lg shadow-inner"
        ref="chatContainer"
      >
        <h2 class="sr-only">Lista de mensajes</h2>
        <ol class="flex flex-col gap-4">
          <li
  v-for="message in messages"
  :key="message.id"
  :class="[
    'max-w-[80%] p-3 rounded-lg shadow',
    message.email === newMessage.email
      ? 'self-end bg-yellow-600 text-black'
      : 'self-start bg-gray-700 text-gray-100 border border-gray-600'
  ]"
>
  <div class="mb-1 text-sm">
    <span 
      :class="message.email === newMessage.email ? 'font-bold text-black' : 'font-bold text-yellow-500'"
    >
      {{ message.email }}
    </span>
  </div>
  <div class="mb-1">{{ message.content }}</div>
  <div 
    :class="message.email === newMessage.email ? 'text-xs text-gray-800' : 'text-xs text-gray-400'"
  >
    {{ new Date(message.created_at).toLocaleString('es-ES', { 
        day: '2-digit', month: '2-digit', year: '2-digit', 
        hour: '2-digit', minute: '2-digit' 
    }) }}
  </div>
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
              @keydown.enter.exact.prevent="handleSubmit"
              placeholder="Presiona ENTER para enviar tu mensaje..."
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
