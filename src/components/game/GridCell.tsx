import React, { memo } from 'react';
import type { Cell, Token } from '../../utils/grid';

interface GridCellProps {
  cell: Cell;
  x: number;
  y: number;
  onTokenPlace?: (x: number, y: number, token: Token) => void;
  onTokenRemove?: (x: number, y: number) => void;
  onTokenRotate?: (x: number, y: number, angle: number) => void;
}

export const GridCell: React.FC<GridCellProps> = memo(
  ({
    cell,
    x,
    y,
    // onTokenPlace,
    // onTokenRotate,
    onTokenRemove,
  }) => {
    const handleClick = () => {
      if (cell.token && onTokenRemove) {
        onTokenRemove(x, y);
      }
    };

    return (
      <div
        className="grid-cell border border-gray-300 w-16 h-16 flex items-center justify-center cursor-pointer"
        onClick={handleClick}
        data-testid={`grid-cell-${x}-${y}`}
      >
        {cell.token && (
          <div
            className={`token ${cell.token.type} ${cell.token.state}`}
            style={{
              transform: `rotate(${cell.token.orientation}deg)`,
            }}
            data-testid={`token-${x}-${y}`}
          >
            {/* Token content will be styled based on type */}
            {cell.token.type === 'laser' && '→'}
            {cell.token.type === 'mirror' && '╱'}
            {cell.token.type === 'target' && '◎'}
          </div>
        )}
      </div>
    );
  }
);

GridCell.displayName = 'GridCell';
