import { Schema, type, MapSchema } from '@colyseus/schema';
import type { Difficulty } from '@/difficulty';
import type { Mode } from '@/mode';
import { MapState } from '@/schemas/map';

export class GameState extends Schema {
  // --- Configuration de la session ---
  @type('string') difficulty: Difficulty = 'normal';
  @type('string') mode: Mode = 'arcade';
  @type('string') status: 'lobby' | 'playing' | 'gameover' = 'lobby';

  // --- Temps & Horloge ---
  @type('number') time: number = 0;
  @type('number') server_time: number = 0;

  // --- Entités ---
  // La MapSchema est cruciale : elle permet de synchroniser les joueurs
  // par leur ID de session de manière ultra performante.
  @type({ map: MapState }) maps = new MapSchema<MapState>();
}
