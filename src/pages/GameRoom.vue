<template>
  <NFlex vertical>
    <NCard title="Adversaire" size="huge" style="background-color: #f5f5f5">
      <OpponentSide />
    </NCard>

    <ActionsBar />

    <NCard title="Vous" size="huge">
      <PlayerSide />
    </NCard>
  </NFlex>

  <ResultModal />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import ActionsBar from '@/components/game/ActionsBar.vue'
import OpponentSide from '@/components/game/OpponentSide.vue'
import PlayerSide from '@/components/game/PlayerSide.vue'
import ResultModal from '@/components/game/ResultModal.vue'
import { ROUTES } from '@/router'
import { useSocketStore } from '@/store/socket.store'

const router = useRouter()
const socketStore = useSocketStore()

// onMounted s'exécute au montage des composants
onMounted(() => {
  // Empêche l'accès si aucune partie n'est en cours
  if (!socketStore.gameState) {
    router.replace(ROUTES.HOME)
  }
})
</script>
