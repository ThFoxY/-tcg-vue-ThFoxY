import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useStorage } from '@/composables/useStorage'
import type { SignInPayload, SignUpPayload, User } from '@/types'

/**
 * Store Pinia pour gérer l'authentification de l'utilisateur (inclus un token JWT).
 * Le token JWT et l'utilisateur sont initialisés à partir du localStorage grâce au composable useStorage.
 */
export const useAuthStore = defineStore('auth', () => {
  const { get, set } = useStorage()
  const api = useApi()

  // Récupère le token et l'utilisateur depuis le localStorage au moment de l'initialisation du store
  const token = ref<string | null>(get<string | null>('token'))
  const user = ref<User | null>(get<User | null>('user'))

  // Computed pour savoir si l'utilisateur est authentifié (présence d'un token et d'un utilisateur)
  const isAuthentificated = computed(() => {
    return token.value && user.value ? true : false
  })

  // Fonction anonyme pour enregistrer le token et l'utilisateur (dans le store et dans le cache) à l'inscription
  const signUp = async (payload: SignUpPayload) => {
    const { username, email, password } = payload
    const res = await api.signUp({
      username: username,
      email: email,
      password: password,
    })
    set('token', res.token)
    set('user', res.user)
    token.value = res.token
    user.value = res.user
  }

  // Fonction anonyme pour mettre à jour le token et l'utilisateur (dans le store et dans le cache) à la connexion
  const signIn = async (payload: SignInPayload) => {
    const { email, password } = payload
    const res = await api.signIn({
      email: email,
      password: password,
    })
    set('token', res.token)
    set('user', res.user)
    token.value = res.token
    user.value = res.user
  }

  // Fonction anonyme pour supprimer le token et l'utilisateur (dans le store et dans le cache) à la déconnexion
  const signOut = () => {
    set('token', null)
    set('user', null)
    token.value = null
    user.value = null
  }

  return { token, user, isAuthentificated, signUp, signIn, signOut }
})
