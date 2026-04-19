<template>
  <NLayout style="margin: 8px 16px">
    <NSpace justify="space-between" align="center">
      <NFlex align="center" :gap="12">
        <NTag
          :bordeless="false"
          :type="socketStore.playerTurn ? 'success' : 'error'"
        >
          {{ socketStore.playerTurn ? 'Votre tour' : "Tour de l'adversaire" }}
        </NTag>
        <NText v-if="socketStore.message">
          {{ socketStore.message }}
        </NText>
      </NFlex>
      <NSpace>
        <NButton
          size="small"
          :disabled="!canDraw"
          @click="socketStore.drawCards()"
          >Piocher</NButton
        >
        <NButton
          size="small"
          type="error"
          :disabled="!canAttack"
          @click="socketStore.attack()"
          >Attaquer</NButton
        >
        <NButton
          size="small"
          type="warning"
          :disabled="!socketStore.playerTurn"
          @click="socketStore.endTurn()"
          >Fin de tour</NButton
        >
      </NSpace>
    </NSpace>
  </NLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useSocketStore } from '@/store/socket.store'

const socketStore = useSocketStore()

// RG6 : Tous les boutons d'action sont désactivés si ce n'est pas le tour du joueur
// RG4 : Le bouton Piocher est désactivé si la main est pleine (5 cartes) ou si le deck est vide
const canDraw = computed(() => {
  if (!socketStore.playerTurn) return false

  const playerBoard = socketStore.playerBoard?.board
  if (!playerBoard) return false
  return playerBoard.hand.length < 5 && playerBoard.deck.length > 0
})

// RG5 : Le bouton Attaquer est désactivé si l'un des deux joueurs n'a pas de carte active
// !! sert à convertir en booléen
const canAttack = computed(() => {
  if (!socketStore.playerTurn) return false

  return (
    !!socketStore.playerBoard?.board.activeCard &&
    !!socketStore.opponentBoard?.board.activeCard
  )
})
</script>
