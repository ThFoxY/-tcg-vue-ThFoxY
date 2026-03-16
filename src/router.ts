import { createRouter, createWebHistory } from 'vue-router'

import CreateDeckPage from '@/pages/CreateDeckPage.vue'
import HomePage from '@/pages/HomePage.vue'
import SignInPage from '@/pages/SignInPage.vue'
import SignUpPage from '@/pages/SignUpPage.vue'
import { useAuthStore } from '@/store/auth.store'

// Typage des métadonnées
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

// Routes accessibles
export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  CREATE_DECK: '/create-deck',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  { path: ROUTES.SIGN_IN, component: SignInPage },
  { path: ROUTES.SIGN_UP, component: SignUpPage },
  {
    path: ROUTES.CREATE_DECK,
    component: CreateDeckPage,
    meta: { requiresAuth: true },
  },
]

// Définition des routes
const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  // Récupère le store d'authentification pour vérifier si l'utilisateur est connecté
  const authStore = useAuthStore()
  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route privée, redirige vers la page de connexion
  if (to.meta.requiresAuth && !authStore.isAuthentificated) {
    return ROUTES.SIGN_IN
  }
  // Si l'utilisateur est déjà connecté et essaie d'accéder à la page de connexion ou d'inscription, redirige vers la page d'accueil
  if (
    authStore.isAuthentificated &&
    (to.path === ROUTES.SIGN_IN || to.path === ROUTES.SIGN_UP)
  ) {
    return ROUTES.HOME
  }

  return true
})

export default router
