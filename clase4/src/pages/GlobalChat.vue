<script>
import AppH1 from '../components/AppH1.vue';
import { supabase } from '../services/supabase';


export default {
  name: 'GlobalChat',
  components: { AppH1 },

  // data define el "state" inicial del componente
  data() {
    return {
      messages: [],

      newMessage: {
        email: '',
        content: ''
      }
    }
  },

  // aquí van los métodos del componente
  methods: {
    handleSubmit() {
      this.messages.push({
        id: this.messages.length,
        email: this.newMessage.email,
        content: this.newMessage.content,
        createdAt: new Date().toLocaleString()
      })
      this.newMessage.email = ''
      this.newMessage.content = ''      
    
    }
  },

  //A través del objeto del cliente de supabase podemos acceder a todas las funcionalidades de supabase
  //El método mounted es un "lifecycle hook" que se ejecuta cuando el componente se ha montado en el DOM
  //Es un buen lugar para hacer peticiones a APIs o inicializar datos
  // Es el await el que nos permite esperar a que la promesa se resuelva antes de continuar con la ejecución del código. Es fundamental usar await dentro de una función async
  async mounted() {
  const { data, error } = await supabase
  // from nos permite especificar la tabla con la que queremos interactuar de nuestra base
    .from("global_chat_messages")
    // select nos permite especificar las columnas que queremos obtener
    .select();

  if (error) {
    throw new Error(error);
  }

  this.messages = data;
}

}
</script>


<template>
    <div><AppH1>Chat general</AppH1>
    

    <div class="flex gap-4">
        <section class="overflow-y-auto w-9/12 h-100 p-4 bg-white border border-gray-200 rounded">
            <h2 class="sr-only">Lista de mensajes</h2>
            <!-- Las etiquestas que empiezan por "v" son directivas de Vue.js
            Las directivas sirven para agregar funcionalidades a los elementos HTML -->
            <ol class ="flex flex-col gap-4 items-start">
                <li 
                    v-for="message in messages"
                    :key="message.id"
                    class ="p-4 bg-gray-100 rounded"
                >
                    <div class="mb-1"><span class="font-bold">{{ message.email}}</span> dijo:</div>
                    <div class="mb-1">{{ message.content }}</div>
                    <div class="text-sm text-gray-600">{{ message.createdAt }}</div>
                </li>
        
            </ol>
        </section>
        <section class="w-3/12">
            <h2 class="mb-4 text-xl">Enviar un mensaje</h2>
            <form action="#"
            @submit.prevent=" handleSubmit">
                <div class="mb-4">
                    <label for="email" class="block mb-1">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        class="bg-white w-full p-2 border border-gray-300 rounded"
                       
                        v-model="newMessage.email">  <!--  Campo del formulario asociado a la variable newMessage.email -->
                </div>
                <div class="mb-4">
                    <label for="content" class="block mb-1">Mensaje</label>
                    <textarea 
                        id="content" 
                        class="bg-white w-full p-2 border border-gray-300 rounded"
                        v-model="newMessage.content"></textarea> <!--  Campo del formulario asociado a la variable newMessage.content -->
                </div>
                <button type="submit" class="transition px-4 py-2 rounded bg-orange-600 orange:bg-blue-500 focus:bg-orange-500 active:bg-orange-700 text-white">Enviar</button>
            </form>
            <!--
                v-model define un "two-way data binding" entre una propiedad y un control (campo) de formulario.
                Esto significa que Vue va a mantener en sincronía el valor del state y el valor del control del form.
                Si actualizamos programáticamente el valor de la propiedad del state, Vue actualiza el valor del campo del form.
                Y si el usuario modifica el valor del campo, Vue actualiza el valor de la propiedad.
                Internamente, Vue usa el valor de la propiedad como la "single source of truth"
            -->
        </section>
    </div>

    </div>
</template>