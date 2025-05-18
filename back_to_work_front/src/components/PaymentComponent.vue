<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
    <!-- Logo Stripe -->
    <div class="flex justify-center mb-6">
      <img
        src="https://stripe.com/img/v3/home/twitter.png"
        alt="Stripe"
        class="h-8 w-auto"
      />
    </div>

    <p class="text-lg font-semibold text-center text-gray-900 mb-6">
      El importe del pago a efectuar es de {{ paymentAmount }} euros
    </p>

    <!-- Card Form -->
    <form class="space-y-5" @submit.prevent>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Número de tarjeta</label>
        <div class="relative">
          <input
            v-model="cardNumber"
            type="text"
            class="peer block w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="1234 5678 9012 3456"
            autocomplete="cc-number"
            inputmode="numeric"
            maxlength="19"
          />
          <div class="absolute inset-y-0 right-3 flex items-center space-x-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" class="h-5" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" class="h-5" alt="Mastercard" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Fecha de expiración</label>
          <input
            v-model="cardExpiry"
            type="text"
            class="block w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="MM/AA"
            autocomplete="cc-exp"
            maxlength="5"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">CVC</label>
          <input
            v-model="cardCvc"
            type="text"
            class="block w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="123"
            autocomplete="cc-csc"
            inputmode="numeric"
            maxlength="4"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">País</label>
          <select
            v-model="cardCountry"
            class="block w-full rounded-md border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            autocomplete="country"
          >
            <option value="">Selecciona país</option>
            <option>United States</option>
            <option>Spain</option>
            <option>Mexico</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Código postal</label>
          <input
            v-model="cardPostalCode"
            type="text"
            class="block w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="12345"
            autocomplete="postal-code"
          />
        </div>
      </div>
    </form>

    <!-- Mensajes -->
    <p
      v-if="paymentSuccess"
      class="mt-4 flex items-center justify-center gap-2 rounded-md border border-green-400 bg-green-50 px-4 py-2 text-green-800 font-semibold"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.07 7.07a1 1 0 01-1.414 0l-3.536-3.536a1 1 0 111.414-1.414l2.829 2.828 6.363-6.364a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      Pago realizado con éxito
    </p>

    <p
      v-if="paymentError"
      class="mt-4 flex items-center justify-center gap-2 rounded-md border border-red-400 bg-red-50 px-4 py-2 text-red-800 font-semibold"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-4.75a.75.75 0 11-1.5 0v-5a.75.75 0 011.5 0v5zm0 3a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clip-rule="evenodd" />
      </svg>
      Error en los datos del pago, por favor revisa e inténtalo de nuevo.
    </p>

    <!-- Payment Actions -->
    <div class="mt-8 flex justify-between">
      <button
        @click="$emit('close')"
        type="button"
        class="px-5 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition font-semibold"
      >
        Cancelar
      </button>

      <button
        class="px-5 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
        type="button"
        @click="handlePayment"
      >
        Pagar {{ paymentAmount }} €
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  acceptedBid: {
    type: Number,
    required: false,
    default: 0
  }
})
let bid2 = {} 
const bid = ref(null)

const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const cardCountry = ref('')
const cardPostalCode = ref('')

const paymentSuccess = ref(false)
const paymentError = ref(false)

const paymentAmount = computed(() => {
  let amountRaw = null

  if (bid.value && bid.value.amount !== undefined && bid.value.amount !== null) {
    amountRaw = bid.value.amount
  } else {
    amountRaw = props.acceptedBid
  }

  console.log('Raw amount:', amountRaw)

  const amount = parseFloat(String(amountRaw).trim())
  console.log('Parsed amount:', amount)

  if (isNaN(amount)) {
    console.log('Amount is NaN, returning 0')
    return '0'
  }

  if (amount <= 100) {
    console.log('Amount <= 100, returning 1')
    return '1'
  } else {
    const calculated = (amount * 0.01).toFixed(2)
    console.log('Amount > 100, returning 1%:', calculated)
    return calculated
  }
})

onMounted(() => {
  console.log('acceptedBid prop on mount:', props.acceptedBid)
  window.addEventListener('message', receiveMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', receiveMessage)
})

function clearMessages() {
  paymentSuccess.value = false
  paymentError.value = false
}

function handlePayment() {
  clearMessages()

  const validCardNumber = cardNumber.value.replace(/\s+/g, '') === '4242424242424242'
  const validExpiry = cardExpiry.value === '12/34'
  const validCvc = cardCvc.value === '123'

  if (validCardNumber && validExpiry && validCvc) {
    paymentSuccess.value = true
    sendPaymentOk()
  } else {
    paymentError.value = true
  }

  if (paymentSuccess.value) {
    setTimeout(() => {
      paymentSuccess.value = false
    }, 5000)
  }
}

function receiveMessage(event) {
  if (event.origin !== 'http://localhost:5173') {
    return
  }

  const data = event.data

  if (data && data.bid) {
    console.log('✅ Bid ID:', data.bid.id)
    console.log('💰 Bid Amount:', data.bid.amount)
    bid.value = data.bid // Actualizamos para reactividad
  } else {
    console.warn('❌ No se recibió un bid válido.')
  }
}

function sendPaymentOk() {
  const externalOrigin = 'http://localhost:5173'
  const bidId = bid.value?.id || null

  window.opener.postMessage({ PaymentOK: true, bidId }, externalOrigin)
  console.log("Pago enviado correctamente... ID de puja:", bidId)
}
</script>
