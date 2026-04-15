<template>
  <PageTitle title="Jouer" :toggle-back="false"> </PageTitle>
  <NFlex justify="space-around" wrap>
    <NCard title="Créer une partie" style="width: 900px">
      <NSelect
        v-model:value="deckId"
        :options="deckOptions"
        placeholder="Sélectionner un deck"
      />
      <NDivider />
      <NButton :disabled="!deckId" type="primary">Créer la partie</NButton>
    </NCard>

    <NCard title="Parties disponibles" style="width: 900px">
      <NEmpty description="Aucune partie disponible pour l'instant 🥲" />
    </NCard>
  </NFlex>
  <PageTitle title="Mes decks" :toggle-back="false">
    <template #button>
      <NButton
        type="primary"
        size="small"
        @click="router.push(ROUTES.CREATE_DECK)"
      >
        <template #icon>
          <NIcon>
            <IconPlus />
          </NIcon>
        </template>
        Nouveau deck
      </NButton>
    </template>
  </PageTitle>
  <NEmpty v-if="decks.length === 0" description="Aucun deck trouvé 🥲" />
  <NFlex v-else class="my-decks" justify="center" align="center" vertical>
    <BattleDecksList v-if="decks.length > 0" :decks="decks" :cards="cards">
      <template #buttons="{ deck }">
        <NFlex justify="end" align="center">
          <NDivider />
          <NButton
            size="small"
            @click="
              router.push(ROUTES.DECK_DETAIL.replace(':id', deck.id.toString()))
            "
            >Voir le détail</NButton
          >
          <NButton
            type="info"
            size="small"
            @click="
              router.push(ROUTES.EDIT_DECK.replace(':id', deck.id.toString()))
            "
            >Modifier</NButton
          >
          <NButton
            type="error"
            size="small"
            @click="handleDeleteButton(deck.id)"
            >Supprimer</NButton
          >
        </NFlex>
      </template>
    </BattleDecksList>
  </NFlex>
  <NModal
    v-model:show="showModal"
    preset="dialog"
    title="Confirmation"
    content="Vous êtes sûr de vouloir supprimer ce deck ?"
    positive-text="Oui"
    negative-text="Non"
    @positive-click="handleDeleteDeck"
  />
</template>

<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue'
import { useLoadingBar, useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import BattleDecksList from '@/components/BattleDecksList.vue'
import PageTitle from '@/components/layout/PageTitle.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import type { Card, Deck } from '@/types'

const loadingBar = useLoadingBar()
const message = useMessage()
const api = useApi()
const router = useRouter()

const deckId = ref<number | null>(null) // Stocke l'ID du deck sélectionné pour créer une partie
const deckOptions = ref<{ label: string; value: number }[]>([]) // Stocke les options pour le select de création de partie

const decks = ref<Deck[]>([]) // Stocke les decks en objets Deck récupérés via l'API
const cards = ref<Card[]>([]) // Stocke les cartes en objets Card récupérées via l'API
const showModal = ref(false) // Affiche ou non la modal de confirmation de suppression
const selectedDeckId = ref<number | null>(null) // Stocke l'ID du deck sélectionné pour la suppression
const isLoading = ref<boolean>(false) // Stocke l'état de chargement de l'API

// Fonction anonyme asynchrone qui récupère les decks et toutes les cartes Pokémon une seule fois depuis l'API
// Explication : avant, chaque composant BattleDeck appelait l'API pour récupérer toutes les cartes, puis se les approprier en fonction de ses besoins.
// Maintenant, l'appel est unique, puis transmis par les props. Cela évite un saut visuel lors du chargement des decks.
const fetchData = async () => {
  isLoading.value = true
  loadingBar.start()
  try {
    const [decksResponse, cardsResponse] = await Promise.all([
      api.getMyDecks(),
      api.getCards(),
    ])
    decks.value = decksResponse
    cards.value = cardsResponse
    deckOptions.value = decksResponse.map((deck) => ({
      label: deck.name,
      value: deck.id,
    }))
  } catch (error) {
    message.error(`Erreur lors du chargement : ${(error as Error).message}`)
    loadingBar.error()
  } finally {
    isLoading.value = false
    loadingBar.finish()
  }
}

// Fonction anonyme qui gère le clic sur le bouton de suppression d'un deck
const handleDeleteButton = (deckId: number) => {
  selectedDeckId.value = deckId
  showModal.value = true
}

// Fonction anonyme asynchrone qui gère la suppression d'un deck
const handleDeleteDeck = async () => {
  if (selectedDeckId.value === null) return
  loadingBar.start()
  try {
    await api.deleteDeck(selectedDeckId.value)
    message.success('Deck supprimé avec succès !')
    await fetchData() // Rafraîchit la liste des decks après suppression
  } catch (error) {
    message.error(
      `Erreur lors de la suppression du deck : ${(error as Error).message}`,
    )
    loadingBar.error()
  } finally {
    showModal.value = false
    selectedDeckId.value = null
    loadingBar.finish()
  }
}

// Monte le composant et récupère les decks et les cartes depuis l'API
onMounted(fetchData)
</script>

<style scoped>
.n-card {
  max-width: 1400px;
}
</style>
