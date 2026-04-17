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
          :host="room.host.username"
          :deck-options="deckOptions"
          @join="(deckId: number) => handleJoinRoom(room.id, deckId)"
        />
      </NFlex>
      <NEmpty v-else description="Aucune partie disponible pour le moment 🥲" />
    </NCard>
  </NFlex>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import PublicGame from '@/components/game/PublicGame.vue'
import { useSocketStore } from '@/store/socket.store'

const socketStore = useSocketStore()

const selectedDeckId = ref<number | null>(null) // Stocke l'ID du deck sélectionné pour créer une partie ou en rejoindre une

const handleCreateRoom = () => {
  if (!selectedDeckId.value) return

  socketStore.createRoom(selectedDeckId.value)
}

//
const handleJoinRoom = (roomId: string, deckId: number) => {
  if (!deckId) return

  socketStore.joinRoom(roomId, deckId)
}

// Liste des props
defineProps<{
  deckOptions: { label: string; value: number }[] // Stocke les options de decks disponibles pour créer une partie ou en rejoindre une
}>()
</script>
