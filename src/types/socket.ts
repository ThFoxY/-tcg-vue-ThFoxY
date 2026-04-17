import type { Card } from './card'

// FIX : Mise en accord avec les structures de données utilisées par le Socket.IO côté serveur

/**
 * Interface typée pour gérer une Room, c'est-à-dire une salle de jeu où deux joueurs s'affrontent
 * - `id`: Identifiant unique de la room
 * - `hostSocketId`: Identifiant de la socket du joueur hôte qui a créé la room
 */
export interface Room {
  id: number
  hostSocketId: string
}

/**
 * Interface typée pour gérer la réponse du serveur lors de la création d'une room
 * - `message`: Message d'information sur la création de la room
 * - `roomId`: Identifiant de la room nouvellement créée, qui sera utilisé pour rejoindre la room ou démarrer une partie
 */
export interface RoomCreatedResponse {
  message: string
  roomId: number
}

/**
 * Interface typée pour gérer l'état d'un joueur, que ce soit l'hôte ou l'adversaire
 * - `socketId`: Identifiant de la socket du joueur
 * - `board`: Informations sur le plateau de jeu du joueur, incluant les cartes en main, la carte active sur le terrain, et le score actuel
 */
export interface PlayerBoard {
  socketId: string
  board: {
    activeCard: ActiveCard | null
    deck: Card[]
    hand: Card[]
    score: number
  }
}

/**
 * Interface typée pour gérer une carte posée sur le terrain
 * - `card`: La carte Pokémon posée sur le terrain
 * - `currentHp`: Points de vie actuels de la carte
 */
export interface ActiveCard {
  card: Card
  currentHp: number
}

/**
 * Interface typée pour gérer l'état global du jeu, qui est partagé entre les deux joueurs
 * - `roomId`: Identifiant de la room dans laquelle les joueurs s'affrontent
 * - `host`: Informations sur le joueur hôte (cartes en main cachées pour l'adversaire)
 * - `opponent`: Informations sur le joueur adversaire (cartes en main cachées pour l'hôte)
 * - `turn`: Indique à qui c'est le tour de jouer, soit "host" pour l'hôte, soit "opponent" pour l'adversaire
 */
export interface GameState {
  roomId: number
  status: string
  currentPlayerSocketId: string
  host: PlayerBoard
  guest: PlayerBoard
}

/**
 * Interface typée pour gérer la réponse du serveur lors du démarrage d'une partie
 * - `message`: Message d'information sur le démarrage de la partie
 * - `gameState`: État initial du jeu partagé entre les deux joueurs au moment du démarrage de la partie
 */
export interface GameStartedResponse {
  message: string
  gameState: GameState
}

/**
 * Interface typée pour gérer le résultat d'une partie
 * - `winnerId`: Identifiant de l'utilisateur qui a gagné la partie
 */
export interface GameResult {
  winnerId: number
}
