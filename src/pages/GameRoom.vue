<template>
  <NFlex direction="column">
    <NCard title="Adversaire" size="huge" style="background-color: #eee">
      <OpponentSide />
    </NCard>

    <ActionsBar />

    <NCard title="Vous" size="huge">
      <PlayerSide />
    </NCard>
  </NFlex>
</template>

<script setup lang="ts">
import ActionsBar from '@/components/game/ActionsBar.vue'
import OpponentSide from '@/components/game/OpponentSide.vue'
import PlayerSide from '@/components/game/PlayerSide.vue'
</script>
