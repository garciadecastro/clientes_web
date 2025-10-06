<script>
/**
 * @file AppH1.vue
 * @description Componente reutilizable para títulos principales (nivel H1).
 * Permite insertar contenido dinámico mediante un slot.
 */
export default {  name: "AppH1", };
</script>

<template>
  <h1 class="text-2xl md:text-3xl font-bold text-yellow-600 text-center mb-3">
    <slot />
  </h1>
</template>