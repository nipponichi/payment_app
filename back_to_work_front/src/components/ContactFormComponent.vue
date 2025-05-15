<script setup>
    import { listaContact } from '../services/contactServices';
</script>
<template>
    <div>
        <h3>Mensajes de contactos:</h3>
        <div v-for="contact in listaContact" :key="contact.id">
            <a href="#"> Mensaje: {{ contact.title + " " + contact.content }}</a>
        </div>
    </div>
</template>