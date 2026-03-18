<template>
  <NFlex justify="space-between" align="center">
    <NFlex justify="start" align="center">
      <NIcon
        v-if="toggleBack"
        size="24"
        style="cursor: pointer"
        @click="router.back()"
      >
        <IconChevronLeft />
      </NIcon>
      <h1>{{ title }}</h1>
    </NFlex>
    <slot name="button"></slot>
  </NFlex>
</template>

<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { useRouter } from 'vue-router'

// Liste des props
defineProps<{
  title: string // Titre de la page à afficher
  toggleBack: boolean // Affiche ou non le bouton de retour
}>()

// Récupère les routeurs pour la navigation
const router = useRouter()
</script>

<style scoped></style>
