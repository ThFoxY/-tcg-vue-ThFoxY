<template>
  <NGrid responsive="screen" cols="2 s:3 m:4" :x-gap="16" :y-gap="16">
    <NGridItem v-for="pokemon in pokemons" :key="pokemon.id">
      <PokemonCard
        size="md"
        :pokemon="pokemon"
        :selected="selectedPokemonsIds.includes(pokemon.id)"
        :disabled="!selectedPokemonsIds.includes(pokemon.id) && maxReached"
        :current-hp="null"
        @click="emit('select', pokemon.id)"
      />
    </NGridItem>
  </NGrid>
</template>

<script setup lang="ts">
import PokemonCard from '@/components/PokemonCard.vue'
import type { Card } from '@/types'

// Liste de props
defineProps<{
  pokemons: Card[]
  selectedPokemonsIds: number[] // Liste des IDs des cartes sélectionnées pour le deck
  maxReached: boolean // Indique si le nombre maximum de cartes sélectionnées (10) a été atteint
}>()

// FIX: Passer une fonction comme prop est un anti-pattern Vue, il est préférable d'émettre des événements pour communiquer les actions vers le parent 👍
// Liste des événements émis
const emit = defineEmits<{
  select: [pokemonId: number] // Événement émis lorsqu'une carte est sélectionnée/désélectionnée, avec l'ID de la carte concernée
}>()
</script>
