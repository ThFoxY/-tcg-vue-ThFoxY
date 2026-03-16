<template>
  <NFlex class="sign-in" justify="center" align="center" vertical>
    <NCard title="Inscription">
      <NForm
        ref="formRef"
        :model="formValue"
        :rules="rules"
        @submit.prevent="handleSignUp"
      >
        <NFlex vertical>
          <NFormItem required path="username" label="Nom d'utilisateur">
            <NInput
              v-model:value="formValue.username"
              placeholder="Dresseur42"
              type="text"
              :disabled="isLoading"
            />
          </NFormItem>
          <NFormItem required path="email" label="Email">
            <NInput
              v-model:value="formValue.email"
              placeholder="votre@email.com"
              type="email"
              :disabled="isLoading"
            />
          </NFormItem>
          <NFormItem required path="password" label="Mot-de-passe">
            <NInput
              v-model:value="formValue.password"
              show-password-on="click"
              placeholder="••••••••"
              type="password"
              :disabled="isLoading"
            />
          </NFormItem>
          <NButton
            :disabled="
              !formValue.username ||
              !formValue.email ||
              !formValue.password ||
              isLoading
            "
            type="primary"
            attr-type="submit"
          >
            S'inscrire
          </NButton>
        </NFlex>
      </NForm>
      <NFlex justify="center">
        <p>
          Déjà un compte ?
          <RouterLink :to="ROUTES.SIGN_IN">Connexion</RouterLink>
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
import type { SignUpPayload } from '@/types'

const authStore = useAuthStore()
const message = useMessage()
const router = useRouter()

const formRef = ref<FormInst | null>(null)
const formValue = ref<SignUpPayload>({
  email: '',
  password: '',
  username: '',
})
const isLoading = ref<boolean>(false)

const rules: FormRules = {
  username: {
    required: true,
    message: "Le nom d'utilisateur est requis",
  },
  email: {
    required: true,
    type: 'email',
    message: "L'adresse email est requise",
    trigger: 'blur',
  },
  password: {
    required: true,
    min: 8,
    pattern:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message:
      'Le mot-de-passe doit comporter au moins 8 caractères (majuscules, minuscules, chiffres et symbole)',
    trigger: 'blur',
  },
}

// Fonction anonyme qui gère l'inscription à la validation du formulaire
const handleSignUp = async () => {
  // Valide le formulaire avant de soumettre (affiche les erreurs si invalides)
  formRef.value?.validate(async (errors: FormValidationError[] | undefined) => {
    // Si le formulaire est valide, tente de s'inscrire
    if (!errors) {
      isLoading.value = true
      try {
        // Appelle la méthode d'inscription du store avec les données du formulaire
        await authStore.signUp({
          username: formValue.value.username,
          email: formValue.value.email,
          password: formValue.value.password,
        })
        message.success('Inscription réussie !')

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
