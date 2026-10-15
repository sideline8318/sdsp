import { describe, it, expect } from 'vitest';
import { PIECE_TYPES } from '../src/config.js';
import { Bag } from '../src/bag.js';
import { createPiece, rotateMatrix } from '../src/tetromino.js';
import { Store } from '../src/store.js';

describe('Bag 7-bag 随机化', () => {
  it('每 7 次取满全部 7 种方块', () => {
    const bag = new Bag();
    const first = [];
    for (let i = 0; i < 7; i += 1) first.push(bag.next());
    expect(new Set(first).size).toBe(7);
    expect(first.slice().sort()).toEqual(PIECE_TYPES.slice().sort());
  });

  it('两袋各含全集', () => {
    const bag = new Bag(() => 0.5);
    const draws = [];
    for (let i = 0; i < 14; i += 1) draws.push(bag.next());
    expect(new Set(draws.slice(0, 7)).size).toBe(7);
    expect(new Set(draws.slice(7, 14)).size).toBe(7);
  });
});

describe('tetromino 创建与旋转', () => {
  it('7 种方块均可创建并带颜色', () => {
    for (const type of PIECE_TYPES) {
      const piece = createPiece(type);
      expect(piece.type).toBe(type);
      expect(typeof piece.color).toBe('string');
      expect(piece.matrix.length).toBeGreaterThan(0);
    }
  });

  it('未知类型抛错', () => {
    expect(() => createPiece('X')).toThrow();
  });

  it('矩阵顺时针旋转', () => {
    const matrix = [
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    const rotated = rotateMatrix(matrix, true);
    expect(rotated[0][2]).toBe(1);
  });
});

describe('Store 计分与等级', () => {
  it('初始状态正确', () => {
    const store = new Store();
    expect(store.snapshot()).toEqual({ score: 0, lines: 0, level: 1, status: 'running' });
  });

  it('消行计分按等级放大', () => {
    const store = new Store();
    expect(store.applyLineClear(1)).toBe(100);
    expect(store.score).toBe(100);
    expect(store.lines).toBe(1);
  });

  it('等级随行数提升', () => {
    const store = new Store();
    for (let i = 0; i < 10; i += 1) store.applyLineClear(1);
    expect(store.lines).toBe(10);
    expect(store.level).toBe(2);
  });

  it('四行消计分 800', () => {
    const store = new Store();
    expect(store.applyLineClear(4)).toBe(800);
  });

  it('状态可切换', () => {
    const store = new Store();
    store.setStatus('paused');
    expect(store.snapshot().status).toBe('paused');
  });
});
