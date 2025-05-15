<template>
    <div>
        <h1 class="bg-gray-500">ABOUT</h1>
        <div>
            <h1>users</h1>
            <ProfessionalListComponent />
        </div>
        <div>
            <h1>ads</h1>
            <ProfessionalListComponent />
        </div>
        <div>
            <h1>categories</h1>
            <ProfessionalListComponent />
        </div>
        <div>
            <h1>chats</h1>
            <ProfessionalListComponent />
        </div>
        <div>
            <h1>offers</h1>
            <ProfessionalListComponent />
        </div>
    </div>
</template>
<script>
import ProfessionalListComponent from '../components/ProfessionalListComponent.vue';

export default {
    components: {
        ProfessionalListComponent
    },
    data() {
        return {
            user: ''
        }
    },

}
</script>
