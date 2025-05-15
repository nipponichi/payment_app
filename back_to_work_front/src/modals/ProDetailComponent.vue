<template>
  <div class="space-y-6">
    
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2">Nombre:</label>
      <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
        {{ userData.name }}
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2">Email:</label>
      <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
        {{ userData.email }}
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2">Categorías:</label>
      <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
        {{ userData.categories?.map(c => c.description).join(', ') || 'No hay categorías asignadas' }}
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2">Provincia:</label>
      <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 whitespace-pre-line">
        {{ userData.provinces?.name }}
      </div>
    </div>

    <div class="mb-6">
      <label class="block text-gray-700 font-medium mb-2">Fotos:</label>
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2">Estado:</label>
      <div class="w-full px-3 py-2">
      </div>
    </div>
  </div>
  
</template>

<script>
import UserService from '../services/api/user.service';

export default {
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      userData: {
        name: '',
        email: '',
        location: '',
        category: '',
        stats: '',
        media: [],
        status: ''
      },
      categories: [],
      showBidGrid: false,
      bids: [],
      newBid: { bid: '', description: '' },
      bidsLoaded: false,
    };
  },
  async mounted() {
  console.log(this.id)
  try {
    const response = await UserService.show('users', this.id);
    this.userData = response.data.data;
    console.log(this.userData);
  } catch (error) {
    console.error('Error fetching ad data:', error);
  }
},
}
</script>