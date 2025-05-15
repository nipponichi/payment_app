<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Professional Inquiries</h1>
        
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <div class="relative flex-grow">
            <InputText 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search users..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 shadow-sm hover:border-gray-400"
            />
            <svg class="absolute right-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto mt-8">
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <DataTable
          ref="dt"
          :value="filteredUsers"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          :loading="loading"
          :sortField="sortField"
          :sortOrder="sortOrder"
          @sort="onSort"
          @rowClick="onRowClick($event.data.id)"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
          class="p-datatable-lg cursor-pointer bg-white custom-datatable"
          tableStyle="min-width: 50rem"
        >
        <template #empty>
          <div class="p-6 text-center text-gray-800 text-lg bg-white">
            No users found.
          </div>
        </template>
        <template #loading> 
          <div class="p-6 text-center text-gray-800 text-lg bg-white">
            <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-amber-500 mb-3"></div>
            <p class="text-lg">Loading users data...</p>
          </div>
        </template>
        
        <Column field="name" header="Name" sortable 
          headerClass="font-bold text-gray-800 bg-white p-4 text-left text-xl"
          bodyClass="p-4 bg-white">
          <template #body="{ data }">
            <span class="font-semibold text-gray-800 text-lg">{{ data.name }}</span>
          </template>
        </Column>  
        <Column field="categories" header="Categories"
          headerClass="font-bold text-gray-800 bg-white p-4 text-left text-xl"
          bodyClass="p-4 bg-white">
          <template #body="{ data }">
            <div v-if="data.categories && data.categories.length > 0">
              <span v-for="(category, index) in data.categories" :key="category.id" class="text-gray-800 text-lg">
                {{ category.category }}
                <span v-if="index < data.categories.length - 1">, </span>
              </span>
            </div>
            <span v-else class="text-gray-500 text-lg">No categories</span>
          </template>
        </Column>
        <Column 
        header="Actions" 
        headerClass="font-bold text-gray-800 bg-white p-4 text-left text-xl"
        bodyClass="p-4 bg-white"
      >
        <template #body="{ data }">
          <div class="flex gap-2">
            <Tooltip 
              position="top" 
              content="Iniciar chat" 
              :showDelay="300" 
              appendTo="body"
            >
              <button 
                class="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-300 flex items-center justify-center transition-colors cursor-pointer"
                @click="openChat(data)"
              >
                <i class="pi pi-comment text-white"></i>
              </button>
            </Tooltip>
      
            <Tooltip 
              position="top" 
              content="Segunda acción" 
              :showDelay="300" 
              appendTo="body"
            >
              <button 
                class="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-300 flex items-center justify-center transition-colors cursor-pointer"
                @click="otraFuncion(data)"
              >
                <i class="pi pi-cog text-white"></i>
              </button>
            </Tooltip>
          </div>
        </template>
      </Column>
      </DataTable>
      </div>
    </div>
    <Dialog
      v-model:visible="openProDetailModal"
      header="Preferencias de usuario"
      :modal="true"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      headerClass="border-b border-gray-200 p-4 font-semibold text-lg"
      contentClass="p-4"
    >
      <div class="bg-white text-black text-2xl p-8 rounded">
        <ProDetailComponent  :id="selectedId"/>
      </div>
    </Dialog>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'vue-toastification';
import UserService from '../services/api/user.service';
import ProDetailComponent from '../modals/ProDetailComponent.vue';
import Dialog from 'primevue/dialog';

export default {
  components: {   
      InputText,
      DataTable,
      Column,
      ProDetailComponent,
      Dialog
  },
  data() {
      return {
        openProDetailModal: false,
        selectedId: null,
        searchQuery: '',
        loading: true,
        sortField: null,
        sortOrder: null,          users: [],
        toast: useToast()
      };
  },
  computed: {
      filteredUsers() {
          if (!this.searchQuery) return this.users;
          
          return this.users.filter(user =>
              user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
      }
  },
  mounted() {
      this.fetchProfessionalUsers();
  },
  methods: {
      onRowClick(id) {
          this.selectedId = id;
          this.openProDetailModal = true;
      },

      onSort(event) {
          this.sortField = event.sortField;
          this.sortOrder = event.sortOrder;
      },
      async fetchProfessionalUsers() {
          try {
              const response = await UserService.get("users");
              if (response.data.success) {
                  this.users = response.data.data;
              }
              this.loading = false;
          } catch (error) {
              console.error("Error fetching users:", error);
              this.loading = false;
          }
      }
  }
};
</script>
