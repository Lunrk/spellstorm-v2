import { getGameConfig } from '@spellstorm/types/config';
import type { Difficulty } from '@spellstorm/types/difficulty';
import type { Mode } from '@spellstorm/types/mode';
import { GameState } from '@spellstorm/types/schemas/game';
import { MapState } from '@spellstorm/types/schemas/map';
import { Player } from '@spellstorm/types/schemas/player';
import { Room, Client } from 'colyseus';

type GameMetadata = {
  mode: Mode;
  difficulty: Difficulty;
};

type GameClient = Client<{
  messages: {};
}>;

export class GameRoom extends Room<{
  state: GameState;
  metadata: GameMetadata;
  client: GameClient;
}> {
  // On définit le state directement comme dans ton exemple
  state = new GameState();

  onCreate(options: any) {
    this.setMetadata({
      mode: options.mode || 'arcade',
      difficulty: options.difficulty || 'normal',
    });

    // Initialisation forcée de la première map (Overworld)
    const overworld = new MapState();
    overworld.id = 'overworld';

    // On l'ajoute au MapSchema des maps
    this.state.maps.set(overworld.id, overworld);

    console.log(
      `[Room ${this.roomId}] Initialisée : ${this.metadata.mode} / ${this.metadata.difficulty}`,
    );
  }

  onJoin(client: Client, options: any) {
    // 1. Récupération de la config selon le mode et la difficulté
    const config = getGameConfig(this.metadata.mode, this.metadata.difficulty);

    // 2. Création de l'entité joueur
    const player = new Player();
    player.id = client.sessionId;
    player.map = 'overworld';

    // 3. Setup des stats via la config
    player.speed = config.player.base_speed;
    player.life = config.player.base_life;
    player.max_life = config.player.base_life;

    // 4. On place le joueur dans le MapState correspondant
    const targetMap = this.state.maps.get(player.map);

    if (targetMap) {
      targetMap.players.set(client.sessionId, player);
      console.log(`[Join] Joueur ${client.sessionId} ajouté à ${player.map}`);
    } else {
      console.error(`[Error] Map ${player.map} introuvable dans le State`);
    }
  }

  onLeave(client: Client, code: number) {
    this.state.maps.forEach((map) => {
      if (map.players.has(client.sessionId)) {
        map.players.delete(client.sessionId);
      }
    });

    console.log(`[Leave] Joueur ${client.sessionId} a quitté (code: ${code})`);
  }
}
