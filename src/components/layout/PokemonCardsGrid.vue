<template>
  <NGrid cols="4" :x-gap="16" :y-gap="16">
    <NGridItem v-for="pokemon in pokemons" :key="pokemon.id">
      <PokemonCard :pokemon="pokemon" size="sd" />
    </NGridItem>
  </NGrid>
</template>

<script setup lang="ts">
import PokemonCard from '@/components/layout/PokemonCard.vue'
import type { Card } from '@/types'

defineProps<{ pokemons: Card[] }>()
</script>
