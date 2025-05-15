<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-center text-gray-700">Iniciar Sesión</h2>
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
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-600">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300" 
            required
          >
        </div>
        <button 
          type="submit" 
          class="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Iniciar Sesión
        </button>
      </form>
      <p v-if="errorMessage" class="mt-2 text-sm text-red-500 text-center">
        {{ errorMessage }}
      </p>
      <div class="mt-4 text-center">
        <RouterLink to="/register" class="text-blue-500 hover:underline">
          📞 ¿No tienes cuenta? Regístrate aquí
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '../services/api/auth.service'
import { useToast } from 'vue-toastification';


export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      toast: useToast()
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await AuthService.login(this.email, this.password)
        console.log("Response:", response);
        if (response.data.success) {
          // 2 horas
          this.toast.success("Login succesfully")
          const tokenExpiration = Date.now() + 2 * 3600 * 1000;

          localStorage.setItem("tokenExpiration", tokenExpiration);
          localStorage.setItem("token", response.data.data.accessToken);
          let accessToken = localStorage.getItem("token");

          localStorage.setItem("user", JSON.stringify(response.data.data.user));

          const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
          localStorage.removeItem("redirectAfterLogin");
          this.$router.push(redirectPath);
        } else {
          this.errorMessage = response.data.message;
          console.log("Error en el inicio de sesión:", this.errorMessage);
        } 
      } catch (error) {
        this.toast.error(error.response.data.message);
      }
    }
  }
}
</script>