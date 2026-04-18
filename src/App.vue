<template>
  <NLoadingBarProvider>
    <NConfigProvider>
      <NMessageProvider>
        <NLayout style="min-height: 100vh">
          <HeaderBar v-if="authStore.isAuthenticated" />
          <NLayoutContent>
            <RouterView />
          </NLayoutContent>
        </NLayout>
      </NMessageProvider>
    </NConfigProvider>
  </NLoadingBarProvider>
</template>

<script setup lang="ts">
import { watch } from 'vue'

import HeaderBar from '@/components/layout/HeaderBar.vue'
import { useAuthStore } from '@/store/auth.store'
import { useSocketStore } from '@/store/socket.store'

// Stores
const authStore = useAuthStore()
const socketStore = useSocketStore()

// FIX: Connecte le socket dès que le token est disponible pour obtenir les salles disponibles avant le montage du composant
watch(
  () => authStore.token,
  (token) => {
    if (token) {
      socketStore.connect(token)
    } else {
      socketStore.disconnect()
    }
  },
  { immediate: true },
)
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}

body {
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
