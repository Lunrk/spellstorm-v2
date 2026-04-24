import { title } from 'process';

export default {
  title: 'Spellstorm',
  description: 'The arcade spell-caster. How far will you go?',
  game: {
    modes: {
      arcade: {
        name: 'Arcade',
        description:
          'Jump straight into the action. Pure combat, no progression.',
      },
      story: {
        name: 'Story Mode',
        description: "Follow the wizard's journey. (Login required)",
      },
    },
    difficulties: {
      easy: { name: 'Easy', desc: 'For those who want to relax.' },
      normal: { name: 'Normal', desc: "The way it's meant to be played." },
      hard: { name: 'Hard', desc: 'Mistakes will be punished.' },
      extreme: { name: 'Extreme', desc: 'Only for veterans.' },
      demon: { name: 'Demon', desc: 'Good luck. You will need it.' },
    },
    actions: {
      play_now: 'Play Now',
      play: 'Play',
      leaderboard: 'Leaderboard',
      settings: 'Settings',
      coming_soon: 'Coming Soon',
      login_to_unlock: 'Login to unlock more modes',
      select_mode: 'Select Mode',
      select_difficulty: 'Select Difficulty',
      quit: 'Quit game',
      back: 'Back to menu',
      connecting: 'Connecting to server...',
    },
  },
  not_found: {
    title: 'Page Not Found',
    description: "The page you're looking for doesn't exist.",
    back_to_home: 'Back to Home',
  },
};
