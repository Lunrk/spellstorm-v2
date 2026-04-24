import { create } from 'zustand';
import type { Room } from '@colyseus/sdk';

type RoomStore = {
  room: Room | null;
  setRoom: (room: Room) => void;
  clearRoom: () => void;
};

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  setRoom: (room) => set({ room }),
  clearRoom: () => set({ room: null }),
}));
