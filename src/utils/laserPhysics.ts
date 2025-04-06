/***********************************************
 * FILE: src/utils/laserPhysics.ts
 * CREATED: 2025-04-02 15:25:04
 *
 * PURPOSE:
 * Implements the laser beam physics system for the game, handling beam
 * propagation, mirror reflections, and target detection.
 *
 * METHODS:
 * - calculateBeamPath(): Calculates complete beam trajectory
 *****************/

import type { Grid } from './grid';
import { Cell } from './grid';
import type { Position } from '../types/tokens';
import { Orientation } from '../types/tokens';

interface ReflectionPoint {
  position: Position;
  incomingDirection: Orientation;
  outgoingDirection: Orientation;
}

interface TargetHit {
  position: Position;
  hitDirection: Orientation;
}

export interface BeamPath {
  positions: Position[];
  reflectionPoints: ReflectionPoint[];
  targetHits: TargetHit[];
}

export class LaserPhysics {
  private readonly directionVectors = {
    [Orientation.NORTH]: { x: 0, y: -1 },
    [Orientation.EAST]: { x: 1, y: 0 },
    [Orientation.SOUTH]: { x: 0, y: 1 },
    [Orientation.WEST]: { x: -1, y: 0 },
  } as const;

  private getNextPosition(pos: Position, direction: Orientation): Position {
    const vector = this.directionVectors[direction];
    return {
      x: pos.x + vector.x,
      y: pos.y + vector.y,
    };
  }

  private isValidPosition(pos: Position): boolean {
    return pos.x >= 0 && pos.x < 5 && pos.y >= 0 && pos.y < 5;
  }

  private getMirrorReflection(
    direction: Orientation,
    mirrorOrientation: 0 | 90 | 180 | 270
  ): Orientation {
    // Forward slash mirror ('/') - Orientations 0 or 180
    if (mirrorOrientation === 0 || mirrorOrientation === 180) {
      switch (direction) {
        case Orientation.EAST:
          return Orientation.NORTH;
        case Orientation.WEST:
          return Orientation.SOUTH;
        case Orientation.NORTH:
          return Orientation.EAST;
        case Orientation.SOUTH:
          return Orientation.WEST;
      }
    }
    // Back slash mirror ('\') - Orientations 90 or 270
    else if (mirrorOrientation === 90 || mirrorOrientation === 270) {
      switch (direction) {
        case Orientation.NORTH:
          return Orientation.WEST;
        case Orientation.EAST:
          return Orientation.SOUTH;
        case Orientation.SOUTH:
          return Orientation.EAST;
        case Orientation.WEST:
          return Orientation.NORTH;
      }
    }
    // Should not happen due to type constraints, but return original direction as fallback
    return direction;
  }

  private isTargetHit(direction: Orientation, targetOrientation: number): boolean {
    const requiredHitDirection: Record<string, Orientation> = {
      '0': Orientation.SOUTH, // Target faces North, must be hit from South
      '90': Orientation.WEST, // Target faces East, must be hit from West
      '180': Orientation.NORTH, // Target faces South, must be hit from North
      '270': Orientation.EAST, // Target faces West, must be hit from East
    };
    return requiredHitDirection[targetOrientation.toString()] === direction;
  }

  public calculateBeamPath(grid: Grid, startPos: Position, direction: Orientation): BeamPath {
    const path: BeamPath = {
      positions: [{ ...startPos }],
      reflectionPoints: [],
      targetHits: [],
    };

    let currentPos = { ...startPos };
    let currentDirection = direction;
    let steps = 0;
    const MAX_STEPS = 100;

    while (steps < MAX_STEPS) {
      steps++;
      const nextPos = this.getNextPosition(currentPos, currentDirection);

      // Stop if we hit grid boundary
      if (!this.isValidPosition(nextPos)) {
        break;
      }

      path.positions.push({ ...nextPos });
      const cell = grid[nextPos.y][nextPos.x];

      // Handle mirror reflection
      if (cell.token?.type === 'mirror') {
        const incomingDirection = currentDirection;
        const outgoingDirection = this.getMirrorReflection(
          currentDirection,
          cell.token.orientation
        );

        path.reflectionPoints.push({
          position: { ...nextPos },
          incomingDirection,
          outgoingDirection,
        });

        currentDirection = outgoingDirection;
        currentPos = { ...nextPos };
        continue;
      }

      // Handle target hits
      if (cell.token?.type === 'target') {
        if (this.isTargetHit(currentDirection, cell.token.orientation)) {
          path.targetHits.push({
            position: { ...nextPos },
            hitDirection: currentDirection,
          });
        }
        break;
      }

      // Stop at any other token
      if (cell.token) {
        break;
      }

      // Move to next position
      currentPos = { ...nextPos };
    }

    return path;
  }
}
