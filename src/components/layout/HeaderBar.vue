<template>
  <NLayoutHeader
    bordered
    style="padding: 0 24px; position: sticky; top: 0; z-index: 100"
  >
    <NSpace justify="space-between" align="center" style="height: 56px">
      <NSpace align="center" :size="16">
        <RouterLink to="/">TCG SPA</RouterLink>
        <NButton
          tag="a"
          :href="`${apiBaseUrl.replace('/api', '')}/api-docs`"
          target="_blank"
          text
          size="small"
        >
          API Docs
        </NButton>
        <NButton
          tag="a"
          href="https://making-rerun-61323218.figma.site/"
          target="_blank"
          text
          size="small"
        >
          Maquettes
        </NButton>
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
import { useRouter } from 'vue-router'

import { ROUTES } from '@/router'
import { useAuthStore } from '@/store/auth.store'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string

// Récupère le store d'authentification
const authStore = useAuthStore()

const router = useRouter()

// Fonction anonyme de déconnexion
const handleSignOut = () => {
  authStore.signOut()
  // Redirige vers la page de connexion ('/sign-in')
  router.replace(ROUTES.SIGN_IN)
}
</script>
