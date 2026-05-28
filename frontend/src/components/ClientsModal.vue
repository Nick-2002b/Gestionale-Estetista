<script setup lang="ts">
import { ref, watch } from "vue";
import BaseModal from "./BaseModal.vue";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close", "save"]);

const name = ref("");
const surname = ref("");
const sex = ref<"F" | "M" | "Altro" | "">("");
const birthDate = ref("");
const phone = ref("");
const email = ref("");
const notes = ref("");

watch(
  () => props.isOpen,
  (isNowOpen) => {
    if (isNowOpen) {
      name.value = "";
      surname.value = "";
      sex.value = "";
      birthDate.value = "";
      phone.value = "";
      email.value = "";
      notes.value = "";
    }
  },
);

const handleSave = async () => {
  if (!name.value || !surname.value) {
    alert("I campi Nome e Cognome sono obbligatori.");
    return;
  }

  const payload = {
    name: name.value,
    surname: surname.value,
    sex: sex.value,
    birth_date: birthDate.value,
    phone: phone.value,
    email: email.value,
    notes: notes.value,
  };

  emit("save", payload);
};
</script>

<template>
  <BaseModal :is-open="isOpen" title="Nuovo Cliente" @close="$emit('close')">
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"> Nome <span class="text-red-500">*</span> </label>
          <input type="text" v-model="name" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none" placeholder="Nome" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"> Cognome <span class="text-red-500">*</span> </label>
          <input type="text" v-model="surname" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none" placeholder="Cognome" />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"> Sesso </label>
          <select v-model="sex" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none bg-surface">
            <option value="" disabled>Seleziona</option>
            <option value="F">Donna</option>
            <option value="M">Uomo</option>
            <option value="Altro">Altro</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"> Data di nascita </label>
          <input type="date" v-model="birthDate" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"> Telefono </label>
          <input type="tel" v-model="phone" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none" placeholder="+39" />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"> Email </label>
          <input
            type="email"
            v-model="email"
            class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"
            placeholder="email@esempio.com" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Note</label>
        <textarea
          v-model="notes"
          rows="3"
          placeholder="Note, preferenze o informazioni mediche rilevanti..."
          class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"></textarea>
      </div>
    </div>

    <template #footer>
      <button @click="$emit('close')" class="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors bg-white shadow-sm disabled:opacity-50">
        Annulla
      </button>
      <button @click="handleSave" class="px-5 py-2.5 font-medium rounded-xl bg-primary hover:bg-primary/70 transition-colors shadow-sm disabled:opacity-50 inline-flex items-center">
        Crea Cliente
      </button>
    </template>
  </BaseModal>
</template>
