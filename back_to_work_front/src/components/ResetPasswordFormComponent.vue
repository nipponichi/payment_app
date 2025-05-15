<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-center text-gray-700">Nueva Contraseña</h2>
      
      <form @submit.prevent="handleResetPassword" class="mt-4">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-600">Nueva Contraseña</label>
          <input 
            v-model="newPassword" 
            type="password" 
            class="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300" 
            required
            placeholder="Ingresa tu nueva contraseña"
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-600">Confirmar Contraseña</label>
          <input 
            v-model="newPasswordConfirmation" 
            type="password" 
            class="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300" 
            required
            placeholder="Confirma tu nueva contraseña"
          >
        </div>

        <button 
          type="submit"
          class="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Actualizar Contraseña</span>
          <span v-else>Procesando...</span>
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
  props: {
    token: String,
    email: String
  },
  data() {

    return {
      newPassword: '',
      newPasswordConfirmation: '',
      errorMessage: '',
      isLoading: false,
      toast: useToast()
    };
  },
  methods: {
    async handleResetPassword() {

      if (this.newPassword !== this.newPasswordConfirmation) {
        this.errorMessage = "Las contraseñas no coinciden";
        this.toast.error(this.errorMessage);
        return;
      }
      
      if (this.newPassword.length < 4) {
        this.errorMessage = "La contraseña debe tener al menos 8 caracteres";
        this.toast.error(this.errorMessage);
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      try {
        const verifyResponse = await userService.set("validate-reset-token", {
          token: this.token,
          email: this.email
        });

        if (!verifyResponse.data.success) {
          throw new Error("El enlace de restablecimiento no es válido o ha expirado");
        }

        const updateResponse = await userService.set("update-password", {
          token: this.token,
          email: this.email,
          password: this.newPassword,
          password_confirmation: this.newPasswordConfirmation
        });

        this.toast.success("Contraseña actualizada correctamente");
        
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);

      } catch (error) {
        this.errorMessage = error.response?.data?.message || error.message || "Error al actualizar la contraseña";
        this.toast.error(this.errorMessage);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>