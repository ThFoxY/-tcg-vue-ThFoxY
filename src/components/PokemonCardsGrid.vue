<template>
  <NFlex vertical>
    <NInput
      v-model:value="search"
      placeholder="Rechercher un Pokémon..."
      clearable
    />
    <NGrid responsive="screen" cols="2 s:3 m:4" :x-gap="16" :y-gap="16">
      <NGridItem v-for="pokemon in searchPokemons" :key="pokemon.id">
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
  </NFlex>

  <NEmpty
    v-if="searchPokemons.length === 0"
    description="Aucun Pokémon trouvé 🥲"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import PokemonCard from '@/components/PokemonCard.vue'
import type { Card } from '@/types'

const search = ref('') // Texte de recherche saisi par l'utilisateur

// Liste de props
const props = defineProps<{
  pokemons: Card[]
  selectedPokemonsIds: number[] // Liste des IDs des cartes sélectionnées pour le deck
  maxReached: boolean // Indique si le nombre maximum de cartes sélectionnées (10) a été atteint
}>()

// RG2 : La grille est filtrée en temps réel selon le texte saisi (par nom de carte)
// Filtre les Pokémons en fonction de la recherche saisie, en ignorant la casse et les espaces
const searchPokemons = computed(() => {
  const input = search.value.trim().toLowerCase() // Retire les espaces inutiles et convertit en minuscules pour éviter les problèmes de casse
  return props.pokemons.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(input) ||
      props.selectedPokemonsIds.includes(pokemon.id), // (RG3) FIX: Garde les cartes sélectionnées 😜
  )
})

// FIX: Passer une fonction comme prop est un anti-pattern Vue, il est préférable d'émettre des événements pour communiquer les actions vers le parent 👍
// Liste des événements émis
const emit = defineEmits<{
  select: [pokemonId: number] // Événement émis lorsqu'une carte est sélectionnée/désélectionnée, avec l'ID de la carte concernée
}>()
</script>
