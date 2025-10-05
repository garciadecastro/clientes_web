<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges } from '../services/auth';
import { fetchLastGlobalChatMessages, sendGlobalChatMessage, subscribeToNewGlobalChatMessages } from '../services/chat-club';

let unsubscribeFromAuth = () => {};
let unsubscribeFromChat = () => {};

export default {
  name: 'GlobalChat',
  components: { AppH1 },

  data() {
        return {
            messages: [],
            newMessage: {

                 // Solo el contenido del mensaje, el email viene del usuario logueado
                content: '',
            },
            
            
            // Datos del usuario autenticado (rellenados automáticamente)
            user: {
              id: null,
              email: null,
              display_name: null,
              bio: null,
              elo: null,
              country: null,
              title: null,
              avatar_url: null,
            },
        }
    },

  methods: {
    async handleSubmit() {
      try {
        await sendGlobalChatMessage({
          sender_id: this.user.id,
          email: this.user.email,
          display_name: this.user.display_name, // Necesario para que en el chat estén los nombres de la gente
          content: this.newMessage.content,
        });
      } catch (error) {
        console.error("[GlobalChat.vue] Error al enviar mensaje:", error);
      }
      
      this.newMessage.content = ''; // limpiar input después de enviar
    }
  },

  async mounted() {
    unsubscribeFromAuth = subscribeToAuthStateChanges(newUserState => this.user = newUserState);

    // Escuchar mensajes nuevos en tiempo real
    unsubscribeFromChat = subscribeToNewGlobalChatMessages(async newMessage => {
      this.messages.push(newMessage);

      await this.$nextTick();
      this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
    });

    // Cargar los mensajes existentes desde Supabase
    this.messages = await fetchLastGlobalChatMessages();

    await this.$nextTick();
    this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
  },

  // unmounted(), se ejecuta cuando el componente se elimina del DOM
  unmounted() {
        unsubscribeFromAuth();
        unsubscribeFromChat();
    },
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-6">
    <AppH1>Salón de ajedrecistas</AppH1>
    <p class="text-sm text-gray-400 mb-6 text-center">
      El Chat de Gambito Club ♟️
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
    :class="message.email === user.email ? 'font-bold text-black' : 'font-bold text-yellow-500'"
  >
    {{ message.display_name }}
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
            <span class="block mb-1 text-sm">{{ user.display_name }}</span>
             
          </div>
          <div>
            <label for="content" class="block mb-1 text-sm">Mensaje</label>
            <textarea
              id="content"
              rows="3"
              autocomplete="off"
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
