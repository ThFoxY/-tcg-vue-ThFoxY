<template>
  <NGrid cols="4" :x-gap="16" :y-gap="16">
    <NGridItem v-for="pokemon in pokemons" :key="pokemon.id">
      <PokemonCard
        size="md"
        :pokemon="pokemon"
        :selected="selectedPokemonsIds.includes(pokemon.id)"
        :disabled="!selectedPokemonsIds.includes(pokemon.id) && maxReached"
        :current-hp="null"
        @click="toggleSelect(pokemon.id)"
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
  toggleSelect: (pokemonId: number) => void // Fonction pour sélectionner/désélectionner une carte
}>()
</script>
