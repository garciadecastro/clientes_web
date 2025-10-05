<template>
  <div class="flex items-center justify-center min-h-[200px]">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.loader {
    width: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 6px solid #2b2b2b; 
    border-top-color: #facc15;
    box-shadow: 0 0 10px rgba(250, 204, 21, 0.5);
    animation: l2 1s infinite linear;
}
@keyframes l2 {to{transform: rotate(1turn)}}
</style>
