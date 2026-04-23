import { Schema, type } from '@colyseus/schema';

export class Player extends Schema {
  // --- Identité & Localisation ---
  @type('string') id: string = '';
  @type('string') map: string = 'overworld';

  // --- Transform (Physique) ---
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
