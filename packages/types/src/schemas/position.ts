import { Schema, type } from '@colyseus/schema';

export class PositionState extends Schema {
  @type('number') x: number = 0;
  @type('number') y: number = 0;
  @type('number') angle: number = 0;
}
