<script>
/**
 * @file ChatClub.vue
 * @description Chat global de Gambito Club. Muestra los mensajes en tiempo real y permite enviar nuevos.
 */

import AppH1 from '../components/AppH1.vue';
import { escucharCambiosDeAuth } from '../services/auth';
import {
  obtenerMensajesChatGlobal,
  enviarMensajeChatGlobal,
  escucharNuevosMensajesChat,
} from '../services/chat-club';

let desuscribirDeAuth = () => {};
let desuscribirDeChat = () => {};

export default {
  name: 'ChatClub',
  components: { AppH1 },

  data() {
    return {
      messages: [],
      newMessage: { content: '' },
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
    };
  },

  methods: {
    /**
     * Envía el mensaje escrito y limpia el campo.
     */
    async enviarMensaje() {
      if (!this.newMessage.content.trim()) return;

      try {
        await enviarMensajeChatGlobal({
          sender_id: this.user.id,
          email: this.user.email,
          display_name: this.user.display_name,
          content: this.newMessage.content.trim(),
        });

        this.newMessage.content = '';
        await this.$nextTick();
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
      } catch (error) {
        console.error('[ChatClub.vue] Error al enviar mensaje:', error);
        alert('Hubo un problema al enviar el mensaje.');
      }
    },
  },

  async mounted() {
    // Suscribirse al estado de autenticación
    desuscribirDeAuth = escucharCambiosDeAuth(
      nuevoUsuario => (this.user = nuevoUsuario)
    );

    // Escuchar mensajes nuevos en tiempo real
    desuscribirDeChat = escucharNuevosMensajesChat(async nuevo => {
      this.messages.push(nuevo);
      await this.$nextTick();
      this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
    });

    // Cargar mensajes existentes
    this.messages = await obtenerMensajesChatGlobal();

    await this.$nextTick();
    this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
  },

  unmounted() {
    desuscribirDeAuth();
    desuscribirDeChat();
  },
};
</script>

<template>
  <main class="min-h-screen bg-gray-900 text-gray-100 p-6">
    <AppH1>Salón de ajedrecistas</AppH1>
    <p class="text-sm text-gray-400 mb-4 text-center">
      El Chat de Gambito Club ♟️
    </p>

    <div class="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
      <!-- Mensajes -->
      <section
        class="flex-1 h-[65vh] overflow-y-auto p-3 bg-gray-800 border border-gray-700 rounded"
        ref="chatContainer"
      >
        <ol class="flex flex-col gap-3">
          <li
            v-for="message in messages"
            :key="message.id"
            :class="[
              'max-w-[80%] p-2 rounded',
              message.email === user.email
                ? 'self-end bg-yellow-600 text-black'
                : 'self-start bg-gray-700 text-gray-100',
            ]"
          >
            <div class="mb-1 text-sm font-semibold text-gray-300">
              {{ message.display_name }}
            </div>
            <div class="text-sm">{{ message.content }}</div>
            <div class="text-xs text-gray-200 mt-1 text-right">
              {{
                new Date(message.created_at).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
            </div>
          </li>
        </ol>
      </section>

      <!-- Formulario -->
      <section class="w-full md:w-72">
        <h2 class="mb-3 text-base font-semibold text-yellow-500">
          Enviar mensaje
        </h2>
        <form @submit.prevent="enviarMensaje" class="space-y-3">
          <div>
            <span class="block mb-1 text-sm">{{ user.display_name }}</span>
          </div>

          <div>
            <label for="content" class="block mb-1 text-sm">Mensaje</label>
            <textarea
              id="content"
              rows="3"
              autocomplete="off"
              class="w-full p-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              v-model="newMessage.content"
              @keydown.enter.exact.prevent="enviarMensaje"
              placeholder="Presioná ENTER para enviar..."
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full bg-yellow-600 text-black font-medium py-2 rounded hover:bg-yellow-500"
          >
            Enviar
          </button>
        </form>
      </section>
    </div>
  </main>
</template>
