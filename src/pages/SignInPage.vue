<template>
  <NFlex class="sign-in" justify="center" align="center" vertical>
    <NCard title="Connexion">
      <NForm
        ref="formRef"
        :model="formValue"
        :rules="rules"
        @submit.prevent="handleSignIn"
      >
        <NFlex vertical>
          <NFormItem required path="email" label="Email">
            <NInput
              v-model:value="formValue.email"
              placeholder="votre@email.com"
              type="email"
            />
          </NFormItem>
          <NFormItem required path="password" label="Mot-de-passe">
            <NInput
              v-model:value="formValue.password"
              show-password-on="click"
              placeholder="••••••••"
              type="password"
            />
          </NFormItem>
          <NButton
            :disabled="!formValue.email || !formValue.password || isLoading"
            type="primary"
            attr-type="submit"
          >
            Se connecter
          </NButton>
        </NFlex>
      </NForm>
      <NFlex justify="center">
        <p>
          Pas encore de compte ?
          <RouterLink :to="ROUTES.SIGN_UP">S'inscrire</RouterLink>
        </p>
      </NFlex>
    </NCard>
  </NFlex>
</template>

<script setup lang="ts">
import type { FormInst, FormRules, FormValidationError } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { ROUTES } from '@/router'
import { useAuthStore } from '@/store/auth.store'
import type { SignInPayload } from '@/types'

const authStore = useAuthStore()
const message = useMessage()
const router = useRouter()

const formRef = ref<FormInst | null>(null)
const formValue = ref<SignInPayload>({
  email: '',
  password: '',
})
const isLoading = ref<boolean>(false)

const rules: FormRules = {
  email: {
    required: true,
    type: 'email',
    message: "L'adresse email est requise",
    trigger: 'blur',
  },
  password: {
    required: true,
    type: 'string',
    message: 'Le mot-de-passe est requis',
    trigger: 'blur',
  },
}

// Fonction anonyme qui gère la connexion à la validation du formulaire
const handleSignIn = async () => {
  // Valide le formulaire avant de soumettre (affiche les erreurs si invalides)
  formRef.value?.validate(async (errors: FormValidationError[] | undefined) => {
    // Si le formulaire est valide, tente de se connecter
    if (!errors) {
      isLoading.value = true
      try {
        // Appelle la méthode de connexion du store avec les données du formulaire
        await authStore.signIn({
          email: formValue.value.email,
          password: formValue.value.password,
        })
        message.success('Connexion réussie !')

        // Redirige vers la page d'accueil ('/')
        router.replace(ROUTES.HOME)
      } catch (error) {
        message.error(
          `Erreur lors de l'inscription : ${(error as Error).message}`,
        )
      } finally {
        isLoading.value = false
      }
    } else {
      message.info('Veuillez corriger les erreurs dans le formulaire.')
    }
  })
}
</script>

<style scoped>
.n-card {
  max-width: 400px;
}

.sign-in {
  min-height: 100vh;
}
</style>
