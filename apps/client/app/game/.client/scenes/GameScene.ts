import {
  GameObjects,
  Scene,
  Display,
  type Input,
  Math as PhaserMath,
} from 'phaser';
import { useRoomStore, type GameRoom } from '~/game/store';
import type { MapState } from '@spellstorm/types/schemas/map';
import { useSettingsStore } from '~/game/settings.store';
import type { MouseMovementInput } from '@spellstorm/types/inputs';
import { Messages } from '@spellstorm/types/messages';
import { Callbacks } from '@colyseus/sdk';

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_STEP_WHEEL = 0.001;

export class GameScene extends Scene {
  private players = new Map<string, GameObjects.Container>();

  keys!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  mouse_input: MouseMovementInput | null = null;

  /**
   * Elapsed time since the scene started, used for fixed time step logic in fixedTick()
   */
  elapsedTime = 0;

  /**
   * Using a fixed time step for the game logic to ensure consistent behavior regardless of frame rate variations.
   * The update method will accumulate delta time and call fixedTick at a consistent interval defined by fixedTimeStep.
   */
  fixedTimeStep: number = 1000 / 60;

  constructor() {
    super();
  }

  get room(): GameRoom {
    const { room } = useRoomStore.getState();
    if (!room) throw new Error('GameScene accessed room before it was set');
    return room;
  }

  get map(): MapState {
    this.sys;

    const map = this.room.state.maps.get(this.scene.key);
    if (!map)
      throw new Error(
        `GameScene accessed map "${this.scene.key}" before it was set in state`,
      );
    return map;
  }

  preload() {
    /**
     * Input handling
     */

    const { inputMode, keybinds } = useSettingsStore.getState();

    switch (inputMode) {
      case 'mouse': {
        this.input.on('pointerdown', (pointer: Input.Pointer) => {
          if (!pointer.rightButtonDown()) return;

          /**
           * Convert the pointer position to world coordinates, so it works even if the camera is zoomed or moved. We will use this as the target position for mouse movement input.
           */
          const target = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

          this.mouse_input = {
            type: 'mouse',
            target: { x: target.x, y: target.y },
          };

          this.room.send(Messages.MOVEMENT, this.mouse_input);
        });

        break;
      }

      case 'keyboard': {
        /**
         * Disable context menu on right click, otherwise it can interfere with the game (especially when the canvas is small and the menu appears on top of it)
         */
        this.game.canvas.addEventListener('contextmenu', (e) =>
          e.preventDefault(),
        );

        if (!this.input.keyboard) break;

        this.keys = {
          up: this.input.keyboard.addKey(keybinds.move_up),
          down: this.input.keyboard.addKey(keybinds.move_down),
          left: this.input.keyboard.addKey(keybinds.move_left),
          right: this.input.keyboard.addKey(keybinds.move_right),
        };

        console.log('Keyboard input initialized with keybinds:', keybinds);

        break;
      }
    }
  }

  create() {
    const { width, height } = this.map;
    const bounded = width > 0 && height > 0;

    // Fond
    const graphics = this.add.graphics();
    graphics.setDepth(-1);
    graphics.fillStyle(Display.Color.HexStringToColor('#0d1117').color);

    if (bounded) {
      graphics.fillRect(-width / 2, -height / 2, width, height);
    } else {
      graphics.fillRect(-50000, -50000, 100000, 100000);
    }

    // Grille
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x1a2332, 0.6);
    grid.setDepth(-1);

    const tileSize = 64;
    const range = 50000;

    for (let x = -range; x <= range; x += tileSize) {
      grid.lineBetween(x, -range, x, range);
    }

    for (let y = -range; y <= range; y += tileSize) {
      grid.lineBetween(-range, y, range, y);
    }

    // Joueurs
    const callbacks = Callbacks.get(this.room);

    callbacks.onAdd('players', (player, id) => {
      const isSelf = id === this.room.sessionId;
      // const container = new PlayerContainer(this, player, isSelf);

      const container = new GameObjects.Container(this, player.x, player.y);

      const size = 14;
      const color = isSelf ? 0xffffff : 0x88aaff;

      // Points du triangle
      const x1 = 0;
      const y1 = -size;

      const x2 = -size * 0.6;
      const y2 = size * 0.6;

      const x3 = size * 0.6;
      const y3 = size * 0.6;

      // Calcul du centre géométrique
      const centerX = (x1 + x2 + x3) / 3;
      const centerY = (y1 + y2 + y3) / 3;

      // Décalage des points
      const sprite = new GameObjects.Triangle(
        this,
        0,
        0,
        x1 - centerX,
        y1 - centerY,
        x2 - centerX,
        y2 - centerY,
        x3 - centerX,
        y3 - centerY,
        color,
      );

      // 🔥 IMPORTANT
      sprite.setOrigin(0, 0);

      // 🔥 compense le décalage pour recentrer visuellement
      sprite.setPosition(centerX, centerY);

      container.add(sprite);
      container.setDepth(10);

      container.setData('server_x', player.x);
      container.setData('server_y', player.y);
      container.setData('server_angle', player.angle);

      this.add.existing(container);

      this.players.set(id, container);

      if (this.room.sessionId === id) {
        callbacks.onChange(player, () => {
          container.x = player.x;
          container.y = player.y;
        });
      } else {
        callbacks.onChange(player, () => {
          container.setData('server_x', player.x);
          container.setData('server_y', player.y);
          container.setData('server_angle', player.angle);
        });
      }

      console.log(`[PlayerSystem] spawned player ${id} | isSelf: ${isSelf}`);
    });

    callbacks.onRemove('players', (_player, id) => {
      this.players.get(id)?.destroy();
      this.players.delete(id);
      console.log(`[PlayerSystem] removed player ${id}`);
    });

    // Caméra
    if (width > 0 && height > 0) {
      this.cameras.main.setBounds(-width / 2, -height / 2, width, height);
      console.log(`[CameraSystem] bounds set — ${width}x${height}`);
    } else {
      this.cameras.main.removeBounds();
      console.log('[CameraSystem] bounds removed — infinite map');
    }

    this.input.on(
      'wheel',
      (_pointer: any, _gameObjects: any, _deltaX: number, deltaY: number) => {
        const camera = this.cameras.main;
        camera.setZoom(
          PhaserMath.Clamp(
            camera.zoom - deltaY * ZOOM_STEP_WHEEL,
            ZOOM_MIN,
            ZOOM_MAX,
          ),
        );
      },
    );

    const self = this.players.get(this.room.sessionId);

    if (self) {
      this.cameras.main.startFollow(self, true, 1, 1);
    } else {
      console.warn('[GameScene] self player not found — camera not following');
    }
  }

  fixedTick(time: number, delta: number) {
    const self_container = this.players.get(this.room.sessionId);
    const self_player = this.room.state.players.get(this.room.sessionId);

    if (!self_player || !self_container) return;

    /**
     * Input handling
     */
    const { inputMode } = useSettingsStore.getState();

    switch (inputMode) {
      case 'mouse': {
        console.log('Processing mouse input in fixedTick:', this.mouse_input);

        if (!this.mouse_input) break;

        const dx = this.mouse_input.target.x - self_container.x;
        const dy = this.mouse_input.target.y - self_container.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 0) {
          const step = self_player.speed * (delta / 1000);
          if (step >= dist) {
            self_container.x = this.mouse_input.target.x;
            self_container.y = this.mouse_input.target.y;
            this.mouse_input = null;
          } else {
            const invDist = 1 / dist;
            self_container.x += dx * invDist * step;
            self_container.y += dy * invDist * step;
          }
        }

        break;
      }

      case 'keyboard': {
        const { up, down, left, right } = this.keys;

        if (!up.isDown && !down.isDown && !left.isDown && !right.isDown) break;

        this.room.send(Messages.MOVEMENT, {
          type: 'keyboard',
          input: {
            up: up.isDown,
            down: down.isDown,
            left: left.isDown,
            right: right.isDown,
          },
        });

        if (up.isDown) {
          self_container.y -= self_player.speed * (delta / 1000);
        }

        if (down.isDown) {
          self_container.y += self_player.speed * (delta / 1000);
        }

        if (left.isDown) {
          self_container.x -= self_player.speed * (delta / 1000);
        }

        if (right.isDown) {
          self_container.x += self_player.speed * (delta / 1000);
        }

        break;
      }
    }

    /**
     * Pointer handling
     */
    const pointer = this.input.activePointer;
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const previousAngle = self_container.rotation;

    const angle = PhaserMath.Angle.Between(
      self_container.x,
      self_container.y,
      worldPoint.x,
      worldPoint.y,
    );

    // +PI/2 car notre triangle pointe vers le haut
    const correctedAngle = angle + Math.PI / 2;

    // Envoie uniquement si l'angle a changé de plus de 2 degrés
    const angleDiff = Math.abs(
      PhaserMath.Angle.Wrap(correctedAngle - previousAngle),
    );

    self_container.rotation = correctedAngle;

    if (angleDiff > PhaserMath.DegToRad(1)) {
      this.room.send(Messages.ROTATION, { angle: correctedAngle });
    }

    /**
     * Player handling
     */
    for (const [id, container] of this.players) {
      if (id === this.room.sessionId) {
        continue;
      }

      const { server_x, server_y, server_angle } = container.data.values;

      container.x = PhaserMath.Linear(container.x, server_x, 0.2);
      container.y = PhaserMath.Linear(container.y, server_y, 0.2);
      container.rotation = PhaserMath.Angle.RotateTo(
        container.rotation,
        server_angle,
        0.1,
      );
    }
  }

  update(time: number, delta: number) {
    const self = this.players.get(this.room.sessionId);

    /**
     * Skip update if the player is not yet initialized, to avoid processing input before the player is spawned and causing desync.
     * The player should be spawned very quickly after joining the room, so this should not cause any noticeable delay.
     */
    if (!self) return;

    this.elapsedTime += delta;

    while (this.elapsedTime >= this.fixedTimeStep) {
      this.elapsedTime -= this.fixedTimeStep;
      this.fixedTick(time, this.fixedTimeStep);
    }
  }
}
