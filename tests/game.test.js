import { describe, it, expect } from 'vitest';
import { COLS, ROWS } from '../src/config.js';
import { Game } from '../src/game.js';
import { pieceCells } from '../src/tetromino.js';

describe('Game 集成流程', () => {
  it('reset 后处于运行态且棋盘为空', () => {
    const game = new Game();
    game.reset();
    expect(game.store.status).toBe('running');
    expect(game.current).not.toBeNull();
    expect(game.board.flat().every((cell) => cell === null)).toBe(true);
  });

  it('左右移动改变列坐标', () => {
    const game = new Game();
    game.reset();
    const before = game.originCol;
    if (game.move(1)) expect(game.originCol).toBe(before + 1);
    if (game.move(-1)) expect(game.originCol).toBeLessThanOrEqual(before + 1);
  });

  it('硬降落底并锁定后生成新方块', () => {
    const game = new Game();
    game.reset();
    const first = game.current;
    game.hardDrop();
    expect(game.current).not.toBe(first);
    const filled = game.board.flat().filter((cell) => cell !== null).length;
    expect(filled).toBeGreaterThan(0);
  });

  it('硬降按距离计分', () => {
    const game = new Game();
    game.reset();
    game.hardDrop();
    expect(game.store.score).toBeGreaterThan(0);
  });

  it('软降在可移动时计分', () => {
    const game = new Game();
    game.reset();
    const ok = game.softDrop();
    if (ok) expect(game.store.score).toBeGreaterThanOrEqual(1);
  });

  it('消行后行数与等级正确', () => {
    const game = new Game();
    game.reset();
    for (let c = 0; c < COLS - 1; c += 1) {
      game.board[ROWS - 1][c] = '#fff';
    }
    game.current = null;
    game.board[ROWS - 1][COLS - 1] = null;
    game.current = { type: 'O', matrix: [[1]], color: '#fff' };
    game.originRow = ROWS - 1;
    game.originCol = COLS - 1;
    game.lock();
    expect(game.store.lines).toBe(1);
    expect(game.store.score).toBeGreaterThanOrEqual(100);
  });

  it('暂停与恢复状态机', () => {
    const game = new Game();
    game.reset();
    expect(game.handleAction('pause')).toBe(true);
    expect(game.store.status).toBe('paused');
    game.handleAction('pause');
    expect(game.store.status).toBe('running');
  });

  it('暂停时移动无效', () => {
    const game = new Game();
    game.reset();
    game.handleAction('pause');
    expect(game.move(1)).toBe(false);
  });

  it('restart 复位棋盘与分数', () => {
    const game = new Game();
    game.reset();
    game.hardDrop();
    game.handleAction('restart');
    expect(game.store.status).toBe('running');
    expect(game.store.score).toBe(0);
    expect(game.store.lines).toBe(0);
    expect(game.store.level).toBe(1);
    expect(game.board.flat().every((cell) => cell === null)).toBe(true);
  });

  it('出生即碰撞触发 gameover', () => {
    const game = new Game();
    game.reset();
    game.store.setStatus('running');
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        game.board[r][c] = '#fff';
      }
    }
    game.spawn();
    expect(game.store.status).toBe('gameover');
  });

  it('未知动作返回 false', () => {
    const game = new Game();
    game.reset();
    expect(game.handleAction('nope')).toBe(false);
  });

  it('tick 触发自然下落', () => {
    const game = new Game();
    game.reset();
    game.store.level = 1;
    const before = game.originRow;
    game.tick(1000);
    expect(game.originRow).toBeGreaterThan(before);
  });

  it('pieceCells 坐标契约', () => {
    const game = new Game();
    game.reset();
    const cells = pieceCells(game.current, game.originRow, game.originCol);
    for (const [, c] of cells) {
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThan(COLS);
    }  });
});
