<template>
  <div class="max-w-md mx-auto my-24 p-8 text-center">

    <div v-if="loading" class="text-gray-600 text-lg">
      Verificando tu email...
    </div>

    <div v-if="success" class="space-y-4">
      <h2 class="text-2xl font-bold text-green-600">¡Email verificado!</h2>
      <p class="text-gray-700">Tu dirección de email ha sido verificada correctamente.</p>
    </div>

    <div v-if="error" class="space-y-4">
      <h2 class="text-2xl font-bold text-red-600">Error en la verificación</h2>
      <p class="text-gray-700">{{ errorMessage }}</p>
      <button 
        @click="retryVerification"
        class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
      >
        Reintentar
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserService from '../services/api/user.service';

export default {
  props: {
    id: String,
    hash: String,
    signature: String
  },
  setup(props) {
    const loading = ref(true)
    const success = ref(false)
    const error = ref(false)
    const errorMessage = ref('')
    const router = useRouter()
    const route = useRoute()

    const verifyEmail = async () => {
      try {
        const response = await UserService.set('verify-email', {
          id: props.id || route.query.id,
          hash: props.hash || route.query.hash,
          signature: props.signature || route.query.signature
        })
        
        if (response.data.success) {
          success.value = true
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else {
          throw new Error(response.data.message || 'Error desconocido')
        }
      } catch (err) {
        error.value = true
        errorMessage.value = err.response?.data?.message || err.message || 'Error al verificar el email'
      } finally {
        loading.value = false
      }
    }

    const retryVerification = () => {
      loading.value = true
      error.value = false
      verifyEmail()
    }

    onMounted(() => {
      verifyEmail()
    })

    return { loading, success, error, errorMessage, retryVerification }
  }
}
</script>