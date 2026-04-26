import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type InputMode = 'keyboard' | 'mouse';

export interface Keybinds {
  move_up: string;
  move_down: string;
  move_left: string;
  move_right: string;
}

export const DEFAULT_KEYBINDS: Keybinds = {
  move_up: 'W',
  move_down: 'S',
  move_left: 'A',
  move_right: 'D',
};

interface SettingsStore {
  inputMode: InputMode;
  keybinds: Keybinds;

  setInputMode: (mode: InputMode) => void;
  setKeybind: (action: keyof Keybinds, key: string) => void;
  resetKeybinds: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      inputMode: 'keyboard',
      keybinds: DEFAULT_KEYBINDS,

      setInputMode: (mode) => set({ inputMode: mode }),

      setKeybind: (action, key) =>
        set((state) => ({
          keybinds: { ...state.keybinds, [action]: key },
        })),

      resetKeybinds: () => set({ keybinds: DEFAULT_KEYBINDS }),
    }),
    {
      name: 'spellstorm-settings',
    },
  ),
);
