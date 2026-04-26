import type { MovementInput } from '@/inputs';

/**
 * Liste des messages (runtime + type)
 */
export const Messages = {
  MOVEMENT: 'movement',
  ROTATION: 'rotation',
} as const;

/**
 * Union des valeurs ("movement")
 */
export type Message = (typeof Messages)[keyof typeof Messages];

/**
 * Mapping message → payload
 */
export interface ClientToServerMessages {
  [Messages.MOVEMENT]: MovementInput;
  [Messages.ROTATION]: {
    angle: number;
  };
}

/**
 * Type helper
 */
export type ClientToServerMessage = keyof ClientToServerMessages;

/**
 * Payload associé à un message
 */
export type ClientToServerPayload<M extends ClientToServerMessage> =
  ClientToServerMessages[M];
