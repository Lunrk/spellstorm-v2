import { AUTO, Game, Scale, type Types } from 'phaser';
import { useRoomStore } from '~/game/store';
import { GameScene } from './scenes/GameScene';

export class GameManager {
  private static game: Game | null = null;

  static get isActive(): boolean {
    return this.game !== null;
  }

  static start(container: HTMLElement) {
    if (this.game) return;

    const { room } = useRoomStore.getState();

    if (!room) {
      console.error('[GameManager] no room in store — aborting');
      return;
    }

    const self = room.state.players.get(room.sessionId);

    if (!self) {
      console.error('[GameManager] player not found in state — aborting');
      return;
    }

    const config: Types.Core.GameConfig = {
      type: AUTO,
      parent: container,
      backgroundColor: '#0d1117',
      scene: [],
      scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    this.game = new Game(config);

    this.game.events.once('ready', () => {
      if (!this.game) return;
      GameManager.startMapScene(self.map);
      console.log(`[GameManager] Phaser ready — started map "${self.map}"`);
    });
  }

  // Démarre une scène pour une map — première visite
  static startMapScene(id: string) {
    if (!this.game) return;

    const { room } = useRoomStore.getState();

    if (!room?.state.maps.get(id)) {
      console.error(`[GameManager] map "${id}" not found in state — aborting`);
      return;
    }

    this.game.scene.add(id, GameScene, true);
    console.log(`[GameManager] scene added for map "${id}"`);
  }

  // Change de map — sleep la courante, wake ou start la nouvelle
  static switchMap(fromMapId: string, toMapId: string) {
    if (!this.game) return;

    this.game.scene.sleep(fromMapId);
    console.log(`[GameManager] scene "${fromMapId}" sleeping`);

    if (this.game.scene.getScene(toMapId)) {
      this.game.scene.wake(toMapId);
      console.log(`[GameManager] scene "${toMapId}" waking`);
    } else {
      GameManager.startMapScene(toMapId);
    }
  }

  static destroy() {
    this.game?.destroy(true);
    this.game = null;
    console.log('[GameManager] destroyed');
  }
}
