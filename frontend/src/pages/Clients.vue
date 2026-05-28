<script setup lang="ts">
import PageHeader from "../components/ViewHeader.vue";
import { ref, computed, onMounted } from "vue";
import { useClientStore } from "../stores/clients.js";

const clientStore = useClientStore();

onMounted(() => {
  clientStore.fetchClients();
});

const isModalOpen = ref(false);
const isEditing = ref(false);
const currentClientId = ref<number | null>(null);

const clientForm = ref({
  name: "",
  surname: "",
  email: "",
  phone: "",
  sex: "F" as "M" | "F" | "Altro",
  notes: "",
});
</script>
<template>
  <div>
    <PageHeader title="Clienti" button-text="Nuovo Cliente" @action="" />
  </div>
</template>
