import type { Card } from './card'

/**
 * Interface typée pour gérer une Room, c'est-à-dire une salle de jeu où deux joueurs s'affrontent
 * - `id`: Identifiant unique de la room
 * - `host`: Informations sur le joueur hôte (celui qui a créé la room)
 *   - `userId`: Identifiant de l'utilisateur
 *   - `username`: Nom d'utilisateur
 *   - `socketId`: Identifiant de la connexion socket
 *   - `deckId`: Identifiant du deck utilisé par le joueur
 * - `opponent`: Informations sur le joueur adversaire (peut être undefined si personne n'a encore rejoint la room)
 *   - `userId`: Identifiant de l'utilisateur
 *   - `username`: Nom d'utilisateur
 *   - `socketId`: Identifiant de la connexion socket
 *   - `deckId`: Identifiant du deck utilisé par le joueur
 * - `status`: Statut actuel de la room, qui peut être "waiting" (en attente d'un adversaire), "fighting" (en cours de combat) ou "finished" (terminée)
 */
export interface Room {
  id: string
  host: {
    userId: number
    username: string
    socketId: string
    deckId: number
  }
  opponent?: {
    userId: number
    username: string
    socketId: string
    deckId: number
  }
  status: 'waiting' | 'fighting' | 'finished'
}

/**
 * Interface typée pour gérer l'état d'un joueur, que ce soit l'hôte ou l'adversaire
 * - `userId`: Identifiant de l'utilisateur
 * - `username`: Nom d'utilisateur
 * - `handCards`: Cartes actuellement en main du joueur (pour l'adversaire, ces cartes sont cachées)
 * - `deckSize`: Nombre de cartes restantes dans le deck du joueur
 * - `fieldCard`: Carte actuellement posée sur le terrain par le joueur (peut être null si aucune carte n'est posée)
 * - `score`: Score actuel du joueur (nombre de Pokémon vaincu, de 0 à 3) pour déterminer le vainqueur du combat
 */
export interface PlayerInfo {
  userId: number
  username: string
  handCards: Card[]
  deckSize: number
  fieldCard: FieldCard | null
  score: number
}

/**
 * Interface typée pour gérer une carte posée sur le terrain
 * - `card`: La carte Pokémon posée sur le terrain
 * - `currentHp`: Points de vie actuels de la carte
 */
export interface FieldCard {
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
  roomId: string
  host: PlayerInfo
  opponent: PlayerInfo // A les mêmes propriétés que l'hôte, sauf que les cartes en main sont cachées
  turn: number
}

/**
 * Interface typée pour gérer le résultat d'une partie
 * - `winnerId`: Identifiant de l'utilisateur qui a gagné la partie
 */
export interface GameResult {
  winnerId: number
}
