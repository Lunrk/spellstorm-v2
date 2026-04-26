export type MouseMovementInput = {
  type: 'mouse';
  target: { x: number; y: number };
};

export type KeyboardMovementInput = {
  type: 'keyboard';
  input: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  };
};

export type MovementInput = MouseMovementInput | KeyboardMovementInput;
