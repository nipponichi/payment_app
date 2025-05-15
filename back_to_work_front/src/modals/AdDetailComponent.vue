<template>
  <div class="space-y-6">
    <!-- Detalle del anuncio -->
    <div v-if="adData" class="p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-center text-gray-700">{{ adData.name }}</h2>
      <p class="mt-4 text-gray-600">{{ adData.description }}</p>
      <p class="mt-2 text-gray-600">Categoría: {{ adData.category_id }}</p>
      <p class="mt-2 text-gray-600">Ubicación: {{ adData.location }}</p>
      <p class="mt-2 text-gray-600" v-if="adData.due_date">Fecha de finalización: {{ adData.due_date }}</p>
    </div>

    <!-- Grid de nueva puja -->
    <div v-if="showBidGrid" class="mt-6">
      <div class="overflow-x-auto bg-white shadow-md rounded-md">
        <table class="min-w-full text-sm">
          <tbody>
            <tr v-if="showNewBidRow" class="border-b">
              <td class="px-6 py-3">{{ loggedInUser ? loggedInUser.name : 'Usuario no logado' }}</td>
              <td class="px-6 py-3">
                <input v-model="newBid.bid" type="number" class="px-3 py-2 border border-gray-300 rounded-md" placeholder="Monto" />
              </td>
              <td class="px-6 py-3">
                <input v-model="newBid.description" type="text" class="px-3 py-2 border border-gray-300 rounded-md" placeholder="Descripción" />
              </td>
              <td class="px-6 py-3">
                <button
                  @click="submitNewBid"
                  class="text-green-500 hover:text-green-700"
                  :disabled="isSubmitting"
                >
                  Añadir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pujas existentes -->
    <div v-if="bids.length > 0" class="mt-6">
      <h3 class="text-lg font-semibold mb-4">Pujas</h3>
      <div class="overflow-x-auto bg-white shadow-md rounded-md">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-6 py-3 text-left">Usuario</th>
              <th class="px-6 py-3 text-left">Monto</th>
              <th class="px-6 py-3 text-left">Descripción</th>
              <th class="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bid in bids" :key="bid.id" class="border-b">
              <td class="px-6 py-3">{{ bid.user?.name || 'Desconocido' }}</td>
              <td class="px-6 py-3">{{ bid.bid }}</td>
              <td class="px-6 py-3">{{ bid.description }}</td>
              <td class="px-6 py-3">
                <template v-if="loggedInUser && bid.user && bid.user.id === loggedInUser.id">
                  <button @click="removeBid(bid.id)" class="text-red-500 hover:text-red-700">
                    Eliminar
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Botones -->
    <div class="mt-6 text-center">
      <button
        @click="toggleBidGrid"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        {{ showBidGrid ? 'Cerrar Pujas' : 'Pujar' }}
      </button>
      <button
        @click="chat"
        class="ml-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Chatear
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import userService from '../services/api/user.service';
import { useToast } from 'vue-toastification';

export default {
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      adData: null,
      bids: [],
      newBid: {
        bid: null,
        description: ''
      },
      loggedInUser: null,
      showBidGrid: false,
      showNewBidRow: false,
      isSubmitting: false,
      toast: useToast(),
    };
  },
  async mounted() {
    await this.fetchAdData();
    await this.fetchLoggedInUser();
    await this.fetchBids();
  },
  methods: {
    async fetchAdData() {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/ads/${this.id}`);
        if (res.data.success) {
          this.adData = res.data.data;
        }
      } catch (err) {
        console.error("Error al obtener el anuncio:", err);
      }
    },
    async fetchLoggedInUser() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        this.loggedInUser = user;
      } catch (err) {
        console.error("No se pudo obtener el usuario:", err);
      }
    },
    async fetchBids() {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/offers/ad/${this.id}`);
        if (res.data.success) {
          this.bids = res.data.data;
        }
      } catch (err) {
        console.error("Error al obtener pujas:", err);
      }
    },
    toggleBidGrid() {
      if (this.showBidGrid) {
        this.showNewBidRow = false;
        this.showBidGrid = false;
      } else {
        this.showNewBidRow = true;
        this.showBidGrid = true;
      }
    },
    async submitNewBid() {
      if (!this.newBid.bid || !this.newBid.description) return;

      this.isSubmitting = true;

      try {
        const response = await userService.set('offers', {
          bid: this.newBid.bid,
          description: this.newBid.description,
          ad_id: this.adData.id,
          user_id: this.loggedInUser.id,
          is_valid: true
        });

        if (response.data.success) {
          const newBid = response.data.data;
          this.toast.success('Puja enviada con éxito');
          if (!newBid.user) {
            await this.fetchBids();
          } else {
            this.bids.unshift(newBid);
          }
          this.newBid = { bid: null, description: '' };
          this.showNewBidRow = false;
          this.showBidGrid = false;
        }
      } catch (error) {
        console.error("Error al añadir la puja:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async removeBid(bidId) {
      try {
        const response = await userService.delete(`http://127.0.0.1:8000/api/offers/${bidId}`);
        if (response.data.success) {
          this.bids = this.bids.filter(bid => bid.id !== bidId);
          this.toast.success('Puja eliminada con éxito');
        }
      } catch (err) {
        console.error("Error al eliminar puja:", err);
      }
    },
    chat() {
      alert('Función de chat no implementada aún');
    }
  }
};
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1/1;
}
</style>
