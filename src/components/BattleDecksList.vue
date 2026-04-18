<template>
  <NFlex v-for="deck in decks" :key="deck.id" vertical>
    <BattleDeck :deck="deck" :cards="cards">
      <template #buttons>
        <slot name="buttons" :deck="deck"></slot>
      </template>
    </BattleDeck>
  </NFlex>
</template>

<script setup lang="ts">
import BattleDeck from '@/components/BattleDeck.vue'
import type { Card, Deck } from '@/types'

// Liste de props
defineProps<{
  decks: Deck[] // Liste des decks à afficher
  cards: Card[] // Liste de toutes les cartes Pokémon pour éviter les appels redondants à l'API dans chaque deck
}>()
</script>
