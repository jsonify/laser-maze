/***********************************************
 * FILE: src/utils/__tests__/beamPropagation.test.ts
 * CREATED: 2025-04-03 15:02:56
 *
 * PURPOSE:
 * Test suite for basic laser beam propagation, focusing on straight-line
 * movement and grid boundary detection. Does not include reflections
 * or target interactions.
 *
 * TESTS:
 * - Straight line movement (N, E, S, W)
 * - Boundary detection
 * - Path position tracking
 *****************/

import { LaserPhysics } from '../laserPhysics';
import { createGrid } from '../grid';
import type { Position } from '../../types/tokens';
import { Orientation } from '../../types/tokens';

describe('LaserPhysics - Beam Propagation', () => {
  let physics: LaserPhysics;

  beforeEach(() => {
    physics = new LaserPhysics();
  });

  describe('Straight Line Movement', () => {
    it('should propagate EAST until grid boundary from middle', () => {
      const grid = createGrid(); // Assuming 5x5 grid
      const startPos: Position = { x: 0, y: 2 };
      const direction = Orientation.EAST;
      const expectedPath: Position[] = [
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
      ];

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.positions).toEqual(expectedPath);
      expect(path.reflectionPoints).toHaveLength(0);
      expect(path.targetHits).toHaveLength(0);
    });

    it('should propagate WEST until grid boundary from middle', () => {
      const grid = createGrid();
      const startPos: Position = { x: 4, y: 2 };
      const direction = Orientation.WEST;
      const expectedPath: Position[] = [
        { x: 4, y: 2 },
        { x: 3, y: 2 },
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 0, y: 2 },
      ];

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.positions).toEqual(expectedPath);
      expect(path.reflectionPoints).toHaveLength(0);
      expect(path.targetHits).toHaveLength(0);
    });

    it('should propagate SOUTH until grid boundary from middle', () => {
      const grid = createGrid();
      const startPos: Position = { x: 2, y: 0 };
      const direction = Orientation.SOUTH;
      const expectedPath: Position[] = [
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 2, y: 4 },
      ];

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.positions).toEqual(expectedPath);
      expect(path.reflectionPoints).toHaveLength(0);
      expect(path.targetHits).toHaveLength(0);
    });

    it('should propagate NORTH until grid boundary from middle', () => {
      const grid = createGrid();
      const startPos: Position = { x: 2, y: 4 };
      const direction = Orientation.NORTH;
      const expectedPath: Position[] = [
        { x: 2, y: 4 },
        { x: 2, y: 3 },
        { x: 2, y: 2 },
        { x: 2, y: 1 },
        { x: 2, y: 0 },
      ];

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.positions).toEqual(expectedPath);
      expect(path.reflectionPoints).toHaveLength(0);
      expect(path.targetHits).toHaveLength(0);
    });
  });

  describe('Boundary Detection', () => {
    it('should stop immediately if starting outside EAST boundary', () => {
      const grid = createGrid();
      const startPos: Position = { x: 5, y: 2 }; // Outside
      const direction = Orientation.EAST;

      // Expect only the starting position if it's considered valid initially,
      // or potentially an empty path if validation happens before start.
      // Let's assume the start position is always added.
      const path = physics.calculateBeamPath(grid, startPos, direction);

      // This expectation depends on how calculateBeamPath handles invalid starts.
      // Assuming it adds startPos then immediately stops.
      expect(path.positions).toEqual([{ x: 5, y: 2 }]);
    });

    it('should stop immediately if starting at EAST boundary and moving EAST', () => {
      const grid = createGrid();
      const startPos: Position = { x: 4, y: 2 };
      const direction = Orientation.EAST;
      const path = physics.calculateBeamPath(grid, startPos, direction);
      expect(path.positions).toEqual([{ x: 4, y: 2 }]); // Only start position
    });

    // Add similar tests for NORTH, SOUTH, WEST boundaries

    it('should stop immediately if starting at NORTH boundary and moving NORTH', () => {
      const grid = createGrid();
      const startPos: Position = { x: 2, y: 0 };
      const direction = Orientation.NORTH;
      const path = physics.calculateBeamPath(grid, startPos, direction);
      expect(path.positions).toEqual([{ x: 2, y: 0 }]);
    });

    it('should stop immediately if starting at SOUTH boundary and moving SOUTH', () => {
      const grid = createGrid();
      const startPos: Position = { x: 2, y: 4 };
      const direction = Orientation.SOUTH;
      const path = physics.calculateBeamPath(grid, startPos, direction);
      expect(path.positions).toEqual([{ x: 2, y: 4 }]);
    });

    it('should stop immediately if starting at WEST boundary and moving WEST', () => {
      const grid = createGrid();
      const startPos: Position = { x: 0, y: 2 };
      const direction = Orientation.WEST;
      const path = physics.calculateBeamPath(grid, startPos, direction);
      expect(path.positions).toEqual([{ x: 0, y: 2 }]);
    });
  });
});
