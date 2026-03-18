<!-- <template>
  <PageTitle title="Détail du deck {{ deck ? deck.name : '' }}" toggle-back>
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
        Nouveau deck
      </NButton>
    </template>
  </PageTitle>
  <NFlex class="create-deck" justify="center" align="center" vertical>
    <NCard>
      <NEmpty v-if="!deck" description="Aucun deck trouvé 🥲" />
      <BattleDeck v-else :deck="deck" />
    </NCard>
  </NFlex>
</template>

<script setup lang="ts">
import { IconEdit } from '@tabler/icons-vue'
import { useLoadingBar, useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import PageTitle from '@/components/layout/PageTitle.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import type { Deck } from '@/types'

const loadingBar = useLoadingBar()
const message = useMessage()
const api = useApi()
const router = useRouter()

const deck = ref<Deck>() // Stocke le deck récupéré depuis l'API

// Fonction anonyme asynchrone qui récupère un deck spécifique depuis l'API
const fetchDeck = async (deckId: string | number) => {
  loadingBar.start()
  try {
    const response = await api.getDeck(deckId)
    deck.value = response
    try {
      cards.value = await api.getCards()
    } catch (error) {
      message.error(
        `Erreur lors du chargement des cartes : ${(error as Error).message}`,
      )
    }
  } catch (error) {
    message.error(
      `Erreur lors du chargement du deck : ${(error as Error).message}`,
    )
    loadingBar.error()
  } finally {
    loadingBar.finish()
  }
}

// Monte le composant et récupère le deck spécifique depuis l'API
onMounted(fetchDeck)
</script>

<style scoped>
.n-card {
  max-width: 1100px;
}
</style> -->
