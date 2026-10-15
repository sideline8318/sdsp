import { describe, it, expect } from 'vitest';
import { COLS, ROWS } from '../src/config.js';
import {
  createBoard,
  collide,
  merge,
  clearLines,
  tryRotate,
  dropDistance
} from '../src/board.js';
import { createPiece, pieceCells } from '../src/tetromino.js';

describe('board 初始化', () => {
  it('创建 20x10 空棋盘', () => {
    const board = createBoard();
    expect(board.length).toBe(ROWS);
    expect(board.every((row) => row.length === COLS)).toBe(true);
    expect(board.flat().every((cell) => cell === null)).toBe(true);
  });
});

describe('collide 碰撞边界', () => {
  const board = createBoard();

  it('越左/越右/越底冲突，顶部允许', () => {
    expect(collide(board, [[0, -1]])).toBe(true);
    expect(collide(board, [[0, COLS]])).toBe(true);
    expect(collide(board, [[ROWS, 0]])).toBe(true);
    expect(collide(board, [[-1, 0]])).toBe(false);
  });

  it('已占用格冲突', () => {
    const filled = createBoard();
    filled[5][5] = '#fff';
    expect(collide(filled, [[5, 5]])).toBe(true);
    expect(collide(filled, [[4, 4]])).toBe(false);
  });
});

describe('merge 锁定', () => {
  it('将方块写入棋盘并保留颜色', () => {
    const board = createBoard();
    const piece = createPiece('O');
    merge(board, piece, 0, 0);
    expect(board[0][0]).toBe(piece.color);
    expect(board[0][1]).toBe(piece.color);
    expect(board[1][0]).toBe(piece.color);
    expect(board[1][1]).toBe(piece.color);
  });
});

describe('clearLines 消行', () => {
  it('消除满行并在顶部补空行', () => {
    const board = createBoard();
    board[ROWS - 1] = Array(COLS).fill('#fff');
    const cleared = clearLines(board);
    expect(cleared).toBe(1);
    expect(board.length).toBe(ROWS);
    expect(board[0].every((cell) => cell === null)).toBe(true);
  });

  it('未满行不消除', () => {
    const board = createBoard();
    board[ROWS - 1][0] = '#fff';
    expect(clearLines(board)).toBe(0);
  });

  it('一次消除多行', () => {
    const board = createBoard();
    board[ROWS - 1] = Array(COLS).fill('#fff');
    board[ROWS - 2] = Array(COLS).fill('#fff');
    expect(clearLines(board)).toBe(2);
  });
});

describe('tryRotate 旋转与踢墙', () => {
  it('空旷场地旋转成功', () => {
    const board = createBoard();
    const piece = createPiece('T');
    const result = tryRotate(board, piece, 5, 5);
    expect(result).not.toBeNull();
    expect(result.piece.matrix).not.toEqual(piece.matrix);
  });

  it('边界处通过偏移成功旋转', () => {
    const board = createBoard();
    const piece = createPiece('I');
    const result = tryRotate(board, piece, 1, -1);
    expect(result).not.toBeNull();
  });

  it('完全受限时拒绝旋转', () => {
    const board = createBoard();
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        board[r][c] = '#fff';
      }
    }
    const piece = createPiece('O');
    expect(tryRotate(board, piece, 0, 0)).toBeNull();
  });
});

describe('dropDistance 硬降距离', () => {
  it('空场地落到底部', () => {
    const board = createBoard();
    const piece = createPiece('O');
    const cells = pieceCells(piece, 0, 0);
    const distance = dropDistance(board, piece, 0, 0);
    expect(collide(board, cells.map(([r, c]) => [r + distance + 1, c]))).toBe(true);
  });
});
