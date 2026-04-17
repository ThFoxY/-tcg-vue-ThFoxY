<template>
  <NFlex justify="space-around" wrap>
    <NCard title="Créer une partie" style="width: 900px">
      <NSelect
        v-model:value="selectedDeckId"
        :options="deckOptions"
        placeholder="Sélectionner un deck"
      />
      <NDivider />
      <NButton
        :disabled="!selectedDeckId"
        type="primary"
        @click="handleCreateRoom"
        >Créer la partie</NButton
      >
    </NCard>

    <NCard title="Parties disponibles" style="width: 900px">
      <NFlex v-if="socketStore.rooms.length > 0" vertical :gap="8">
        <PublicGame
          v-for="room in socketStore.rooms"
          :id="room.id"
          :key="room.id"
          :host="room.hostSocketId"
          :deck-options="deckOptions"
          @join="(deckId: number) => handleJoinRoom(room.id, deckId)"
        />
      </NFlex>
      <NEmpty v-else description="Aucune partie disponible pour le moment 🥲" />
    </NCard>
  </NFlex>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { ref, watch } from 'vue'

import PublicGame from '@/components/game/PublicGame.vue'
import { useSocketStore } from '@/store/socket.store'

const socketStore = useSocketStore()
const message = useMessage()

const selectedDeckId = ref<number | null>(null) // Stocke l'ID du deck sélectionné pour créer une partie ou en rejoindre une

// Affiche un message si un message d'information est disponible
watch(
  () => socketStore.message,
  (msg) => {
    if (msg) {
      message.info(msg)
      socketStore.message = null
    }
  },
)

// Affiche un message d'erreur si une erreur est disponible
watch(
  () => socketStore.error,
  (err) => {
    if (err) {
      message.error(err)
      socketStore.error = null
    }
  },
)

// Gère la logique pour créer une partie en fonction de l'ID du deck sélectionné
const handleCreateRoom = () => {
  if (!selectedDeckId.value) return

  socketStore.createRoom(selectedDeckId.value)
}

// Gère la logique pour rejoindre une partie en fonction de l'ID de la salle et de l'ID du deck sélectionné
const handleJoinRoom = (roomId: number, deckId: number) => {
  if (!deckId) return

  socketStore.joinRoom(roomId, deckId)
}

// Liste des props
defineProps<{
  deckOptions: { label: string; value: number }[] // Stocke les options de decks disponibles pour créer une partie ou en rejoindre une
}>()
</script>
