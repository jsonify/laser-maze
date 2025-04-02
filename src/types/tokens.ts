/**********************************************
 * FILE: src/types/tokens.ts
 * CREATED: 2025-04-02 13:07:39
 *
 * PURPOSE:
 * Core type definitions for the token system including positions,
 * orientations, beams, and base token interfaces.
 *
 * TYPES:
 * - Position: Coordinates in the grid
 * - Orientation: Cardinal directions
 * - Beam: Laser beam properties and path
 * - BaseToken: Common token properties
 ************************************************/

export interface Position {
  x: number;
  y: number;
}

export enum Orientation {
  NORTH = 'NORTH',
  EAST = 'EAST',
  SOUTH = 'SOUTH',
  WEST = 'WEST',
}

export interface Beam {
  start: Position;
  direction: Orientation;
  path: Position[];
}

export interface BaseToken {
  type: string;
  position: Position;
  orientation?: Orientation;
}
