<template>
  <PageTitle title="Détail du deck" toggle-back>
    <template #button>
      <NButton
        type="primary"
        size="small"
        @click="router.push(ROUTES.EDIT_DECK.replace(':id', deckId.toString()))"
      >
        <template #icon>
          <NIcon>
            <IconEdit />
          </NIcon>
        </template>
        Modifier le deck
      </NButton>
    </template>
  </PageTitle>
  <NFlex class="create-deck" justify="center" align="center" vertical>
    <NEmpty v-if="!deck" description="Aucun deck trouvé 🥲" />
    <BattleDeck v-else :deck="deck" :cards="cards" />
  </NFlex>
</template>

<script setup lang="ts">
import { IconEdit } from '@tabler/icons-vue'
import { useLoadingBar, useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router' // useRoute != useRouter, useRoute est utilisé pour accéder aux paramètres de l'URL, tandis que useRouter est utilisé pour naviguer vers d'autres routes (même si useRouter peut aussi accéder aux paramètres de l'URL via router.currentRoute.value.params !)

import BattleDeck from '@/components/BattleDeck.vue'
import PageTitle from '@/components/layout/PageTitle.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import type { Card, Deck } from '@/types'

const loadingBar = useLoadingBar()
const message = useMessage()
const api = useApi()
const router = useRouter()

const deckId = Number(router.currentRoute.value.params.id) // Récupère l'ID du deck depuis l'URL

const deck = ref<Deck>() // Stocke le deck en objet Deck récupéré depuis l'API
const cards = ref<Card[]>([]) // Stocke les cartes en objets Card récupérées via l'API

// Fonction anonyme asynchrone qui récupère un deck spécifique depuis l'API
const fetchData = async () => {
  loadingBar.start()
  try {
    const [deckResponse, cardsResponse] = await Promise.all([
      api.getDeck(deckId), // FIX: Utilisation de deckId défini précédemment
      api.getCards(),
    ])
    deck.value = deckResponse
    cards.value = cardsResponse
  } catch (error) {
    message.error(`Erreur lors du chargement : ${(error as Error).message}`)
    loadingBar.error()
  } finally {
    loadingBar.finish()
  }
}

// Monte le composant et récupère le deck spécifique depuis l'API
onMounted(fetchData)
</script>

<style scoped>
.n-card {
  max-width: 1100px;
}
</style>
