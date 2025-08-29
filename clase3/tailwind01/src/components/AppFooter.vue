<script>
export default {
    name: 'AppFooter',
}
</script>

<template>
    <!-- Footer (no tapa contenido) -->
  <footer class="mt-auto bg-orange-800 border-t-4 border-yellow-600 text-white py-6 flex items-center justify-center shadow-lg">
    <p class="text-lg font-semibold tracking-wide">Carlos García de Castro - Da Vinci &copy; 2025</p>
  </footer>
</template>

<style scoped>
.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    background-color: #222;
    color: #fff;
}

.footer p {
    margin: 0;
}
</style>