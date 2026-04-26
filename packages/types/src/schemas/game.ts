import { Schema, type, MapSchema } from '@colyseus/schema';
import { MapState } from '@/schemas/map';
import { PlayerState } from '@/schemas/player';
import type { Mode } from '@/mode';
import type { Difficulty } from '@/difficulty';

export type GameMetadata = {
  mode: Mode;
  difficulty: Difficulty;
};

export class GameState extends Schema {
  // --- Configuration de la session ---
  @type('string') status: 'playing' | 'gameover' = 'playing';

  // --- Temps & Horloge ---
  @type('number') time: number = 0;
  @type('number') server_time: number = 0;

  // --- Entités ---
  @type({ map: MapState }) maps = new MapSchema<MapState>();
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}
