import type { Difficulty } from '@/difficulty';

export type Mode = 'arcade';

export type ModeConfig<K extends Mode = Mode> = {
  key: K;
  difficulties?: Difficulty[];
};

export type ModeConfigs = {
  [K in Mode as Capitalize<K>]: ModeConfig<K>;
};

export const Modes: ModeConfigs = {
  Arcade: {
    key: 'arcade',
    difficulties: ['easy', 'normal', 'hard', 'extreme', 'demon'],
  },
};
