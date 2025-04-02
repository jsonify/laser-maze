/**********************************************
 * FILE: src/components/tokens/TargetToken.ts
 * CREATED: 2025-04-02 13:08:33
 *
 * PURPOSE:
 * Implements a target token that can be activated by laser beams
 * and maintains its activation state.
 *
 * METHODS:
 * - constructor(): Creates a new target token with position
 * - handleBeamHit(): Processes a beam hit and activates the target
 * - activate(): Manually activates the target
 * - reset(): Resets the target to inactive state
 ************************************************/

import type { BaseToken, Beam, Position } from '../../types/tokens';

export class TargetToken implements BaseToken {
  readonly type = 'TARGET';
  position: Position;
  isActive: boolean;

  constructor(position: Position) {
    this.position = position;
    this.isActive = false;
  }

  handleBeamHit(beam: Beam): void {
    if (beam.path.some((pos) => pos.x === this.position.x && pos.y === this.position.y)) {
      this.activate();
    }
  }

  activate(): void {
    this.isActive = true;
  }

  reset(): void {
    this.isActive = false;
  }
}
