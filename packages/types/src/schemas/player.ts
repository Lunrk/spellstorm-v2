import type { KeyboardMovementInput, MouseMovementInput } from '@/inputs';
import { PositionState } from '@/schemas/position';
import { MapSchema, Schema, type } from '@colyseus/schema';

export class PlayerState extends Schema {
  keyboard_input: KeyboardMovementInput[] = [];
  mouse_input: MouseMovementInput | null = null;

  // --- Identité ---
  @type('string') id: string = '';
  @type('string') name: string = 'Player';

  // --- Localisation ---
  @type('string') map: string = 'overworld';
  @type({ map: PositionState }) positions = new MapSchema<PositionState>();

  // --- Transform (position active — raccourci pratique pour Phaser) ---
  @type('number') x: number = 0;
  @type('number') y: number = 0;
  @type('number') angle: number = 0;

  // --- Statistiques Vitales ---
  @type('number') speed: number = 200;
  @type('number') life: number = 100;
  @type('number') max_life: number = 100;
  @type('number') base_damage: number = 10;

  // --- Progression ---
  @type('number') level: number = 1;
  @type('number') exp: number = 0;
  @type('number') points: number = 0;
}
