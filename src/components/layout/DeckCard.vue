<template>
  <NCard :title="deck.name">
    <NGrid cols="5" :x-gap="8" :y-gap="8">
      <NGridItem v-for="card in deck.cards" :key="card.cardId">
        <PokemonCard
          v-if="getCard(card)"
          size="sm"
          :pokemon="getCard(card)!"
          :selected="false"
          :disabled="false"
        />
      </NGridItem>
    </NGrid>
    <slot name="buttons"></slot>
  </NCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import PokemonCard from '@/components/layout/PokemonCard.vue'
import { useApi } from '@/composables/useApi'
import type { Card, Deck, DeckCard } from '@/types'

const api = useApi()
const cards = ref<Card[]>([]) // Stocke toutes les cartes récupérées depuis l'API

// Fonction anonyme qui renvoie l'objet Card correspondant à un objet DeckCard
const getCard = (deckCard: DeckCard): Card | undefined => {
  // On compare l'ID de la carte avec celle du deck. Si elle correspond, ça veut dire qu'elle est dans le deck ! ^^o
  return cards.value.find((card) => card.id === deckCard.cardId)
}

// Récupérer les cartes depuis l'API pour pouvoir les afficher dans les decks
onMounted(async () => {
  cards.value = await api.getCards()
})

// Liste des props
defineProps<{
  deck: Deck
}>()
</script>
