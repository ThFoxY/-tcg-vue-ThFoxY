<template>
  <NFlex v-if="opponentBoard" align="center" :gap="24">
    <NStatistic label="KOs" :value="opponentBoard.board.score ?? 0" />
    <PokemonCard
      v-if="opponentBoard.board.activeCard"
      size="md"
      :pokemon="opponentBoard.board.activeCard.card"
      :current-hp="opponentBoard.board.activeCard.currentHp ?? 0"
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

// RG2 : Récupère les informations de l'adversaire
const opponentBoard = computed(() => socketStore.opponentBoard)
</script>
