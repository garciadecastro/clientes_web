<script>
import AppH1 from '../components/AppH1.vue';

export default {
    name: 'Home',
    components: { AppH1, },
}
</script>

<template>
    <div class="flex flex-col items-center justify-center gap-4 mt-8">
        <AppH1>Bienvenidos a Ajedrez Social</AppH1>
        <p class="text-lg text-gray-700 font-medium text-center max-w-xl">
            La red social de referencia para amantes del ajedrez
        </p>
    </div>
</template>