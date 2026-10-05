import { GRAVITY_TABLE, MIN_GRAVITY, COLS } from './config.js';
import { createBoard, collide, merge, clearLines, tryRotate, dropDistance } from './board.js';
import { Bag } from './bag.js';
import { createPiece, pieceCells } from './tetromino.js';
import { Store } from './store.js';

export class Game {
  constructor() {
    this.bag = new Bag();
    this.store = new Store();
    this.board = createBoard();
    this.current = null;
    this.nextType = null;
    this.originRow = 0;
    this.originCol = 0;
    this.dropAccumulator = 0;
    this.lastTimestamp = 0;
  }

  spawnPosition(piece) {
    const width = piece.matrix[0].length;
    return {
      row: 0,
      col: Math.floor((COLS - width) / 2)
    };
  }

  spawn() {
    const type = this.nextType || this.bag.next();
    this.nextType = this.bag.next();
    const piece = createPiece(type);
    const pos = this.spawnPosition(piece);
    this.current = piece;
    this.originRow = pos.row;
    this.originCol = pos.col;
    if (collide(this.board, pieceCells(piece, this.originRow, this.originCol))) {
      this.current = piece;
      this.store.setStatus('gameover');
      return false;
    }
    return true;
  }

  reset() {
    this.board = createBoard();
    this.bag = new Bag();
    this.store.reset();
    this.nextType = null;
    this.dropAccumulator = 0;
    this.lastTimestamp = 0;
    this.spawn();
  }

  gravityInterval() {
    const level = this.store.level;
    return Math.max(MIN_GRAVITY, GRAVITY_TABLE[level] || MIN_GRAVITY);
  }

  move(dx) {
    if (this.store.status !== 'running' || !this.current) return false;
    const cells = pieceCells(this.current, this.originRow, this.originCol + dx);
    if (!collide(this.board, cells)) {
      this.originCol += dx;
      return true;
    }
    return false;
  }

  rotate() {
    if (this.store.status !== 'running' || !this.current) return false;
    const result = tryRotate(this.board, this.current, this.originRow, this.originCol);
    if (result) {
      this.current = result.piece;
      this.originCol = result.col;
      return true;
    }
    return false;
  }

  softDrop() {
    if (this.store.status !== 'running' || !this.current) return false;
    const cells = pieceCells(this.current, this.originRow + 1, this.originCol);
    if (!collide(this.board, cells)) {
      this.originRow += 1;
      this.store.addDropPoints(1);
      return true;
    }
    this.lock();
    return false;
  }

  hardDrop() {
    if (this.store.status !== 'running' || !this.current) return false;
    const distance = dropDistance(this.board, this.current, this.originRow, this.originCol);
    this.originRow += distance;
    this.store.addDropPoints(distance * 2);
    this.lock();
    return true;
  }

  lock() {
    merge(this.board, this.current, this.originRow, this.originCol);
    const cleared = clearLines(this.board);
    this.store.applyLineClear(cleared);
    this.dropAccumulator = 0;
    this.spawn();
  }

  tick(delta) {
    if (this.store.status !== 'running' || !this.current) return;
    this.dropAccumulator += delta;
    const interval = this.gravityInterval();
    while (this.dropAccumulator >= interval) {
      this.dropAccumulator -= interval;
      const cells = pieceCells(this.current, this.originRow + 1, this.originCol);
      if (!collide(this.board, cells)) {
        this.originRow += 1;
      } else {
        this.lock();
        break;
      }
    }
  }

  togglePause() {
    if (this.store.status === 'running') {
      this.store.setStatus('paused');
    } else if (this.store.status === 'paused') {
      this.store.setStatus('running');
    }
  }

  handleAction(action) {
    switch (action) {
      case 'left':
        return this.move(-1);
      case 'right':
        return this.move(1);
      case 'rotate':
        return this.rotate();
      case 'softDrop':
        return this.softDrop();
      case 'hardDrop':
        return this.hardDrop();
      case 'pause':
        this.togglePause();
        return true;
      case 'restart':
        this.reset();
        return true;
      default:
        return false;
    }
  }
}
