/***********************************************
 * FILE: src/utils/__tests__/mirrorReflection.test.ts
 * CREATED: 2025-04-03 15:12:28
 *
 * PURPOSE:
 * Test suite for laser beam reflection off mirrors. Verifies correct
 * angle calculations and path continuation after reflection for
 * different mirror orientations and incoming beam directions.
 *
 * TESTS:
 * - Reflection off forward-slash mirror (/)
 * - Reflection off back-slash mirror (\)
 * - Path continuation after reflection
 * - Boundary cases for mirrors
 *****************/

import { LaserPhysics } from '../laserPhysics';
import { createGrid, placeToken } from '../grid';
import type { Position } from '../../types/tokens';
import { Orientation } from '../../types/tokens';
import type { Token } from '../grid'; // Import the Token type

describe('LaserPhysics - Mirror Reflection', () => {
  let physics: LaserPhysics;

  beforeEach(() => {
    physics = new LaserPhysics();
  });

  // Helper function to create a mirror token
  const createMirror = (orientation: 0 | 90 | 180 | 270): Token => ({
    type: 'mirror',
    orientation: orientation, // 0 or 180 for '/', 90 or 270 for '\'
    state: 'idle',
  });

  describe('Forward Slash Mirror (/) Orientation 0 or 180', () => {
    const mirrorOrientation = 0; // Represents '/'

    it('should reflect incoming EAST beam to NORTH', () => {
      let grid = createGrid();
      const mirrorPos: Position = { x: 2, y: 2 };
      grid = placeToken(grid, mirrorPos.x, mirrorPos.y, createMirror(mirrorOrientation));
      const startPos: Position = { x: 0, y: 2 };
      const direction = Orientation.EAST;

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.reflectionPoints).toHaveLength(1);
      expect(path.reflectionPoints[0]).toMatchObject({
        incomingDirection: Orientation.EAST,
        outgoingDirection: Orientation.NORTH,
      });
      // Check path continues North
      expect(path.positions).toEqual([
        { x: 0, y: 2 },
        { x: 1, y: 2 }, // To mirror
        { x: 1, y: 1 }, // Reflection point
        { x: 2, y: 1 },
        { x: 2, y: 0 },
        { x: 3, y: 0 }, // After reflection North
      ]);
    });

    it('should reflect incoming WEST beam to SOUTH', () => {
      let grid = createGrid();
      const mirrorPos: Position = { x: 2, y: 2 };
      grid = placeToken(grid, mirrorPos.x, mirrorPos.y, createMirror(mirrorOrientation));
      const startPos: Position = { x: 4, y: 2 };
      const direction = Orientation.WEST;

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.reflectionPoints).toHaveLength(1);
      expect(path.reflectionPoints[0]).toMatchObject({
        incomingDirection: Orientation.WEST,
        outgoingDirection: Orientation.SOUTH,
      });
      expect(path.positions).toEqual([
        { x: 4, y: 2 },
        { x: 3, y: 2 }, // To mirror
        { x: 3, y: 3 }, // Reflection point
        { x: 2, y: 3 },
        { x: 2, y: 4 },
        { x: 1, y: 4 }, // After reflection South
      ]);
    });

    it('should reflect incoming NORTH beam to EAST', () => {
      let grid = createGrid();
      const mirrorPos: Position = { x: 2, y: 2 };
      grid = placeToken(grid, mirrorPos.x, mirrorPos.y, createMirror(mirrorOrientation));
      const startPos: Position = { x: 2, y: 4 };
      const direction = Orientation.NORTH;

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.reflectionPoints).toHaveLength(1);
      expect(path.reflectionPoints[0]).toMatchObject({
        incomingDirection: Orientation.NORTH,
        outgoingDirection: Orientation.EAST,
      });
      expect(path.positions).toEqual([
        { x: 2, y: 4 },
        { x: 2, y: 3 }, // To mirror
        { x: 3, y: 3 }, // Reflection point
        { x: 3, y: 2 },
        { x: 4, y: 2 },
        { x: 4, y: 1 }, // After reflection East
      ]);
    });

    it('should reflect incoming SOUTH beam to WEST', () => {
      let grid = createGrid();
      const mirrorPos: Position = { x: 2, y: 2 };
      grid = placeToken(grid, mirrorPos.x, mirrorPos.y, createMirror(mirrorOrientation));
      const startPos: Position = { x: 2, y: 0 };
      const direction = Orientation.SOUTH;

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.reflectionPoints).toHaveLength(1);
      expect(path.reflectionPoints[0]).toMatchObject({
        incomingDirection: Orientation.SOUTH,
        outgoingDirection: Orientation.WEST,
      });
      expect(path.positions).toEqual([
        { x: 2, y: 0 },
        { x: 2, y: 1 }, // To mirror
        { x: 1, y: 1 }, // Reflection point
        { x: 1, y: 2 },
        { x: 0, y: 2 },
        { x: 0, y: 3 }, // After reflection West
      ]);
    });
  });

  describe('Back Slash Mirror () Orientation 90 or 270', () => {
    const mirrorOrientation = 90; // Represents '\'

    it('should reflect incoming EAST beam to SOUTH', () => {
      let grid = createGrid();
      const mirrorPos: Position = { x: 2, y: 2 };
      grid = placeToken(grid, mirrorPos.x, mirrorPos.y, createMirror(mirrorOrientation));
      const startPos: Position = { x: 0, y: 2 };
      const direction = Orientation.EAST;

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.reflectionPoints).toHaveLength(1);
      expect(path.reflectionPoints[0]).toMatchObject({
        incomingDirection: Orientation.EAST,
        outgoingDirection: Orientation.SOUTH,
      });
      expect(path.positions).toEqual([
        { x: 0, y: 2 },
        { x: 1, y: 2 }, // To mirror
        { x: 1, y: 3 }, // Reflection point
        { x: 2, y: 3 },
        { x: 2, y: 4 },
        { x: 3, y: 4 }, // After reflection South
      ]);
    });

    it('should reflect incoming WEST beam to NORTH', () => {
      let grid = createGrid();
      const mirrorPos: Position = { x: 2, y: 2 };
      grid = placeToken(grid, mirrorPos.x, mirrorPos.y, createMirror(mirrorOrientation));
      const startPos: Position = { x: 4, y: 2 };
      const direction = Orientation.WEST;

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.reflectionPoints).toHaveLength(1);
      expect(path.reflectionPoints[0]).toMatchObject({
        incomingDirection: Orientation.WEST,
        outgoingDirection: Orientation.NORTH,
      });
      expect(path.positions).toEqual([
        { x: 4, y: 2 },
        { x: 3, y: 2 }, // To mirror
        { x: 3, y: 1 }, // Reflection point
        { x: 2, y: 1 },
        { x: 2, y: 0 },
        { x: 1, y: 0 }, // After reflection North
      ]);
    });

    it('should reflect incoming NORTH beam to WEST', () => {
      let grid = createGrid();
      const mirrorPos: Position = { x: 2, y: 2 };
      grid = placeToken(grid, mirrorPos.x, mirrorPos.y, createMirror(mirrorOrientation));
      const startPos: Position = { x: 2, y: 4 };
      const direction = Orientation.NORTH;

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.reflectionPoints).toHaveLength(1);
      expect(path.reflectionPoints[0]).toMatchObject({
        incomingDirection: Orientation.NORTH,
        outgoingDirection: Orientation.WEST,
      });
      expect(path.positions).toEqual([
        { x: 2, y: 4 },
        { x: 2, y: 3 }, // To mirror
        { x: 2, y: 2 }, // Mirror
        { x: 1, y: 2 },
        { x: 0, y: 2 }, // Beam stops at west boundary
      ]);
    });

    it('should reflect incoming SOUTH beam to EAST', () => {
      let grid = createGrid();
      const mirrorPos: Position = { x: 2, y: 2 };
      grid = placeToken(grid, mirrorPos.x, mirrorPos.y, createMirror(mirrorOrientation));
      const startPos: Position = { x: 2, y: 0 };
      const direction = Orientation.SOUTH;

      const path = physics.calculateBeamPath(grid, startPos, direction);

      expect(path.reflectionPoints).toHaveLength(1);
      expect(path.reflectionPoints[0]).toMatchObject({
        incomingDirection: Orientation.SOUTH,
        outgoingDirection: Orientation.EAST,
      });
      expect(path.positions).toEqual([
        { x: 2, y: 0 },
        { x: 2, y: 1 }, // To mirror
        { x: 2, y: 2 }, // Mirror
        { x: 3, y: 2 },
        { x: 4, y: 2 }, // After reflection East
      ]);
    });
  });

  // Add tests for mirrors on boundaries if needed
});
