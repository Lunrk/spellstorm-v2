import { Client } from '@colyseus/sdk';

export const colyseus = new Client(
  import.meta.env.VITE_COLYSEUS_SERVER_URL || 'ws://localhost:2567',
);
