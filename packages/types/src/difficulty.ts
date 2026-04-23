export type Difficulty = 'easy' | 'normal' | 'hard' | 'extreme' | 'demon';

export type DifficultyConfig = {
  key: Difficulty;
};

export type DifficultyConfigs = {
  [K in Difficulty as Capitalize<K>]: DifficultyConfig;
};

export const Difficulties: DifficultyConfigs = {
  Easy: { key: 'easy' },
  Normal: { key: 'normal' },
  Hard: { key: 'hard' },
  Extreme: { key: 'extreme' },
  Demon: { key: 'demon' },
};
