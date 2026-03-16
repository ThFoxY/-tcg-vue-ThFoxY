<template>
  <NCard hoverable>
    <NFlex justify="center" align="center" vertical>
      <NImage width="100%" lazy :src="pokemon.imgUrl" />
      <span style="color: #aaa">#{{ pokemon.pokedexNumber }}</span>
      <span style="font-weight: bold">{{ pokemon.name }}</span>
      <NTag
        :bordered="false"
        :color="{ color: getTypeColor(pokemon.type), textColor: '#fff' }"
        >{{ pokemon.type }}</NTag
      >
      <span>❤️ {{ pokemon.hp }} • 💥{{ pokemon.attack }}</span>
    </NFlex>
  </NCard>
</template>

<script setup lang="ts">
import { useColors } from '@/composables/useColors'
import type { Card } from '@/types'

// Récupérer la couleur en fonction du type du Pokémon
const { getTypeColor } = useColors()

defineProps<{ pokemon: Card }>()
</script>
