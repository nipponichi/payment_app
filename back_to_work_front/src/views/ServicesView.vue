<template>
    <div class="flex items-center justify-center mt-20 bg-white"> 
        <div v-if="user.is_pro">       
            <ServicesListComponent />
        </div>
        <div v-else>
            <ProfessionalListComponent />
        </div>
    </div>
</template>

<script>
import ServicesListComponent from '../components/ServicesListComponent.vue';
import ProfessionalListComponent from '../components/ProfessionalListComponent.vue';

export default {
    components: {
        ServicesListComponent,
        ProfessionalListComponent
    },
    data() {
        return {
            user: ''
        }
    },
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user'));
        console.log(this.user);
    }
}
</script>