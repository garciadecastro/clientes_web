<script>
//Exportación del componente. Este nombre se usa en App.vue.
export default {
    name: 'AppNavbar',
}
</script>

<template>
    <!-- Navbar simple, fondo oscuro, texto blanco y hover amarillo -->
     <!-- Ctrl + barra AUTOCOMPLETAR tailwindcss -->
    <nav class="bg-orange-800 px-4 py-3 flex flex-col md:flex-row items-center justify-between shadow-lg border-b-4 border-yellow-600">
        <RouterLink to="/" class="text-white text-2xl font-extrabold tracking-wide hover:text-yellow-400 transition-colors mb-2 md:mb-0">
            Ajedrez Social
        </RouterLink>
        <ul class="flex flex-col md:flex-row gap-2 md:gap-6">
            <li>
                <RouterLink to="/" class="text-white hover:text-yellow-400 px-3 py-2 rounded transition-colors font-medium">
                    Home
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/chat" class="text-white hover:text-yellow-400 px-3 py-2 rounded transition-colors font-medium">
                    Chat general
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/ingresar" class="text-white hover:text-yellow-400 px-3 py-2 rounded transition-colors font-medium">
                    Ingresar
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/crear-cuenta" class="text-white hover:text-yellow-400 px-3 py-2 rounded transition-colors font-medium">
                    Crear cuenta
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>