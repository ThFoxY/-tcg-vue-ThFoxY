import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { computed, ref } from 'vue'

import { ROUTES } from '@/router'
import router from '@/router'
import type {
  GameResult,
  GameStartedResponse,
  GameState,
  Room,
  RoomCreatedResponse,
} from '@/types/socket'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref<Socket | null>(null)
  const socketId = ref<string | null>(null) // Stocke l'identifiant de la connexion socket

  const rooms = ref<Room[]>([]) // Stocke les salles disponibles dans le lobby
  const currentRoom = ref<{ id: number } | null>(null) // Stocke la salle actuelle (peut être null si aucune salle n'a été rejointe ou créée)
  const gameState = ref<GameState | null>(null) // Stocke l'état de la partie en cours (peut être null s'il n'y a pas de partie en cours)
  const gameResult = ref<GameResult | null>(null) // Stocke le résultat de la partie (peut être null si la partie n'est pas encore terminée)

  const message = ref<string | null>(null) // Stocke les messages liés aux actions socket
  const error = ref<string | null>(null) // Stocke les messages d'erreur liés à la connexion ou aux actions socket

  // --- Connexion au serveur Socket.IO, avec vérification du token d'authentification (JWT) ---
  const connect = (token: string): void => {
    // RG1 : Rejeter la connexion si une connexion existe déjà
    if (socket.value?.connected) return

    const s = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
    })
    socket.value = s

    // --- Gérer les événements systèmes ---
    // 1. 'connect' : Enregistre l'identifiant de la connexion socket
    s.on('connect', () => {
      socketId.value = s.id ?? null
      error.value = null // Réinitialiser les erreurs à chaque nouvelle connexion
    })

    // 2. 'disconnect' : Réinitialise l'identifiant de la connexion socket
    s.on('disconnect', () => {
      socketId.value = null
    })

    // --- Gérer les événements ---
    // 1. 'roomsList' : Met à jour la liste des rooms
    s.on('roomsList', (data: Room[]) => {
      rooms.value = data
    })

    // 2. 'roomsListUpdated' : Rafraîchit la liste des rooms
    s.on('roomsListUpdated', (data: Room[]) => {
      rooms.value = data
    })

    // 3. 'roomCreated' : Enregistre l'identifiant de la room
    s.on('roomCreated', (data: RoomCreatedResponse) => {
      message.value = data.message
      currentRoom.value = { id: data.roomId }
    })

    // 4. (RG4) 'gameStarted': Démarre la partie et redirige vers /game-room
    s.on('gameStarted', (data: GameStartedResponse) => {
      gameState.value = data.gameState
      message.value = data.message
      router.push(ROUTES.GAME_ROOM)
    })

    // 5. 'error' : Affiche un message d'erreur
    s.on('error', (data: { message: string }) => {
      error.value = data.message
    })

    // --- Gérer les événements en cours de partie ---
    // 1. (RG4) 'gameStateUpdated' : Met à jour l'état de la partie
    s.on('gameStateUpdated', (data: GameState) => {
      gameState.value = data
    })

    // 2. (RG5) 'gameEnded' : Enregistre le résultat de la partie
    s.on('gameEnded', (data: GameResult) => {
      gameResult.value = data
    })

    // 3. 'opponentDisconnected' : Affiche un message à l'utilisateur
    s.on('opponentDisconnected', () => {
      message.value = "Votre adversaire s'est déconnecté !"
    })
  }

  // --- Déconnexion du serveur Socket.IO ---
  const disconnect = (): void => {
    if (!socket.value) return // Si aucune connexion n'existe, ignorer
    socket.value?.disconnect()
    socket.value = null
    socketId.value = null
    error.value = null
  }

  // --- Actions en attente de partie ---
  // 1. 'createRoom' : Crée une nouvelle room
  const createRoom = (deckId: number) => {
    if (!socket.value) return
    socket.value.emit('createRoom', { deckId })
  }
  // 2. 'joinRoom' : Rejoint une room existante
  const joinRoom = (roomId: number, deckId: number) => {
    if (!socket.value) return
    socket.value.emit('joinRoom', { roomId, deckId })
  }

  // --- RG3 : Actions en cours de partie ---
  // 1. 'drawCards' : Piocher une ou des cartes
  const drawCards = () => socket.value?.emit('drawCards')
  // 2. 'playCard' : Jouer une carte
  const playCard = (cardId: number) =>
    socket.value?.emit('playCard', { cardId })
  // 3. 'attack' : Attaquer avec la carte posée sur le terrain
  const attack = () => socket.value?.emit('attack')
  // 4. 'endTurn' : Terminer son tour
  const endTurn = () => socket.value?.emit('endTurn')

  // 'resetGame' : Remet le store à son état initial
  const resetGame = () => {
    currentRoom.value = null
    gameState.value = null
    gameResult.value = null
    message.value = null
    error.value = null
  }

  // --- Fonctions ---
  const isConnected = computed(() => !!socket.value?.connected) // Évite l'erreur "Exported variable 'useSocketStore' has or is using 'Cookie' in..." parce que TypeScript et les dépendances >:(

  // RG1 : Le store expose si c'est le tour du joueur courant
  const playerTurn = computed(() => {
    if (!gameState.value || !socketId.value) return false
    return gameState.value.currentPlayerSocketId === socketId.value
  })

  // RG2 : Le store expose le rôle du joueur (hôte ou adversaire)
  const playerRole = computed((): 'hôte' | 'adversaire' | null => {
    if (!gameState.value || !socketId.value) return null
    if (gameState.value.host.socketId === socketId.value) return 'hôte'
    if (gameState.value.guest.socketId === socketId.value) return 'adversaire'
    return null
  })

  // RG2 : Le store expose les plateaux des deux joueurs
  const gameBoards = computed(() => {
    if (!gameState.value) return null
    return {
      host: gameState.value.host,
      guest: gameState.value.guest,
    }
  })

  // FIX: Plus simple d'obtenir le board du joueur actuel et celui de l'adversaire séparément
  const playerBoard = computed(() => {
    if (!gameBoards.value || !playerRole.value) return null
    return playerRole.value === 'hôte'
      ? gameBoards.value.host
      : gameBoards.value.guest
  })

  const opponentBoard = computed(() => {
    if (!gameBoards.value || !playerRole.value) return null
    return playerRole.value === 'hôte'
      ? gameBoards.value.guest
      : gameBoards.value.host
  })

  return {
    // States
    socketId,
    rooms,
    currentRoom,
    gameState,
    gameResult,
    message,
    error,

    // Actions
    connect,
    disconnect,
    createRoom,
    joinRoom,
    drawCards,
    playCard,
    attack,
    endTurn,
    resetGame,

    // Fonctions
    isConnected,
    playerTurn,
    playerRole,
    gameBoards,
    playerBoard,
    opponentBoard,
  }
})
