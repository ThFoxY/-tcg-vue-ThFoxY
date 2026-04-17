<template>
  <NFlex v-if="opponent" align="center" :gap="24">
    <NStatistic label="KOs" :value="opponent.score ?? 0" />
    <PokemonCard
      v-if="opponent.fieldCard"
      size="md"
      :pokemon="opponent.fieldCard.card"
      :current-hp="opponent.fieldCard.currentHp ?? 0"
      :selected="false"
      :disabled="true"
    />
    <NEmpty v-else description="Aucun Pokémon en jeu 🥲" />
  </NFlex>
  <NEmpty v-else description="L'adversaire est en retard 👀"></NEmpty>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import PokemonCard from '@/components/PokemonCard.vue'
import { useSocketStore } from '@/store/socket.store'

const socketStore = useSocketStore()

// Récupère les informations de l'adversaire
const opponent = computed(() =>
  socketStore.playerRole === 'hôte'
    ? socketStore.gameBoards?.opponent
    : socketStore.gameBoards?.host,
)
</script>
