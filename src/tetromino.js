import { SHAPES, COLORS } from './config.js';

function cloneMatrix(matrix) {
  return matrix.map((row) => row.slice());
}

export function rotateMatrix(matrix, clockwise = true) {
  const size = matrix.length;
  const result = matrix.map((row) => row.slice());
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (clockwise) {
        result[c][size - 1 - r] = matrix[r][c];
      } else {
        result[size - 1 - c][r] = matrix[r][c];
      }
    }
  }
  return result;
}

export function createPiece(type) {
  const shape = SHAPES[type];
  if (!shape) {
    throw new Error(`Unknown tetromino type: ${type}`);
  }
  return {
    type,
    matrix: cloneMatrix(shape),
    color: COLORS[type]
  };
}

export function pieceCells(piece, originRow, originCol) {
  const cells = [];
  for (let r = 0; r < piece.matrix.length; r += 1) {
    for (let c = 0; c < piece.matrix[r].length; c += 1) {
      if (piece.matrix[r][c]) {
        cells.push([originRow + r, originCol + c]);
      }
    }
  }
  return cells;
}

export function rotatedMatrix(piece) {
  return rotateMatrix(piece.matrix, true);
}
