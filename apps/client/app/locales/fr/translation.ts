import reference from '~/locales/en/translation';
export default {
  title: 'Spellstorm',
  description: "Le jeu d'arcade des sorciers. Jusqu'où iras-tu ?",
  game: {
    modes: {
      arcade: {
        name: 'Arcade',
        description:
          "Plongez directement dans l'action. Combat pur, sans progression.",
      },
      story: {
        name: 'Mode Histoire',
        description: 'Suivez le voyage du wizard. (Connexion requise)',
      },
    },
    difficulties: {
      easy: { name: 'Easy', desc: 'Pour ceux qui veulent se détendre.' },
      normal: {
        name: 'Normal',
        desc: 'La façon dont le jeu est censé être joué.',
      },
      hard: { name: 'Hard', desc: 'Les erreurs seront punies.' },
      extreme: { name: 'Extreme', desc: 'Seulement pour les vétérans.' },
      demon: { name: 'Demon', desc: 'Bonne chance. Vous en aurez besoin.' },
    },
    actions: {
      play_now: 'Jouer Maintenant',
      play: 'Jouer',
      leaderboard: 'Classement',
      settings: 'Paramètres',
      coming_soon: 'Bientôt disponible',
      login_to_unlock: 'Connectez-vous pour débloquer plus de modes',
      select_mode: 'Sélectionner le mode',
      select_difficulty: 'Sélectionner la difficulté',
      quit: 'Quitter le jeu',
      back: 'Retour au menu',
      connecting: 'Connexion au serveur...',
    },
  },
  not_found: {
    title: 'Page non trouvée',
    description: "La page que vous recherchez n'existe pas.",
    back_to_home: "Retour à l'accueil",
  },
  settings: {
    sections: {
      controls: 'Contrôles',
    },
    input_mode: {
      title: 'Mode de contrôle',
      keyboard: 'Clavier',
      mouse: 'Souris',
    },
    keybinds: {
      title: 'Touches',
      reset: 'Réinitialiser',
      move_up: 'Avancer',
      move_down: 'Reculer',
      move_left: 'Gauche',
      move_right: 'Droite',
    },
  },
} satisfies typeof reference;
