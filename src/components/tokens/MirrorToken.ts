/**********************************************
 * FILE: src/components/tokens/MirrorToken.ts
 * CREATED: 2025-04-02 13:08:13
 *
 * PURPOSE:
 * Implements a mirror token that reflects laser beams at 45° angles
 * based on its orientation.
 *
 * METHODS:
 * - constructor(): Creates a new mirror token with position and orientation
 * - reflectBeam(): Calculates the reflected beam direction based on input
 ************************************************/

import type { BaseToken, Position } from '../../types/tokens';
import { Orientation } from '../../types/tokens';

export class MirrorToken implements BaseToken {
  readonly type = 'MIRROR';
  position: Position;
  orientation: Orientation;

  constructor(position: Position, orientation: Orientation) {
    this.position = position;
    this.orientation = orientation;
  }

  reflectBeam(incomingDirection: Orientation): Orientation | null {
    // NORTH orientation represents '/' mirror
    // EAST orientation represents '\' mirror
    if (this.orientation === Orientation.NORTH) {
      switch (incomingDirection) {
        case Orientation.SOUTH:
          return Orientation.WEST;
        case Orientation.EAST:
          return Orientation.SOUTH;
        case Orientation.WEST:
          return Orientation.NORTH;
        case Orientation.NORTH:
          return null; // Pass through
      }
    } else if (this.orientation === Orientation.EAST) {
      switch (incomingDirection) {
        case Orientation.SOUTH:
          return Orientation.EAST;
        case Orientation.WEST:
          return Orientation.SOUTH;
        case Orientation.EAST:
          return Orientation.NORTH;
        case Orientation.NORTH:
          return null; // Pass through
      }
    }
    return null; // Default case - pass through
  }
}
