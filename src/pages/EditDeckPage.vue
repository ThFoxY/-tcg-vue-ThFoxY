<template>
  <PageTitle title="Modifier le deck" toggle-back />
  <NFlex justify="center" align="center" vertical>
    <NCard>
      <NForm
        ref="formRef"
        :model="formValue"
        :rules="rules"
        @submit.prevent="handleUpdateDeck"
      >
        <NFlex justify="start" align="center">
          <NFormItem required path="name" label="Nom du deck">
            <NInput
              v-model:value="formValue.name"
              placeholder="Mon super deck"
              type="text"
              :disabled="isLoading"
            />
          </NFormItem>
          <NButton
            :disabled="
              !formValue.name || (selectedCardsIds.length !== 10 && !isLoading)
            "
            type="primary"
            attr-type="submit"
          >
            Modifier le deck
          </NButton>
          <div>{{ selectedCardsIds.length }}/10 cartes sélectionnées</div>
        </NFlex>
      </NForm>
      <NDivider />
      <NEmpty v-if="cards.length === 0" description="Aucune carte trouvée 🥲" />
      <PokemonCardsGrid
        v-else
        :pokemons="cards"
        :selected-pokemons-ids="selectedCardsIds"
        :max-reached="selectedCardsIds.length === 10"
        @select="toggleSelect"
      />
    </NCard>
  </NFlex>
</template>

<script setup lang="ts">
// TODO: Identique à CreateDeckPage.vue, factoriser dans un composable useDeckForm() ?
import type { FormInst, FormRules, FormValidationError } from 'naive-ui'
import { useLoadingBar, useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import PageTitle from '@/components/layout/PageTitle.vue'
import PokemonCardsGrid from '@/components/PokemonCardsGrid.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import type { Card } from '@/types'

const loadingBar = useLoadingBar()
const message = useMessage()
const api = useApi()
const router = useRouter()

const deckId = Number(router.currentRoute.value.params.id) // Récupère l'ID du deck depuis l'URL

const formRef = ref<FormInst | null>(null) // Référence du formulaire
const formValue = ref({ name: '' })
const cards = ref<Card[]>([]) // Stocke les cartes en objets Card récupérées via l'API
const isLoading = ref<boolean>(false) // Stocke l'état de chargement de l'API

// Stocke les IDs des cartes sélectionnées pour le deck
const selectedCardsIds = ref<number[]>([])

// Défini les règles de validation du formulaire
const rules: FormRules = {
  name: {
    required: true,
    type: 'string',
    message: 'Le nom du deck est requis',
    trigger: 'blur',
  },
}

// Fonction anonyme qui gère la modification du deck à la validation du formulaire
const handleUpdateDeck = async () => {
  // Valide le formulaire avant de soumettre (affiche les erreurs si invalides)
  formRef.value?.validate(async (errors: FormValidationError[] | undefined) => {
    // Si le formulaire est valide, tente de se connecter
    if (!errors) {
      isLoading.value = true
      try {
        await api.updateDeck(deckId, {
          name: formValue.value.name,
          cards: selectedCardsIds.value,
        })
        message.success('Modification du deck réussie !')

        // Redirige vers la page de détail du deck modifié
        router.replace(ROUTES.DECK_DETAIL.replace(':id', deckId.toString()))
      } catch (error) {
        message.error(
          `Erreur lors de la modification du deck : ${(error as Error).message}`,
        )
      } finally {
        isLoading.value = false
      }
    } else {
      message.info('Veuillez corriger les erreurs dans le formulaire.')
    }
  })
}

// Fonction anonyme asynchrone qui récupère les cartes depuis l'API
const fetchData = async () => {
  loadingBar.start()
  try {
    const [deckResponse, cardsResponse] = await Promise.all([
      api.getDeck(deckId),
      api.getCards(),
    ])
    formValue.value.name = deckResponse.name
    selectedCardsIds.value = deckResponse.cards.map((card) => card.cardId)
    cards.value = cardsResponse
  } catch (error) {
    message.error(`Erreur lors du chargement : ${(error as Error).message}`)
    loadingBar.error()
  } finally {
    loadingBar.finish()
  }
}

// Fonction anonyme qui gère la sélection/désélection des cartes pour le deck
const toggleSelect = (pokemonId: number) => {
  // Vérifie si la carte est déjà sélectionnée
  const index = selectedCardsIds.value.indexOf(pokemonId)
  if (index === -1) {
    // Si la carte n'est pas déjà sélectionnée et qu'il n'y a pas encore 10 cartes selectionnées, l'ajoute à la sélection
    if (selectedCardsIds.value.length < 10) {
      selectedCardsIds.value.push(pokemonId)
    } else {
      message.warning(
        'Vous ne pouvez sélectionner que 10 cartes pour votre deck.',
      )
    }
  } else {
    // Si la carte est déjà sélectionnée, la retire de la sélection
    selectedCardsIds.value.splice(index, 1)
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
