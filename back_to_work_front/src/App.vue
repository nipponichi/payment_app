<template>
  <div class="flex flex-col min-h-screen bg-white">
    <Navy />
    <main class="flex-grow">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
<script setup>
  import { RouterView } from 'vue-router'
  import Navy from './components/Navy.vue'
  import Footer from './components/Footer.vue'
</script>