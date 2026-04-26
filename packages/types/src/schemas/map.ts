import { Schema, type } from '@colyseus/schema';

export class MapState extends Schema {
  @type('string') id: string = '';
  @type('number') width: number = 0;
  @type('number') height: number = 0;
}
