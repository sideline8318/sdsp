import { COLS, ROWS } from './config.js';
import { pieceCells, rotatedMatrix } from './tetromino.js';

export function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

export function collide(board, cells) {
  for (const [row, col] of cells) {
    if (col < 0 || col >= COLS) return true;
    if (row >= ROWS) return true;
    if (row >= 0 && board[row][col] !== null) return true;
  }
  return false;
}

export function merge(board, piece, originRow, originCol) {
  for (const [row, col] of pieceCells(piece, originRow, originCol)) {
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      board[row][col] = piece.color;
    }
  }
  return board;
}

export function clearLines(board) {
  let cleared = 0;
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (board[row].every((cell) => cell !== null)) {
      board.splice(row, 1);
      board.unshift(Array(COLS).fill(null));
      cleared += 1;
      row += 1;
    }
  }
  return cleared;
}

const KICK_OFFSETS = [0, -1, 1, -2, 2];

export function tryRotate(board, piece, originRow, originCol) {
  const matrix = rotatedMatrix(piece);
  const candidate = { ...piece, matrix };
  for (const offset of KICK_OFFSETS) {
    const cells = pieceCells(candidate, originRow, originCol + offset);
    if (!collide(board, cells)) {
      return { piece: candidate, col: originCol + offset };
    }
  }
  return null;
}

export function dropDistance(board, piece, originRow, originCol) {
  let distance = 0;
  while (!collide(board, pieceCells(piece, originRow + distance + 1, originCol))) {
    distance += 1;
  }
  return distance;
}
