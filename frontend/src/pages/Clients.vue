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
  birth_date: "",
  notes: "",
});
const resetForm = () => {
  clientForm.value = { name: "", surname: "", email: "", phone: "", sex: "Altro", notes: "", birth_date: "" };
  isEditing.value = false;
  currentClientId.value = null;
};

const handleAddClient = () => {
  resetForm();
  isModalOpen.value = true;
};

const editClient = (id: number) => {
  const clientToEdit = clientStore.clientsList.find((c) => c.id === id);
  if (clientToEdit) {
    clientForm.value = {
      name: clientToEdit.name,
      surname: clientToEdit.surname,
      email: clientToEdit.email,
      phone: clientToEdit.phone,
      sex: clientToEdit.sex,
      birth_date: clientToEdit.birth_date || "",
      notes: clientToEdit.notes,
    };
    isEditing.value = true;
    currentClientId.value = id;
    isModalOpen.value = true;
  }
};

const saveClient = async () => {
  try {
    if (isEditing.value && currentClientId.value) {
      await clientStore.editClient(currentClientId.value, clientForm.value);
    } else {
      await clientStore.createClient(clientForm.value);
    }

    isModalOpen.value = false;
  } catch (error) {
    console.error("Errore durante il salvataggio del cliente:", error);
  }
};

const deleteClient = async (id: number) => {
  if (confirm("Sei sicuro di voler eliminare questo cliente?")) {
    try {
      await clientStore.deleteClient(id);
    } catch (error) {
      console.error("Errore durante l'eliminazione del cliente:", error);
    }
  }
};

const getInitials = (name: string, surname: string) => {
  return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
};
</script>
<template>
  <div>
    <PageHeader title="Clienti" button-text="Nuovo Cliente" @action="" />
  </div>
</template>
