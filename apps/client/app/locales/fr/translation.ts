import reference from '~/locales/en/translation';
export default {
  title: 'Spellstorm',
  description:
    "Un jeu d'action vu de dessus où vous incarnez un sorcier combattant des hordes d'ennemis dans des donjons générés de manière procédurale.",
  game: {
    modes: {
      arcade: {
        name: 'Arcade',
        description:
          "Plongez directement dans l'action. Combat pur, sans progression.",
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
      login_to_unlock: 'Login to unlock more modes',
      select_mode: 'Select Mode',
      select_difficulty: 'Select Difficulty',
    },
  },
} satisfies typeof reference;
