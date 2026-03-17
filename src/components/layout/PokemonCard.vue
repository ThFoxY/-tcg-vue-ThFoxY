<template>
  <NCard
    :class="{ selected, disabled }"
    :hoverable="!disabled"
    @click="!disabled && $emit('click')"
  >
    <NFlex v-if="size === 'md'" justify="center" align="center" vertical>
      <NImage width="100%" :src="pokemon.imgUrl" lazy preview-disabled />
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
      <NImage
        :width="60"
        :height="60"
        :src="pokemon.imgUrl"
        lazy
        preview-disabled
      />
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

// Liste des props
defineProps<{
  size: string // 'sm' -> affichage compact ou 'md' -> affichage classique
  pokemon: Card
  selected: boolean // Renvoie vrai si la carte est sélectionnée, sinon faux
  disabled: boolean // Renvoie vrai si la carte ne peut pas être sélectionnée (10 cartes déjà sélectionnées), sinon faux
}>()

// Émettre un événement "click" lorsque la carte est cliquée au composant parent (`PokemonCardsGrid.vue`)
// Quand on clique sur la carte, on vérifie d'abord qu'elle n'est pas désactivée, puis on envoie l'événement afin que PokemonCardsGrid puisse gérer la sélection/désélection de la carte. Très cool, non ? 😎
defineEmits(['click'])
</script>

<style scoped>
.selected {
  border: 2px solid #18a058;
  background-color: #f2fff7;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
