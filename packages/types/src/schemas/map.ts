import { MapSchema, Schema, type } from '@colyseus/schema';
import { Player } from '@/schemas/player';

export class MapState extends Schema {
  @type('string') id: string = ''; // ID de la map (ex: 'overworld')

  // On range les entités PAR map
  @type({ map: Player }) players = new MapSchema<Player>();
  // @type({ map: Enemy }) enemies = new MapSchema<Enemy>();
  // @type({ map: Projectile }) projectiles = new MapSchema<Projectile>();
}
