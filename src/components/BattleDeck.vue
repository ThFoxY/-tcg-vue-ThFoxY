<template>
  <NCard :title="deck.name">
    <NGrid responsive="screen" cols="2 s:3 m:4 l:5" :x-gap="8" :y-gap="8">
      <NGridItem v-for="card in deck.cards" :key="card.cardId">
        <PokemonCard
          v-if="getCard(card)"
          size="sm"
          :pokemon="getCard(card)!"
          :selected="false"
          :disabled="false"
          :current-hp="null"
        />
      </NGridItem>
    </NGrid>
    <slot name="buttons"></slot>
  </NCard>
</template>

<script setup lang="ts">
import PokemonCard from '@/components/PokemonCard.vue'
import type { Card, Deck, DeckCard } from '@/types'

// Liste des props
const props = defineProps<{
  deck: Deck // Deck à afficher
  cards: Card[] // Liste de toutes les cartes Pokémon pour éviter les appels redondants à l'API dans chaque deck
}>()

// Fonction anonyme qui récupère la carte Pokémon correspondante à une carte de deck, en comparant les IDs.
const getCard = (deckCard: DeckCard): Card | undefined => {
  // On compare l'ID de la carte avec celle du deck. Si elle correspond, ça veut dire qu'elle est dans le deck ! ^^o
  // Avoir déclaré 'defineProps' en tant que variable permet d'y accéder
  return props.cards.find((card) => card.id === deckCard.cardId)
}
</script>
