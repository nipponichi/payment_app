<template>
  <div class="min-h-screen bg-white pt-44 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-gray-200 p-8 rounded-xl shadow-lg border border-gray-100 h-[580px] flex flex-col">
      <div class="flex flex-col h-full">
        <div class="flex justify-between mb-8">
          <div v-for="(stepName, index) in steps" :key="index" 
            class="text-sm font-semibold px-2 pb-1 border-b-2"
            :class="currentStep === index ? 'text-white bg-blue-500 pt-1 rounded-full' : 'text-gray-400 border-transparent'">
            {{ stepName }}
          </div>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div v-if="currentStep === 0" class="space-y-4">
            <h2 class="text-xl font-bold text-gray-800">Datos Usuario</h2>
            <div>
              <label class="block mb-2 ml-2 text-sm font-medium text-gray-700">Username <span class="text-red-500">*</span></label>
              <input type="text" v-model="form.user_name" placeholder="JohnCobra" class="w-1/2 p-2 ml-2 rounded border border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
            <div>
              <label class="block mb-2 ml-2 text-sm font-medium text-gray-700">Contraseña <span class="text-red-500">*</span></label>
              <input type="password" v-model="form.password" placeholder="1234A." class="w-1/2 p-2 ml-2 rounded border border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"  />
            </div>
            <div>
              <label class="block mb-2 ml-2 text-sm font-medium text-gray-700">Reintroduce contraseña <span class="text-red-500">*</span></label>
              <input type="password" v-model="form.password2" placeholder="1234A." class="w-1/2 p-2 ml-2 rounded border border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"  />
            </div>
            <div>
              <label class="block mb-2 ml-2 text-sm font-medium text-gray-700">Email <span class="text-red-500">*</span></label>
              <input type="email" v-model="form.email" placeholder="johndoe@mail.com" class="w-1/2 p-2 ml-2 rounded border border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"  />
            </div>
          </div>

          <div v-if="currentStep === 1" class="space-y-4">
            <h2 class="text-xl font-bold text-gray-800">Datos Personales</h2>
            <div>
              <label class="block mb-2 ml-2 text-sm font-medium text-gray-700">Nombre <span class="text-red-500">*</span></label>
              <input type="text" v-model="form.firstName" placeholder="John" class="w-1/2 p-2 ml-2 rounded border border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
            <div>
              <label class="block mb-2 ml-2 text-sm font-medium text-gray-700">Apellidos <span class="text-red-500">*</span></label>
              <input type="text" v-model="form.lastName" placeholder="Doe" class="w-1/2 p-2 ml-2 rounded border border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"  />
            </div>
            <div>
              <label class="block mb-2 ml-2 text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" v-model="form.phone" placeholder="654987321" class="w-1/2 p-2 ml-2 rounded border border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"  />
            </div>
            <div>
              <label class="block mb-2 ml-2 text-sm font-medium text-gray-700">Province <span class="text-red-500">*</span></label>
              <Select v-model="form.province" editable :options="provinces" optionLabel="name" :optionValue="(province) => province" placeholder="Select a province" class="w-full md:w-56" />
            </div>
          </div>

          <div v-else-if="currentStep === 2" class="space-y-4">
            <h2 class="text-xl font-bold text-gray-800">Preferencias</h2>
            <div class="flex justify-between">
              <label class="block mb-2 ml-2 text-sm font-medium text-gray-700">Acepto términos y condiciones <span class="text-red-500">*</span></label>
              <input type="checkbox" v-model="form.acceptTerms" />
            </div>
            <div class="flex justify-between">
              <label class="block mb-2 ml-2 text-sm font-medium text-gray-700">Acepto recibir marketing</label>
              <input type="checkbox" v-model="form.acceptMarketing" />
            </div>
            <div class="flex justify-between">
              <label class="block mb-2 ml-2 text-sm font-medium text-gray-700">¿Eres profesional?</label>
              <input type="checkbox" v-model="form.is_pro" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Categorías Pro:</label>
              <select 
                v-model="selectedCategory"
                @change="addCategory"
                :disabled="!form.is_pro || !categories.length"
                class="w-full px-3 py-2 bg-white text-sm font-medium text-gray-700 cursor-pointer border rounded mb-2">
                <option value="" disabled selected>Selecciona categorías</option>
                <option 
                  v-for="category in availableCategories" 
                  :key="category.id" 
                  :value="category"
                  style="cursor: pointer;">
                  {{ category.category }}
                </option>
              </select> 
              <div class="flex items-center gap-2 overflow-x-auto max-w-full whitespace-nowrap flex-shrink-0 py-2">
                <span v-for="(category, index) in form.categories" :key="category.id"
                  class="flex items-center px-2 py-1 text-sm font-small text-white bg-indigo-500 rounded">
                  {{ category.category }}
                  <button @click="removeCategory(index)"
                    class="ml-2 text-xs text-black bg-indigo-500 hover:text-white focus:outline-none"
                    :disabled="!form.is_pro">
                    ✕
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div v-else-if="currentStep === 3" class="space-y-4">
            <h2 class="text-xl font-bold text-gray-800">Confirmación</h2>
            <p>Por favor, revisa tus datos antes de finalizar:</p>
            <ul class="list-disc pl-5">
              <li>Username: {{ form.user_name }}</li>
              <li>Nombre completo: {{ form.firstName }} {{ form.lastName }}</li>
              <li>Email: {{ form.email }}</li>
              <li>Teléfono: {{ form.phone ? form.phone : "No hay teléfono seleccionado" }}</li>
              <li>Provincia: {{ form.province.name }}</li>
              <li>¿Eres profesional?: {{ form.is_pro ? "Sí" : "No" }}</li>
              <li>¿Aceptas términos y condiciones?: {{ form.acceptTerms ? "Sí" : "No" }}</li>
              <li>¿Aceptas recibir marketing?: {{ form.acceptMarketing ? "Sí" : "No" }}</li>
              <li>Categorías: 
                <span v-if="form.categories.length > 0">
                  {{ form.categories.map(c => c.category).join(', ') }}
                </span>
                <span v-else>No hay categorías seleccionadas</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="mt-auto pt-6 flex border-t border-gray-200"
          :class="{'justify-between': currentStep > 0, 'justify-end': currentStep === 0}">
          <button 
            v-if="currentStep > 0"
            @click="prevStep" 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Anterior
          </button>

          <button 
            @click="nextStep" 
            :disabled="!canProceed"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {{ currentStep === steps.length - 1 ? "Finalizar" : "Siguiente" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import UserService from '../services/api/user.service';
import Select from 'primevue/select';
import { useToast } from 'vue-toastification';

export default {
components: {
    Select,
  },
  data() {
    return {
      selectedCategory: null,
      provinces: [],
      categories: [],
      currentStep: 0,
      selectedProvince: null,
      selectedCategory: null,
      form: {
        user_name: "",
        name: "",
        firstName: "",
        lastName: "",
        password: "",
        password2: "",
        email: "",
        phone: "",
        province: "",
        province_id: "",
        is_pro: false,
        acceptTerms: false,
        acceptMarketing: false,
        categories: []
      },
      steps: ["1", "2", "3", "4"],
      toast: useToast()
    };
  },
  components: {   
    Select,
  },
  async mounted() {
    await this.fetchProvinces()
    await this.fetchCategories()
  },
  computed: {
    canProceed() {
      if (this.currentStep === 0) {
        return this.form.user_name && this.form.email &&
          this.form.password && this.form.password2 &&
          this.form.password === this.form.password2;
      } else if (this.currentStep === 1) {
        return this.form.firstName && this.form.lastName && 
        this.form.province;
      } else if (this.currentStep === 2) {
        if (this.form.is_pro) {
          return this.form.categories.length > 0;
        }
        return this.form.acceptTerms;
      }
      return true;
    },
    availableCategories() {
      return this.categories.filter(cat => 
        !this.form.categories.some(selected => selected.id === cat.id)
      );
    },
  },
  methods: {
    addCategory() {
      if (this.selectedCategory && !this.form.categories.some(c => c.id === this.selectedCategory.id)) {
        this.form.categories.push(this.selectedCategory);
        this.selectedCategory = null;
      }
    },
    
    removeCategory(index) {
      this.form.categories.splice(index, 1);
    },
    async fetchProvinces() {
      try {
        const response = await UserService.get("provinces");
        this.provinces = response.data.data;
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await UserService.get("categories");
        this.categories = response.data.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },

    async saveUser() {
      try {
        this.form.name = `${this.form.firstName} ${this.form.lastName}`
        if (this.form.province && typeof this.form.province === 'object') {
          this.form.province_id = this.form.province.id;
        }
        const response = await UserService.set('users', this.form);
        if (response.data.success) {
          this.toast.success("User registered successfully");
          this.$router.push("/login");
        } else {
          this.toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error saving user:', error);
        this.toast.error("Error saving user");
      }
    },

    nextStep() {
      console.log(this.currentStep)
      console.log(this.steps.length-1)
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      } else if (this.currentStep === this.steps.length - 1) {
        this.saveUser();
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    }
  },
  watch: {
    'form.name': function() {
      this.form.name = `${this.form.firstName} ${this.form.lastName}`;
    },
    
    'form.province':function() {
      console.log(this.form.province)
    },

    'form.is_pro': function(newVal) {
      if (!newVal) {
        this.form.categories = [];
      }
      if (this.currentStep > 3) {
        this.currentStep = 3;
      }
    },
  },
  
};
</script>

  