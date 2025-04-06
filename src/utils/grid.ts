export type TokenType = 'laser' | 'mirror' | 'target';
export type TokenState = 'idle' | 'active' | 'hit';

export type Token = {
  type: TokenType;
  orientation: 0 | 90 | 180 | 270;
  state: TokenState;
};

export type Cell = {
  token: Token | null;
};

export type Grid = Cell[][];

/**
 * Creates a 5x5 empty grid
 */
export function createGrid(): Grid {
  const grid: Grid = Array(5)
    .fill(null)
    .map(() =>
      Array(5)
        .fill(null)
        .map(() => ({ token: null }))
    );
  return grid;
}

/**
 * Places a token at the specified coordinates
 * @throws {Error} if coordinates are invalid
 */
export function placeToken(grid: Grid, x: number, y: number, token: Token): Grid {
  if (x < 0 || x >= 5 || y < 0 || y >= 5) {
    throw new Error('Invalid coordinates');
  }

  const newGrid: Grid = grid.map((row) =>
    row.map((cell) => ({ ...cell, token: token ? { ...token } : null }))
  );
  newGrid[y][x] = { token };
  return newGrid;
}

/**
 * Removes a token from the specified coordinates
 */
export function removeToken(grid: Grid, x: number, y: number): Grid {
  if (x < 0 || x >= 5 || y < 0 || y >= 5) {
    throw new Error('Invalid coordinates');
  }

  const newGrid = grid.map((row) => [...row]);
  newGrid[y][x] = { token: null };
  return newGrid;
}

/**
 * Rotates a token at the specified coordinates
 * @throws {Error} if no token exists at coordinates
 */
export function rotateToken(grid: Grid, x: number, y: number, angle: number): Grid {
  if (x < 0 || x >= 5 || y < 0 || y >= 5) {
    throw new Error('Invalid coordinates');
  }

  const cell = grid[y][x];
  if (!cell.token) {
    throw new Error('No token at specified coordinates');
  }

  const newGrid = grid.map((row) =>
    row.map((cell) => ({ ...cell, token: cell.token ? { ...cell.token } : null }))
  );
  const normalizedAngle = (((cell.token.orientation + angle) % 360) + 360) % 360;

  newGrid[y][x] = {
    token: {
      ...cell.token,
      orientation: normalizedAngle as 0 | 90 | 180 | 270,
    },
  };
  return newGrid;
}
