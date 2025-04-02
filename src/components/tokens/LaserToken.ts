/**********************************************
 * FILE: src/components/tokens/LaserToken.ts
 * CREATED: 2025-04-02 13:07:56
 *
 * PURPOSE:
 * Implements a laser source token that emits beams in
 * specific directions based on orientation.
 *
 * METHODS:
 * - constructor(): Creates a new laser token with position and orientation
 * - emitBeam(): Emits a beam in the token's orientation direction
 ************************************************/

import type { BaseToken, Beam, Position, Orientation } from '../../types/tokens';

export class LaserToken implements BaseToken {
  readonly type = 'LASER';
  position: Position;
  orientation: Orientation;

  constructor(position: Position, orientation: Orientation) {
    this.position = position;
    this.orientation = orientation;
  }

  emitBeam(): Beam {
    return {
      start: { ...this.position },
      direction: this.orientation,
      path: [{ ...this.position }],
    };
  }
}
