/***********************************************
 * FILE: src/utils/laserPhysics.test.ts
 * CREATED: 2025-04-02 13:35:07
 *
 * PURPOSE:
 * Test suite for the laser physics system, verifying beam propagation,
 * mirror reflections, and target detection.
 *
 * TESTS:
 * - Basic beam propagation
 * - Mirror reflections
 * - Target hit detection
 * - Grid boundary handling
 *****************/

import { LaserPhysics } from './laserPhysics';
import { createGrid, placeToken } from './grid';
import { Orientation } from '../types/tokens';

describe('LaserPhysics', () => {
  let physics: LaserPhysics;

  beforeEach(() => {
    physics = new LaserPhysics();
  });

  describe('calculateBeamPath', () => {
    it('should propagate in a straight line until grid boundary', () => {
      const grid = createGrid();
      const startPos = { x: 0, y: 2 };
      const direction = Orientation.EAST;

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.positions).toHaveLength(5); // Start + 4 steps to edge
      expect(path.positions).toEqual([
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
      ]);
      expect(path.reflectionPoints).toHaveLength(0);
      expect(path.targetHits).toHaveLength(0);
    });

    it('should reflect off a mirror at 90 degrees', () => {
      const grid = createGrid();
      const mirrorPos = { x: 2, y: 2 };
      placeToken(grid, mirrorPos.x, mirrorPos.y, {
        type: 'mirror',
        orientation: 0,
        state: 'idle',
      });

      const startPos = { x: 0, y: 2 };
      const direction = Orientation.EAST;

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.reflectionPoints).toHaveLength(1);
      expect(path.reflectionPoints[0]).toEqual({
        position: mirrorPos,
        incomingDirection: Orientation.EAST,
        outgoingDirection: Orientation.NORTH,
      });

      // Path should go east then north
      expect(path.positions).toContainEqual(startPos);
      expect(path.positions).toContainEqual(mirrorPos);
      expect(path.positions).toContainEqual({ x: 2, y: 1 });
      expect(path.positions).toContainEqual({ x: 2, y: 0 });
    });

    it('should detect target hits from correct direction', () => {
      const grid = createGrid();
      const targetPos = { x: 2, y: 2 };
      placeToken(grid, targetPos.x, targetPos.y, {
        type: 'target',
        orientation: 90, // Facing east
        state: 'idle',
      });

      const startPos = { x: 0, y: 2 };
      const direction = Orientation.EAST;

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.targetHits).toHaveLength(1);
      expect(path.targetHits[0]).toEqual({
        position: targetPos,
        hitDirection: Orientation.EAST,
      });
    });

    it('should not detect target hits from wrong direction', () => {
      const grid = createGrid();
      const targetPos = { x: 2, y: 2 };
      placeToken(grid, targetPos.x, targetPos.y, {
        type: 'target',
        orientation: 0, // Facing north
        state: 'idle',
      });

      const startPos = { x: 0, y: 2 };
      const direction = Orientation.EAST;

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.targetHits).toHaveLength(0);
      expect(path.positions).toContainEqual(targetPos);
    });

    it('should handle multiple mirror reflections', () => {
      const grid = createGrid();

      // Place two mirrors to create a zigzag path
      placeToken(grid, 1, 2, {
        type: 'mirror',
        orientation: 0,
        state: 'idle',
      });

      placeToken(grid, 1, 1, {
        type: 'mirror',
        orientation: 90,
        state: 'idle',
      });

      const startPos = { x: 0, y: 2 };
      const direction = Orientation.EAST;

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.reflectionPoints).toHaveLength(2);
      expect(path.positions.length).toBeGreaterThan(3);

      // Verify zigzag pattern
      expect(path.positions).toContainEqual({ x: 0, y: 2 }); // start
      expect(path.positions).toContainEqual({ x: 1, y: 2 }); // first mirror
      expect(path.positions).toContainEqual({ x: 1, y: 1 }); // second mirror
      expect(path.positions).toContainEqual({ x: 2, y: 1 }); // after second reflection
    });
  });
});
