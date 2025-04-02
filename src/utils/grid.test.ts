import { describe, test, expect } from 'vitest';
import { createGrid, placeToken, removeToken, rotateToken } from './grid';
import type { Token } from './grid';

describe('Grid System', () => {
  describe('Grid Creation', () => {
    test('should create a 5x5 empty grid', () => {
      const grid = createGrid();
      expect(grid.length).toBe(5);
      grid.forEach((row) => {
        expect(row.length).toBe(5);
        row.forEach((cell) => {
          expect(cell.token).toBeNull();
        });
      });
    });

    test('each cell should be a unique object', () => {
      const grid = createGrid();
      const cells = grid.flat();
      const uniqueCells = new Set(cells);
      expect(uniqueCells.size).toBe(25);
    });
  });

  describe('Token Placement', () => {
    test('should place a token at specified coordinates', () => {
      const grid = createGrid();
      const token: Token = {
        type: 'mirror',
        orientation: 0,
        state: 'idle',
      };

      const updatedGrid = placeToken(grid, 2, 3, token);
      expect(updatedGrid[3][2].token).toEqual(token);
    });

    test('should not mutate original grid when placing token', () => {
      const grid = createGrid();
      const token: Token = {
        type: 'mirror',
        orientation: 0,
        state: 'idle',
      };

      const originalGrid = JSON.parse(JSON.stringify(grid));
      const updatedGrid = placeToken(grid, 2, 3, token);
      expect(grid).toEqual(originalGrid);
      expect(updatedGrid).not.toEqual(originalGrid);
    });

    test('should throw error when placing token outside grid bounds', () => {
      const grid = createGrid();
      const token: Token = {
        type: 'mirror',
        orientation: 0,
        state: 'idle',
      };

      expect(() => placeToken(grid, 5, 3, token)).toThrow('Invalid coordinates');
      expect(() => placeToken(grid, 2, 5, token)).toThrow('Invalid coordinates');
      expect(() => placeToken(grid, -1, 3, token)).toThrow('Invalid coordinates');
      expect(() => placeToken(grid, 2, -1, token)).toThrow('Invalid coordinates');
    });
  });

  describe('Token Removal', () => {
    test('should remove token from specified coordinates', () => {
      const grid = createGrid();
      const token: Token = {
        type: 'mirror',
        orientation: 0,
        state: 'idle',
      };

      const gridWithToken = placeToken(grid, 2, 3, token);
      const updatedGrid = removeToken(gridWithToken, 2, 3);
      expect(updatedGrid[3][2].token).toBeNull();
    });

    test('should not mutate original grid when removing token', () => {
      const grid = createGrid();
      const token: Token = {
        type: 'mirror',
        orientation: 0,
        state: 'idle',
      };

      const gridWithToken = placeToken(grid, 2, 3, token);
      const originalGrid = JSON.parse(JSON.stringify(gridWithToken));
      const updatedGrid = removeToken(gridWithToken, 2, 3);
      expect(gridWithToken).toEqual(originalGrid);
      expect(updatedGrid).not.toEqual(originalGrid);
    });

    test('should handle removing from empty cell', () => {
      const grid = createGrid();
      const updatedGrid = removeToken(grid, 2, 3);
      expect(updatedGrid[3][2].token).toBeNull();
    });

    test('should throw error when removing from invalid coordinates', () => {
      const grid = createGrid();
      expect(() => removeToken(grid, 5, 3)).toThrow('Invalid coordinates');
      expect(() => removeToken(grid, -1, 3)).toThrow('Invalid coordinates');
    });
  });

  describe('Token Rotation', () => {
    test('should rotate token by specified angle', () => {
      const grid = createGrid();
      const token: Token = {
        type: 'mirror',
        orientation: 0,
        state: 'idle',
      };

      const gridWithToken = placeToken(grid, 2, 3, token);
      const updatedGrid = rotateToken(gridWithToken, 2, 3, 90);
      expect(updatedGrid[3][2].token?.orientation).toBe(90);
    });

    test('should normalize rotation angles to 0, 90, 180, or 270', () => {
      const grid = createGrid();
      const token: Token = {
        type: 'mirror',
        orientation: 0,
        state: 'idle',
      };

      const gridWithToken = placeToken(grid, 2, 3, token);
      let result = rotateToken(gridWithToken, 2, 3, 450);
      expect(result[3][2].token?.orientation).toBe(90);

      result = rotateToken(gridWithToken, 2, 3, -90);
      expect(result[3][2].token?.orientation).toBe(270);

      result = rotateToken(gridWithToken, 2, 3, 720);
      expect(result[3][2].token?.orientation).toBe(0);
    });

    test('should maintain token state and type when rotating', () => {
      const grid = createGrid();
      const token: Token = {
        type: 'mirror',
        orientation: 0,
        state: 'active',
      };

      const gridWithToken = placeToken(grid, 2, 3, token);
      const updatedGrid = rotateToken(gridWithToken, 2, 3, 90);
      expect(updatedGrid[3][2].token?.type).toBe('mirror');
      expect(updatedGrid[3][2].token?.state).toBe('active');
    });

    test('should throw error when rotating non-existent token', () => {
      const grid = createGrid();
      expect(() => rotateToken(grid, 2, 3, 90)).toThrow('No token at specified coordinates');
    });

    test('should throw error when rotating with invalid coordinates', () => {
      const grid = createGrid();
      expect(() => rotateToken(grid, 5, 3, 90)).toThrow('Invalid coordinates');
      expect(() => rotateToken(grid, -1, 3, 90)).toThrow('Invalid coordinates');
    });
  });
});
