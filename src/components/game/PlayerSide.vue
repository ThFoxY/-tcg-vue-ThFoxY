<template>
  <NFlex vertical :gap="16">
    <NFlex v-if="player" align="center" :gap="24">
      <NStatistic label="KOs" :value="player.score ?? 0" />
      <PokemonCard
        v-if="player.fieldCard"
        size="md"
        :pokemon="player.fieldCard.card"
        :current-hp="player.fieldCard.currentHp ?? 0"
        :selected="false"
        :disabled="true"
      />
      <NEmpty v-else description="Aucun Pokémon en jeu 🥲" />
    </NFlex>
    <NEmpty v-else description="Vous avez du retard 👀"></NEmpty>
  </NFlex>
  <NFlex align="center" :gap="8">
    <NText>Main ({{ player?.handCards.length ?? 0 }}/5)</NText>
  </NFlex>
  <NFlex :gap="8" wrap>
    <div v-for="card in player?.handCards" :key="card.id">
      <PokemonCard
        size="sm"
        :pokemon="card"
        :selected="false"
        :disabled="!isCardPlayable"
        :current-hp="null"
        @click="socketStore.playCard(card.id)"
      />
    </div>
  </NFlex>
  <NFlex align="center" :gap="8">
    <NText>Deck : {{ player?.deckSize ?? 0 }} cartes restantes</NText>
  </NFlex>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import PokemonCard from '@/components/PokemonCard.vue'
import { useSocketStore } from '@/store/socket.store'

const socketStore = useSocketStore()
// Récupère les informations sur le joueur courant
const player = computed(() =>
  socketStore.playerRole === 'hôte'
    ? socketStore.gameBoards?.host
    : socketStore.gameBoards?.opponent,
)

// RG2 : Détermine si les cartes sont jouables (tour du joueur courant et n'est pas déjà sur le terrain)
// computed() permet de mettre à jour le booléen :disabled des cartes dès lors que les dépendances sont redéfinies (tour et carte jouée)
const isCardPlayable = computed(
  () => socketStore.playerTurn && !player.value?.fieldCard,
)
</script>
