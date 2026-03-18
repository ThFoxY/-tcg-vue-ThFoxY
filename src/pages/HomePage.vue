<template>
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
          </NIcon> </template
        >Nouveau deck</NButton
      >
    </template>
  </PageTitle>
  <NEmpty v-if="decks.length === 0" description="Aucun deck trouvé 🥲" />
  <NFlex v-else class="my-decks" justify="center" align="center" vertical>
    <DeckCard v-for="deck in decks" :key="deck.id" :deck="deck">
      <template #buttons>
        <NFlex justify="end" align="center">
          <NDivider />
          <NButton
            size="small"
            @click="
              message.info(
                'Cette fonctionnalité n\'est pas encore implémentée !',
              )
            "
            >Modifier</NButton
          >
          <NButton
            type="error"
            size="small"
            @click="handleDeleteButton(deck.id)"
          >
            Supprimer
          </NButton>
        </NFlex>
      </template>
    </DeckCard>
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

import DeckCard from '@/components/layout/DeckCard.vue'
import PageTitle from '@/components/layout/PageTitle.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import type { Deck } from '@/types'

const loadingBar = useLoadingBar()
const message = useMessage()
const api = useApi()
const router = useRouter()

const decks = ref<Deck[]>([]) // Stocke les decks en objets Deck récupérées via l'API
const showModal = ref(false) // Affiche ou non la modal de confirmation de suppression
const selectedDeckId = ref<number | null>(null) // Stocke l'ID du deck sélectionné pour la suppression

// Fonction anonyme asynchrone qui récupère les decks de l'utilisateur connecté
const fetchDecks = async () => {
  loadingBar.start()
  try {
    const response = await api.getMyDecks()
    decks.value = response
  } catch (error) {
    message.error(
      `Erreur lors du chargement de vos decks : ${(error as Error).message}`,
    )
    loadingBar.error()
  } finally {
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
  loadingBar.start()
  if (selectedDeckId.value === null) return
  try {
    await api.deleteDeck(selectedDeckId.value)
    message.success('Deck supprimé avec succès !')
    await fetchDecks() // Rafraîchit la liste des decks après suppression
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

// Monte le composant et récupère les decks depuis l'API
onMounted(fetchDecks)
</script>

<style scoped>
.n-card {
  max-width: 1100px;
}
</style>
