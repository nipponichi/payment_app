<template>
<div>
  <nav class="absolute top-0 left-0 w-full p-4 bg-transparent z-50 mt-10">
    <div class="flex justify-between items-center w-full">

      <ul class="grid grid-cols-4 gap-4 absolute left-1/2 transform -translate-x-1/2">
        <li>
          <RouterLink to="/" class="w-32 h-12 flex items-center justify-center text-black bg-gray-100 rounded text-lg font-semibold hover:bg-gray-300">
            🏠 Inicio
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/about" class="w-32 h-12 flex items-center justify-center text-black bg-gray-100 rounded text-lg font-semibold hover:bg-gray-300">
            ℹ️ Acerca de
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/service" class="w-32 h-12 flex items-center justify-center text-black bg-gray-100 rounded text-lg font-semibold hover:bg-gray-300">
            🛠️ Servicios
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/contact" class="w-32 h-12 flex items-center justify-center text-black bg-gray-100 rounded text-lg font-semibold hover:bg-gray-300">
            📞 Contacto
          </RouterLink>
        </li>
      </ul>
      
      <div ref="dropdownMenu" class="relative ml-auto mr-10">
        <div @click="toggleDropdown" class="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center ">
          {{ accessToken ? `👤 ${user.user_name || "Usuario"}` : "📝 Cuenta" }}
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        <div v-if="isOpen" class="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg overflow-hidden no-underline">
          <template v-if="!accessToken">
            <RouterLink to="/login" class="block px-4 py-2 text-gray-700 hover:bg-gray-200 no-underline" @click="closeDropdown">
              🔑 Iniciar Sesión
            </RouterLink>
            <RouterLink to="/register" class="block px-4 py-2 text-gray-700 hover:bg-gray-200 no-underline" @click="closeDropdown">
              📝 Registrarse
            </RouterLink>
          </template>

          <template v-else>
            <button @click="preferences" class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200">
              ⚙️ Preferencias
            </button>
            <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200">
              🚪 Cerrar Sesión
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
  <Dialog
    v-model:visible="openUserPreferencesModal"
    header="Preferencias de usuario"
    :modal="true"
    class="w-[95vw] h-[85vh] sm:w-[90vw] sm:h-[80vh] md:w-[85vw] md:h-[75vh] lg:max-w-[1200px] lg:max-h-[800px]"
    headerClass="border-b border-gray-200 p-4 font-semibold text-lg"
    contentClass="p-4"
  >
  <div class="bg-white text-black text-2xl p-8 rounded h-full overflow-auto">
    <UserPreferencesComponent :user="user" />
  </div>
</Dialog>
</div>
</template>

<script>
import AuthService from "../services/api/auth.service";
import { useToast } from 'vue-toastification';
import UserPreferencesComponent from "../modals/UserPreferencesComponent.vue";
import Dialog from 'primevue/dialog';

export default {
  components: {
    UserPreferencesComponent,
    Dialog
  },
  data() {
    return {
      openUserPreferencesModal: false,
      isOpen: false,
      accessToken: null,
      user: "",
      dropdownMenu: null,
      toast: useToast()
    };
  },
  mounted() {
    this.accessToken = localStorage.getItem("token");
    let userStr = localStorage.getItem("user");
    this.user = JSON.parse(userStr);
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  watch: {
    '$route'() {
      this.accessToken = localStorage.getItem("token");
      let userStr = localStorage.getItem("user");
      this.user = JSON.parse(userStr);
    },
    accessToken() {
      this.accessToken = localStorage.getItem("token");
      let userStr = localStorage.getItem("user");
      this.user = JSON.parse(userStr);
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    handleClickOutside(event) {
      if (this.$refs.dropdownMenu && !this.$refs.dropdownMenu.contains(event.target)) {
        this.isOpen = false;
      }
    },
    closeDropdown() {
      this.isOpen = false;
    },
    async logout() {
      const response = await AuthService.logout(this.accessToken)
      console.log(this.accessToken);
      if (response.data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.accessToken = null;
        this.user = "";
        this.$router.push("/login");
        this.toast.success("Logout successful");
      } else {
        this.toast.error("Logout failed");
      }
    },
    async preferences() {
      this.openUserPreferencesModal = true;
    }
  }
};
</script>