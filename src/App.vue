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
import HeaderBar from '@/components/layout/HeaderBar.vue'
import { useAuthStore } from '@/store/auth.store'

const authStore = useAuthStore()
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
