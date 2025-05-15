<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-center text-gray-700">Recuperar contraseña</h2>
      
      <form @submit.prevent="handleLogin" class="mt-4">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-600">Correo Electrónico</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300" 
            required
          >
        </div>

        <button 
          @click="handleResetPassword" 
          class="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Recuperar contraseña
        </button>
      </form>

      <p v-if="errorMessage" class="mt-2 text-sm text-red-500 text-center">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import userService from "../services/api/user.service";

export default {
  data() {
    return {
      email: "",
      errorMessage: "",
      toast: useToast(),
    };
  },
  methods: {
    async handleResetPassword() {
      try {
        const response = await userService.set("reset-password", { 
          email: this.email
        });

        if (response.data.success) {
          this.toast.success("Solicitud enviada con éxito");
        }

      } catch (error) {        
        this.toast.error(error.response.data.message);
      }
    },
  }
};
</script>