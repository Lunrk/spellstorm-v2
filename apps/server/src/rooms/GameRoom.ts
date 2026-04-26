import { getGameConfig } from '@spellstorm/types/config';
import type { Difficulty } from '@spellstorm/types/difficulty';
import type {
  KeyboardMovementInput,
  MovementInput,
} from '@spellstorm/types/inputs';
import type { Mode } from '@spellstorm/types/mode';
import { GameState } from '@spellstorm/types/schemas/game';
import { MapState } from '@spellstorm/types/schemas/map';
import { PlayerState } from '@spellstorm/types/schemas/player';
import {
  Room,
  Client,
  type AuthContext,
  validate,
  type Messages,
} from 'colyseus';
import { z } from 'zod';

// TODO : Add IP tracking and banning for security + ensure guests cannot join two rooms as the same time with redis

type GameMetadata = {
  mode: Mode;
  difficulty: Difficulty;
};

type GameUserData =
  | {
      guest: true;
      id?: never;
    }
  | {
      guest?: false;
      id: string;
    };

type GameClient = Client<{
  messages: {};
  userData: GameUserData;
}>;

export class GameRoom extends Room<{
  state: GameState;
  metadata: GameMetadata;
  client: GameClient;
}> {
  fixedTimeStep: number = 1000 / 60;

  state = new GameState();

  messages: Messages<GameRoom> = {
    movement: validate(
      z.discriminatedUnion('type', [
        z.object({
          type: z.literal('keyboard'),
          input: z.object({
            up: z.boolean(),
            down: z.boolean(),
            left: z.boolean(),
            right: z.boolean(),
          }),
        }),
        z.object({
          type: z.literal('mouse'),
          target: z.object({
            x: z.number(),
            y: z.number(),
          }),
        }),
      ]),
      (client: GameClient, payload: MovementInput) => {
        const player = this.state.players.get(client.sessionId);
        console.log(
          'Received movement input from',
          client.sessionId,
          ':',
          payload,
        );
        if (payload.type === 'mouse') {
          player.mouse_input = payload;
        } else if (payload.type === 'keyboard') {
          player.keyboard_input.push(payload);
        }
      },
    ),

    rotation: validate(
      z.object({
        angle: z.number(),
      }),
      (client: GameClient, payload: { angle: number }) => {
        const player = this.state.players.get(client.sessionId);
        console.log(
          'Received rotation input from',
          client.sessionId,
          ':',
          payload,
        );
        player.angle = payload.angle;
      },
    ),
  };

  onAuth(_client: Client, _options: any, context: AuthContext): GameUserData {
    if (context.token) {
      // TODO : Check token validity and retrieve user info
      return {
        // TODO : Implement proper user retrieval once auth is setup
        id: 'some-unique-player-id',
      };
    }

    return { guest: true };
  }

  onCreate(options: any) {
    this.setMetadata({
      mode: options.mode || 'arcade',
      difficulty: options.difficulty || 'normal',
    });

    const overworld = new MapState();
    overworld.id = 'overworld';
    this.state.maps.set(overworld.id, overworld);

    let elapsedTime = 0;

    // Game loop
    this.setSimulationInterval((deltaTime) => {
      elapsedTime += deltaTime;

      while (elapsedTime >= this.fixedTimeStep) {
        elapsedTime -= this.fixedTimeStep;
        this.fixedTick(this.fixedTimeStep);
      }
    });

    console.log(
      `[Room ${this.roomId}] Initialisée : ${this.metadata.mode} / ${this.metadata.difficulty}`,
    );
  }

  fixedTick(deltaTime: number) {
    this.state.players.forEach((player) => {
      if (player.mouse_input) {
        const input = player.mouse_input;
        const dx = input.target.x - player.x;
        const dy = input.target.y - player.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return;

        const step = player.speed * (deltaTime / 1000); // ← ici

        if (step >= dist) {
          player.x = input.target.x;
          player.y = input.target.y;
          player.mouse_input = null;
        } else {
          const invDist = 1 / dist;
          player.x += dx * invDist * step;
          player.y += dy * invDist * step;
        }

        console.log('Processed mouse input for player', player.id, ':', input);
        console.log('New position:', { x: player.x, y: player.y });
      } else if (player.keyboard_input.length > 0) {
        let input: KeyboardMovementInput;

        while ((input = player.keyboard_input.shift())) {
          const { up, down, left, right } = input.input;

          let vx = 0;
          let vy = 0;

          if (up) vy -= 1;
          if (down) vy += 1;
          if (left) vx -= 1;
          if (right) vx += 1;

          const len = Math.hypot(vx, vy);
          if (len === 0) continue;

          const invLen = 1 / len;
          player.x += vx * invLen * player.speed * (deltaTime / 1000); // ← ici
          player.y += vy * invLen * player.speed * (deltaTime / 1000); // ← ici
        }
      }
    });
  }

  onJoin(client: Client, _options: any, auth: GameUserData) {
    if (auth.guest) {
      console.log(
        `[Join] Un invité (${client.sessionId}) a rejoint la partie.`,
      );
    }

    const config = getGameConfig(this.metadata.mode, this.metadata.difficulty);

    const player = new PlayerState();
    player.id = client.sessionId;
    player.name = auth.guest
      ? `Guest_${client.sessionId.slice(0, 4)}`
      : // TODO : Replace with actual username once auth is implemented
        `Player_${auth.id}`;
    player.map = 'overworld';
    player.speed = config.player.base_speed;
    player.life = config.player.base_life;
    player.max_life = config.player.base_life;

    this.state.players.set(player.id, player);
  }

  onLeave(client: Client, code: number) {
    this.state.players.delete(client.sessionId);
    console.log(`[Leave] Joueur ${client.sessionId} a quitté (code: ${code})`);
  }
}
