<template>
  <NCard :title="`Partie #${id}`">
    <p>Hôte : {{ host }}</p>
    <NSelect
      v-model:value="deckId"
      :options="deckOptions"
      placeholder="Sélectionner un deck"
    />
    <NDivider />
    <NButton :disabled="!deckId" type="primary" @click="emit('join', deckId!)"
      >Rejoindre</NButton
    >
  </NCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const deckId = ref<number | null>(null) // Stocke l'ID du deck sélectionné pour rejoindre une partie

// Liste de props
defineProps<{
  id: number // Stocke l'ID de la partie
  host: string // Stocke le nom de l'hôte de la partie
  deckOptions: { label: string; value: number }[] // Stocke les options de decks disponibles pour rejoindre une partie
}>()

// Liste des événements émis
const emit = defineEmits<{
  join: [deckId: number] // Événement émis lorsqu'on clique sur le bouton "Rejoindre", avec l'ID du deck sélectionné pour rejoindre la partie
}>()
</script>
