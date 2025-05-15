<template>
    <nav class="bg-gray-800 p-4 min-h-54 flex items-center">
      <ul class="flex space-x-4 list-none">
        <li>
          <RouterLink to="/" class="text-white flex items-center space-x-2">
            <span>🏠</span>
            <span>Inicio</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/about" class="text-white flex items-center space-x-2">
            <span>ℹ️</span>
            <span>Acerca de</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/contact" class="text-white flex items-center space-x-2">
            <span>📞</span>
            <span>Contacto</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
</template>
  
<script setup>
  import { RouterLink } from 'vue-router';
</script>
  