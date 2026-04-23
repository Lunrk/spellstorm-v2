export default {
  title: 'Spellstorm',
  description:
    'A top-down action game where you control a wizard battling through hordes of enemies.',
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
      login_to_unlock: 'Login to unlock more modes',
      select_mode: 'Select Mode',
      select_difficulty: 'Select Difficulty',
    },
  },
};
