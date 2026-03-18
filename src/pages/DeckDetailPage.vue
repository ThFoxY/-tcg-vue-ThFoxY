<template>
  <PageTitle title="Détail du deck" toggle-back>
    <template #button>
      <NButton
        type="primary"
        size="small"
        @click="
          message.info('Cette fonctionnalité n\'est pas encore implémentée !')
        "
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
import { useRouter } from 'vue-router'

import BattleDeck from '@/components/layout/BattleDeck.vue'
import PageTitle from '@/components/layout/PageTitle.vue'
import { useApi } from '@/composables/useApi'
import type { Card, Deck } from '@/types'

const loadingBar = useLoadingBar()
const message = useMessage()
const api = useApi()
const router = useRouter()

const deck = ref<Deck>() // Stocke le deck en objet Deck récupéré depuis l'API
const cards = ref<Card[]>([]) // Stocke les cartes en objets Card récupérées via l'API

// Fonction anonyme asynchrone qui récupère un deck spécifique depuis l'API
const fetchData = async () => {
  loadingBar.start()
  try {
    const [deckResponse, cardsResponse] = await Promise.all([
      api.getDeck(Number(router.currentRoute.value.params.id)),
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
