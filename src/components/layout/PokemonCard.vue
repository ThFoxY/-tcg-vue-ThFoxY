<template>
  <NCard hoverable>
    <NFlex v-if="size === 'md'" justify="center" align="center" vertical>
      <NImage width="100%" :src="pokemon.imgUrl" lazy />
      <span style="color: #aaa">#{{ pokemon.pokedexNumber }}</span>
      <span style="font-weight: bold">{{ pokemon.name }}</span>
      <NTag
        :bordered="false"
        :color="{ color: getTypeColor(pokemon.type), textColor: '#fff' }"
        >{{ pokemon.type }}</NTag
      >
      <span>❤️ {{ pokemon.hp }} • 💥{{ pokemon.attack }}</span>
    </NFlex>
    <NFlex v-else align="center">
      <NImage :width="60" :height="60" :src="pokemon.imgUrl" lazy />
      <NFlex justify="center" vertical>
        <NFlex justify="center">
          <span style="color: #aaa">#{{ pokemon.pokedexNumber }}</span>
          <span style="font-weight: bold">{{ pokemon.name }}</span>
        </NFlex>
        <NTag
          :bordered="false"
          :color="{ color: getTypeColor(pokemon.type), textColor: '#fff' }"
          >{{ pokemon.type }}</NTag
        >
        <span>❤️ {{ pokemon.hp }} • 💥{{ pokemon.attack }}</span>
      </NFlex>
    </NFlex>
  </NCard>
</template>

<script setup lang="ts">
import { useColors } from '@/composables/useColors'
import type { Card } from '@/types'

// Récupérer la couleur en fonction du type du Pokémon
const { getTypeColor } = useColors()

defineProps<{ pokemon: Card; size: string }>()
</script>
