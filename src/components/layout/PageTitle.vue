<template>
  <NFlex justify="left" align="center">
    <NIcon size="16" @click="router.back()"><IconChevronLeft /></NIcon>
    <h1>{{ title }}</h1>
  </NFlex>
</template>

<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { useRouter } from 'vue-router'

defineProps<{
  title: string
}>()

// Récupère les routeurs pour la navigation
const router = useRouter()
</script>
