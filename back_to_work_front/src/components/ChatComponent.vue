<template>
  <div class="w-96 border border-gray-300 p-4 rounded-lg shadow-md bg-white">
    <div class="h-60 overflow-y-auto border-b border-gray-300 mb-4 p-2">
      <div v-for="(message, index) in messages" :key="index" class="mb-2">
        <span
          :class="{'font-semibold text-green-600': message.userId === userId, 'font-semibold text-blue-600': message.userId !== userId}"
        >
          {{ message.userId === userId ? "Tú" : message.user }}:
        </span>
        <span class="text-gray-700"> {{ message.text }}</span>
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Escribe un mensaje..."
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="sendMessage"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Enviar
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  setup() {
    const ws = ref(null);
    const newMessage = ref("");
    const messages = ref([]);
    const userId = ref(null); // Cambiado a null inicialmente
    let user;
    let userName = ref("");
    let accessToken = ref("");

    onMounted(() => {
      accessToken.value = localStorage.getItem("token");
      userName.value = localStorage.getItem("user");
      const userString = localStorage.getItem("fullUser");
      user = JSON.parse(userString);
      userId.value = user.id; // Asignamos el userId desde el usuario logueado
      console.log(userName.value);
      console.log(user);

      ws.value = new WebSocket("ws://localhost:3000");

      ws.value.onopen = () => console.log("✅ Conectado al WebSocket");

      ws.value.onmessage = (event) => {
        const message = JSON.parse(event.data);
        messages.value.push(message);
      };

      ws.value.onclose = () => console.log("❌ Desconectado del WebSocket");
    });

    onBeforeUnmount(() => {
      if (ws.value) ws.value.close();
    });

    const sendMessage = () => {
      if (newMessage.value.trim() !== "") {
        const message = {
          user: user.name,
          text: newMessage.value,
          userId: user.id, // Usamos el user.id del usuario logueado
        };

        ws.value.send(JSON.stringify(message));

        newMessage.value = "";
      }
    };

    return { newMessage, messages, sendMessage, userId };
  },
};
</script>