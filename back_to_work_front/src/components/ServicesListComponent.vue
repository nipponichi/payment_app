<template>
  <div class="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">

    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Advertisement Management</h1>
        
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <div class="flex-grow">
            <AdverFilters 
              class="filter-container" 
              :categories="categories"
              @filter-change="handleFilterChange"
            />
          </div>
          <div class="relative flex-grow">
            <InputText 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search ads..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 shadow-sm hover:border-gray-400"
            />
            <svg class="absolute right-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button 
            @click="openCreateAdModal = true" 
            class="cursor-pointer flex items-center justify-center px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            New Ad
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto mt-8">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <DataTable
          ref="dt"
          :value="filteredAds"
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
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} ads"
          class="p-datatable-lg cursor-pointer bg-white custom-datatable"
          tableStyle="min-width: 50rem"
          >
          <template #empty> 
            <div class="p-6 text-center text-gray-800 text-lg bg-white">
              No ads found. Create your first ad!
            </div>
          </template>
          <template #loading> 
            <div class="p-6 text-center text-gray-800 text-lg bg-white">
              <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-amber-500 mb-3"></div>
              <p class="text-lg">Loading ads data...</p>
            </div>
          </template>
          
          <Column field="name" header="Name" sortable 
            headerClass="font-bold text-gray-800 bg-white p-4 text-left text-xl"
            bodyClass="p-4 bg-white">
            <template #body="{ data }">
              <span class="font-semibold text-gray-800 text-lg">{{ data.name }}</span>
            </template>
          </Column>
          
          <Column field="description" header="Description" 
            headerClass="font-bold text-gray-800 bg-white p-4 text-left text-xl"
            bodyClass="p-4 bg-white">
            <template #body="{ data }">
              <p class="text-gray-800 text-lg">{{ data.description }}</p>
            </template>
          </Column>
    
          <Column field="category" header="Category" 
            headerClass="font-bold text-gray-800 bg-white p-4 text-left text-xl"
            bodyClass="p-4 bg-white">
            <template #body="{ data }">
              <span class="text-lg text-gray-800">{{ getCategoryName(data.category_id) }}</span>
            </template>
          </Column>
          
          <Column field="location" header="Location" sortable 
            headerClass="font-bold text-gray-800 bg-white p-4 text-left text-xl"
            bodyClass="p-4 bg-white">
            <template #body="{ data }">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="text-lg text-gray-800">{{ data.location }}</span>
              </div>
            </template>
          </Column>
          
          <Column field="due_date" header="Due Date" sortable 
            headerClass="font-bold text-gray-800 bg-white p-4 text-left text-xl"
            bodyClass="p-4 bg-white">
            <template #body="{ data }">
              <span class="whitespace-nowrap text-lg text-gray-800">{{ formatDate(data.due_date) }}</span>
            </template>
          </Column>
          
          <Column field="is_done" header="Status" 
            headerClass="font-bold text-gray-800 bg-white p-4 text-left text-xl"
            bodyClass="p-4 bg-white">
            <template #body="{ data }">
              <Tag 
                :value="data.is_done ? 'Completed' : 'Pending'" 
                :severity="data.is_done ? 'success' : 'warning'" 
                class="px-4 py-2 rounded-full text-base font-semibold"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <Dialog
      v-model:visible="openCreateAdModal"
      header="Create New Advertisement"
      :modal="true"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      headerClass="border-b border-gray-200 p-4 font-semibold text-lg"
      contentClass="p-4"
    >
      <div class="bg-white text-black text-2xl p-8 rounded">
        <AdsFormComponent />
      </div>
    </Dialog>

    <Dialog
      v-model:visible="openAdDetailModal"
      header="Ad details"
      :modal="true"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      headerClass="border-b border-gray-200 p-4 font-semibold text-lg"
      contentClass="p-4"
    >
      <div class="bg-white text-black text-2xl p-8 rounded">
        <AdDetailComponent  :id="selectedId"/>
      </div>
    </Dialog>
  </div>
</template>

<script>
import AdDetailComponent from '../modals/AdDetailComponent.vue';
import AdsFormComponent from "../modals/AdsFormComponent.vue";
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import { useToast } from 'vue-toastification';
import UserService from '../services/api/user.service';

export default {
  components: {
      AdDetailComponent,
      AdsFormComponent,
      InputText,
      DataTable,
      Column,
      Tag,
      Dialog
  },
  data() {
      return {
          searchQuery: '',
          loading: true,
          sortField: null,
          sortOrder: null,
          ads: [],
          categories: [],
          openCreateAdModal: false,
          openAdDetailModal: false,
          selectedCategory: null,
          statusFilter: null,
          toast: useToast(),
          selectedId: ''
      };
  },
  computed: {
      filteredAds() {
          if (!this.searchQuery) return this.ads;
          
          return this.ads.filter(ad =>
              ad.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              ad.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              ad.location.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
      }
  },
  mounted() {
      this.fetchCategories();
      this.fetchAds();
  },
  methods: {
      onRowClick(id) {
          this.selectedId = id;
          this.openAdDetailModal = true;
      },

      formatDate(dateString) {
          if (!dateString) return '';
          const options = { year: 'numeric', month: 'short', day: 'numeric' };
          return new Date(dateString).toLocaleDateString(undefined, options);
      },

      getCategoryName(categoryId) {
          const category = this.categories.find(cat => cat.id === categoryId);
          return category ? category.category : 'Uncategorized';
      },

      handleFilterChange(filters) {
          this.selectedCategory = filters.category;
          this.statusFilter = filters.status;
      },
      onSort(event) {
          this.sortField = event.sortField;
          this.sortOrder = event.sortOrder;
      },
      submitAdForm() {
          console.log("Submitting ad form...");
          this.openCreateAdModal = false;
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
      async fetchAds() {
          try {
              const response = await UserService.get("ads");
              if (response.data.success) {
                  this.ads = response.data.data;
              }
              this.loading = false;
          } catch (error) {
              console.error("Error fetching ads:", error);
              this.loading = false;
          }
      }
  }
};
</script>

<style>

.custom-datatable .p-datatable-tbody > tr:not(.p-highlight):hover {
  background-color: #dddddd !important;
  color: white !important;
}

.custom-datatable .p-datatable-tbody > tr:not(.p-highlight):hover > td {
  background-color: inherit !important;
  color: white !important;
}

.custom-datatable .p-datatable-tbody > tr > td {
  background-color: #ffffff !important;
  transition: background-color 0.2s ease;
  color: white !important;
}

/* .custom-datatable .p-datatable-tbody > tr.p-highlight,
.custom-datatable .p-datatable-tbody > tr.p-highlight > td {
  background-color: #eec00b !important;
} */

.custom-datatable .p-datatable-tbody > tr:not(.p-highlight):hover .p-tag {
  background-color: #4b5563 !important;
  color: white !important;
}
</style>