import { LINE_SCORES, LINES_PER_LEVEL } from './config.js';

export class Store {
  constructor() {
    this.reset();
  }

  reset() {
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.status = 'running';
  }

  addDropPoints(cells) {
    this.score += cells;
  }

  applyLineClear(clearedRows) {
    if (clearedRows <= 0) return 0;
    const gained = (LINE_SCORES[clearedRows] || 0) * this.level;
    this.score += gained;
    this.lines += clearedRows;
    this.level = Math.floor(this.lines / LINES_PER_LEVEL) + 1;
    return gained;
  }

  setStatus(status) {
    this.status = status;
  }

  snapshot() {
    return {
      score: this.score,
      lines: this.lines,
      level: this.level,
      status: this.status
    };
  }
}
