<template>
  <form @submit.prevent="submitForm" enctype="multipart/form-data">
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2">Nombre:</label>
      <input
        type="text"
        v-model="formData.name"
        required
        minlength="3"
        maxlength="50"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
    </div>

    <div class="mb-4">
      <label class="block mb-2 text-sm font-medium text-gray-700">Province</label>
      <Select v-model="formData.location" editable :options="provinces" optionLabel="name" :optionValue="(province) => province" placeholder="Select a province" class="w-full md:w-56" />
    </div>


    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2">Categoría:</label>
      <Select v-model="formData.category_id" editable :options="categories" optionLabel="category" :optionValue="(category) => category" placeholder="Select a category" class="w-full md:w-56" />
      <p v-if="errors.category_id" class="mt-1 text-sm text-red-600">{{ errors.category_id }}</p>
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2">Descripción:</label>
      <textarea
        v-model="formData.description"
        required
        noResizable
        minlength="10"
        maxlength="500"
        rows="4"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
      <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
    </div>

    <div class="mb-6">
      <label class="block text-gray-700 font-medium mb-2">
        Subir media: 
        <span class="text-sm text-gray-500">(Máx. 5 fotos y 1 video)</span>
      </label>
      
      <div class="flex flex-col items-center">
        <div class="w-full overflow-x-auto">
          <div class="flex space-x-2 py-2">
            <label v-if="!previews.length" class="flex-shrink-0 w-16 h-16 rounded border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <input 
                type="file" 
                @change="handleFileUpload"
                accept=".jpg,.jpeg,.png,.mp4"
                multiple
                class="hidden"
              >
            </label>
      
            <div v-for="(preview, index) in previews" :key="index" class="relative flex-shrink-0">
              <div class="w-16 h-16 rounded border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                <img v-if="preview.type.startsWith('image')" 
                     :src="preview.url" 
                     class="w-full h-full object-cover">
                
                <div v-else class="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <button 
                @click="removeFile(index)"
                class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                title="Eliminar"
              >
                ×
              </button>
            </div>
            <label v-if="previews.length > 0 && previews.length < 6" class="flex-shrink-0 w-16 h-16 rounded border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <input 
                type="file" 
                @change="handleFileUpload"
                accept=".jpg,.jpeg,.png,.mp4"
                multiple
                class="hidden"
              >
            </label>
          </div>
        </div>
        <p class="mt-1 text-xs text-gray-500">Formatos: JPG, PNG, MP4</p>
      </div>
    </div>
    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
      Enviar
    </button> 
  </form>
</template>

<script>
import { useToast } from 'vue-toastification'
import UserService from '../services/api/user.service';
import Select from 'primevue/select';

export default {
  components: {
    Select
  },
  data() {
    return {
      provinces: [],
      categories: [],
      formData: {
        name: '',
        description: '',
        category_id: '',
        location: '',
        is_done:'',
        media: [],
      },
      errors: {
        name: '',
        description: '',
        category_id: '',
        location: '',
        is_done:'',
        media: []
      },
      validImageExtensions: ['image/jpeg', 'image/jpg', 'image/png'],
      validVideoExtensions: ['video/mp4'],
      previews: [],
      user:'',
      toast: useToast(),
    }
  },
  async mounted() {
    this.fetchCategories();
    await this.fetchProvinces()
    let userStr = localStorage.getItem("user");
    let user2 = JSON.parse(userStr);
    this.user=user2;
    console.log(user2);
  },
  computed: {
    hasVideo() {
      return this.previews.some(file => file.type.startsWith('video/'));
    },
    imageCount() {
      return this.previews.filter(file => file.type.startsWith('image/')).length;
    }
  },
  methods: {
    async fetchProvinces() {
      try {
        const response = await UserService.get("provinces");
        this.provinces = response.data.data;
        console.log(this.provinces);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await UserService.get("categories");
        if (response.data.success) {
          this.categories = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    handleFileUpload(event) {
      this.errors.media = '';
      const files = Array.from(event.target.files);
      
      const invalidFiles = files.filter(file => 
        !this.validImageExtensions.includes(file.type) && 
        !this.validVideoExtensions.includes(file.type)
      );
      
      if (invalidFiles.length > 0) {
        this.toast.error('Solo se permiten imágenes JPG, JPEG, PNG o videos MP4');
        return;
      }
      
      const videoFiles = files.filter(file => this.validVideoExtensions.includes(file.type));
      if (videoFiles.length > 1 || (this.hasVideo && videoFiles.length > 0)) {
        this.toast.error('Solo se permite 1 video');
        return;
      }
      
      const imageFiles = files.filter(file => this.validImageExtensions.includes(file.type));
      const totalImages = this.imageCount + imageFiles.length;
      if (totalImages > 5) {
        this.toast.error('Máximo 5 fotos permitidas');
        return;
      }
      
      files.forEach(file => {
        if ((this.validImageExtensions.includes(file.type) && this.imageCount < 5) || 
            (this.validVideoExtensions.includes(file.type) && !this.hasVideo)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.previews.push({
              url: e.target.result,
              type: file.type,
              file: file
            });
          };
          reader.readAsDataURL(file);
        }
      });
      
      console.log(this.previews);
    },
    removeFile(index) {
      this.previews.splice(index, 1);
      this.formData.media = this.previews.map(preview => preview.file);
    },
    validateForm() {
      let isValid = true;

      if (this.formData.name.length < 3) {
        this.errors.name = 'El nombre debe tener al menos 3 caracteres';
        isValid = false;
      } else {
        this.errors.name = '';
      }

      if (this.formData.location.length < 3) {
        this.errors.location = 'La localización debe tener al menos 3 caracteres';
        isValid = false;
      } else {
        this.errors.location = '';
      }

      if (!this.formData.category_id) {
        this.errors.category_id = 'Por favor seleccione una categoría';
        isValid = false;
      } else {
        this.errors.category_id = '';
      }

      if (this.formData.description.length < 5) {
        this.errors.description = 'La descripción debe tener al menos 10 caracteres';
        isValid = false;
      } else {
        this.errors.description = '';
      }

      if (this.previews.length === 0) {
        this.errors.media = 'Debe subir al menos un media';
        isValid = false;
      } else {
        this.errors.media = '';
      }
      
      return isValid;
    },

    async submitForm() {
      if (this.validateForm()) {
        const formDataToSend = new FormData();
        
        formDataToSend.append('name', this.formData.name);
        formDataToSend.append('location', this.formData.location);
        formDataToSend.append('is_done', 0);
        formDataToSend.append('category_id', this.formData.category_id);
        formDataToSend.append('description', this.formData.description);
        formDataToSend.append('user_id', this.user.id);
        this.previews.forEach((preview, index) => {
          formDataToSend.append(`media[${index}]`, preview.file);
        });
        

        for (let [key, value] of formDataToSend.entries()) {
          console.log(key, value);
        }

        try {
          const response = await UserService.set("ads", formDataToSend);
          console.log(response.data)

        } catch (error) {
          console.error('Error:', error.response?.data || error.message);
          alert('Error: ' + (error.response?.data?.message || error.message));
        }
      }
    }
  }
}
</script>


