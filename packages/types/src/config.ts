import type { Difficulty } from '@/difficulty';
import type { Mode } from '@/mode';

export type GameConfig = {
  player: {
    base_speed: number;
    base_life: number;
  };
};

export type GameConfigs = {
  [K in Mode]: {
    [K in Difficulty]: GameConfig;
  };
};

export const GameConfigs: GameConfigs = {
  arcade: {
    easy: {
      player: {
        base_speed: 50,
        base_life: 100,
      },
    },

    normal: {
      player: {
        base_speed: 50,
        base_life: 100,
      },
    },

    hard: {
      player: {
        base_speed: 50,
        base_life: 100,
      },
    },

    extreme: {
      player: {
        base_speed: 50,
        base_life: 100,
      },
    },

    demon: {
      player: {
        base_speed: 50,
        base_life: 100,
      },
    },
  },
};

export function getGameConfig(mode: Mode, difficulty: Difficulty): GameConfig {
  const config = GameConfigs[mode][difficulty];

  if (!config) {
    throw new Error(
      `Difficulty ${difficulty} does not exist for mode ${mode}.`,
    );
  }

  return config;
}
