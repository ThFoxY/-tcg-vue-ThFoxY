<template>
  <NLoadingBarProvider>
    <NConfigProvider>
      <NMessageProvider>
        <NLayout>
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
body {
  padding: 0 20px;
}
</style>
