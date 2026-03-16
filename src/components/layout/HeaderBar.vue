<template>
  <NLayoutHeader
    bordered
    style="padding: 0 24px; position: sticky; top: 0; z-index: 100"
  >
    <NSpace justify="space-between" align="center" style="height: 56px">
      <NSpace align="center" :size="16">
        <RouterLink to="/">TCG SPA</RouterLink>
        <NDropdown
          v-if="authStore.isAuthentificated"
          :options="deckOptions"
          placement="bottom-start"
          trigger="hover"
          @select="handleDeckOptions"
        >
          <NButton size="small">Decks</NButton>
        </NDropdown>
      </NSpace>
      <NSpace align="center" :size="16">
        <NText depth="3">{{ authStore.user?.username }}</NText>
        <NButton
          v-if="authStore.isAuthentificated"
          size="small"
          @click="handleSignOut"
          >Déconnexion</NButton
        >
      </NSpace>
    </NSpace>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { IconPencilPlus } from '@tabler/icons-vue'
import { NIcon } from 'naive-ui'
import type { Component } from 'vue'
import { h } from 'vue'
import { useRouter } from 'vue-router'

import { ROUTES } from '@/router'
import { useAuthStore } from '@/store/auth.store'

// Récupère le store d'authentification
const authStore = useAuthStore()
// Récupère les routeurs pour la navigation
const router = useRouter()

// Fonction anonyme de déconnexion
const handleSignOut = () => {
  authStore.signOut()
  // Redirige vers la page de connexion ('/sign-in')
  router.replace(ROUTES.SIGN_IN)
}

// Fonction de rendu d'icône pour le menu déroulant
function renderIcon(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

// Options du menu déroulant pour les decks, avec une icône et une action de navigation
const deckOptions = [
  {
    label: 'Créer un deck',
    key: 'create-deck',
    icon: renderIcon(IconPencilPlus),
    onClick: () => router.push(ROUTES.CREATE_DECK),
  },
]

// Fonction de gestion des options du menu déroulant des decks
function handleDeckOptions(key: string) {
  if (key === 'create-deck') {
    router.push(ROUTES.CREATE_DECK)
  }
}
</script>
