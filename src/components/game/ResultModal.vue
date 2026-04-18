<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    :title="isWinner ? '🏆 Victoire !' : '💀 Défaite...'"
    :content="
      isWinner
        ? 'Félicitations, vous avez remporté la partie !'
        : 'Vous avez perdu la partie. Bonne chance la prochaine fois !'
    "
    positive-text="Retour au lobby"
    :closable="false"
    :mask-closable="false"
    @positive-click="handleBack"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { ROUTES } from '@/router'
import { useAuthStore } from '@/store/auth.store'
import { useSocketStore } from '@/store/socket.store'

const router = useRouter()

// Stores
const socketStore = useSocketStore()
const authStore = useAuthStore()

// RG8 : Détermine si le modal doit être affiché
// computed() permet l'affichage du modal dès lors que la dépendance socketStore.gameResult est défini (et vraie)
const show = computed(() => !!socketStore.gameResult) // !! sert à convertir en booléen

// Détermine si le joueur est le gagnant
const isWinner = computed(() => {
  if (!socketStore.gameResult) return false
  return socketStore.gameResult.winnerId === authStore.user?.id
})

// RG9 : Gère le clic sur le bouton "Retour au lobby"
const handleBack = () => {
  socketStore.resetGame()
  router.replace(ROUTES.HOME)
}
</script>
