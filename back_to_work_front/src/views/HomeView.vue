<template>
  <div>
    <div class="relative w-full min-h-screen">

      <img class="absolute top-0 left-0 w-full h-full object-cover" src="https://appwebel.com/assets/es/img/backgrounds/landing/landing.webp" alt="Fondo">

      <h1 class="absolute z-50 text-white text-4xl font-bold top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 bg-opacity-50 px-6 py-2 rounded-lg">
        HOME
      </h1>


      <div class="absolute text-white z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-black bg-opacity-50 px-6 py-4 rounded-lg">
        <ContactFormComponent />
      </div>
    </div>

    <section class="bg-gray-100 py-20">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-gray-800">Más información</h2>
        <p class="text-lg text-gray-600 mt-4">
          Seccion test 1
        </p>
      </div>
    </section>

    <section class="bg-gray-200 py-20">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-gray-800">Sección Adicional</h2>
        <p class="text-lg text-gray-600 mt-4">
          Seccion test 2
        </p>

        <button @click="isModalOpen = true" class="cursor-pointer bg-gray-300 px-3 py-2 rounded-lg border-none hover:bg-gray-400">Modal</button>
      </div>
    </section> 
      <AdverFilters />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import ContactFormComponent from '../components/ContactFormComponent.vue';
</script>
