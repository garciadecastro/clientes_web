/*
Archivo principal de la app.
Acá importamos lo necesario para iniciar Vue.

- Cuando importo algo con comillas sin ./ o ../ (ej: "vue"),
  se entiende que viene de node_modules.
- Cuando importo un archivo propio del proyecto,
  debo indicar la ruta con ./ o ../ (ej: "./App.vue").
*/

import "./style.css";
import { createApp } from "vue"; 
import router from "./router/router"; 
import App from "./App.vue";  // Componente raíz

// Creo la aplicación de Vue
const app = createApp(App);

// Uso el router en la aplicación
app.use(router);

// Montamos la app en el div con id="app"
app.mount('#app');
