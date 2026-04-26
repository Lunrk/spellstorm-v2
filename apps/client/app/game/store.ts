import { create } from 'zustand';
import type { Client, Room } from '@colyseus/sdk';
import type { GameMetadata, GameState } from '@spellstorm/types/schemas/game';

export type GameRoom = Room<{
  metadata: GameMetadata;
  state: GameState;
}>;

type RoomStore = {
  room: GameRoom | null;
  setRoom: (room: Room) => void;
  clearRoom: () => void;
};

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  setRoom: (room) => set({ room }),
  clearRoom: () => set({ room: null }),
}));
