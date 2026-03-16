<template>
  <PageTitle title="Créer un deck" />
  <NFlex class="create-deck" justify="center" align="center" vertical>
    <NCard>
      <NForm
        ref="formRef"
        :model="formValue"
        :rules="rules"
        @submit.prevent="handleCreateDeck"
      >
        <NFlex vertical>
          <NFormItem required path="name" label="Nom du deck">
            <NInput
              v-model:value="formValue.name"
              placeholder="Mon deck n°?"
              type="text"
            />
          </NFormItem>
          <NButton
            :disabled="!formValue.name"
            type="primary"
            attr-type="submit"
          >
            Créer le deck
          </NButton>
        </NFlex>
      </NForm>
      <PokemonCardGrid :pokemons="cards" />
    </NCard>
  </NFlex>
</template>

<script setup lang="ts">
import type { FormInst, FormRules, FormValidationError } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { onMounted, ref, watch } from 'vue'

import PageTitle from '@/components/layout/PageTitle.vue'
import PokemonCardGrid from '@/components/layout/PokemonCardsGrid.vue'
import { useApi } from '@/composables/useApi'
import type { Card } from '@/types'

const message = useMessage()
const api = useApi()

const formRef = ref<FormInst | null>(null)
const formValue = ref({ name: '' })
const cards = ref<Card[]>([])

const rules: FormRules = {
  name: {
    required: true,
    type: 'string',
    message: 'Le nom du deck est requis',
    trigger: 'blur',
  },
}

// Fonction anonyme qui gère la création du deck à la validation du formulaire
const handleCreateDeck = () => {
  // Valide le formulaire avant de soumettre (affiche les erreurs si invalides)
  formRef.value?.validate((errors: FormValidationError[] | undefined) => {
    // Si le formulaire est valide, tente de se connecter
    if (!errors) {
      message.success('Création du deck réussie !')
    } else {
      message.info('Veuillez corriger les erreurs dans le formulaire.')
    }
  })
}

// Fonction anonyme asynchrone qui récupère les cartes depuis l'API
const fetchCards = async () => {
  try {
    const response = await api.getCards()
    cards.value = response
  } catch (error) {
    message.error(
      `Erreur lors du chargement des cartes : ${(error as Error).message}`,
    )
  }
}

// Monte le composant et récupère les cartes depuis l'API
onMounted(fetchCards)

// Observe le changement de valeur de cards et met à jour la grille de cartes
watch(
  cards,
  (_newCards) => {
    fetchCards()
  },
  { deep: true },
)
</script>

<style scoped>
.n-card {
  max-width: 1100px;
}
</style>
