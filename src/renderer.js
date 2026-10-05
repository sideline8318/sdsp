import { COLS, ROWS, CELL } from './config.js';

export class Renderer {
  constructor(boardCanvas, nextCanvas) {
    this.canvas = boardCanvas;
    this.ctx = boardCanvas.getContext('2d');
    this.nextCanvas = nextCanvas;
    this.nextCtx = nextCanvas.getContext('2d');
  }

  clear() {
    this.ctx.fillStyle = '#0b0e15';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
  }

  drawGrid() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;
    for (let c = 1; c < COLS; c += 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(c * CELL, 0);
      this.ctx.lineTo(c * CELL, ROWS * CELL);
      this.ctx.stroke();
    }
    for (let r = 1; r < ROWS; r += 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, r * CELL);
      this.ctx.lineTo(COLS * CELL, r * CELL);
      this.ctx.stroke();
    }
  }

  drawCell(ctx, row, col, color) {
    ctx.fillStyle = color;
    ctx.fillRect(col * CELL + 1, row * CELL + 1, CELL - 2, CELL - 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.fillRect(col * CELL + 1, row * CELL + 1, CELL - 2, 4);
  }

  render(board, piece, originRow, originCol) {
    this.clear();
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        if (board[r][c]) {
          this.drawCell(this.ctx, r, c, board[r][c]);
        }
      }
    }
    if (piece) {
      const matrix = piece.matrix;
      for (let r = 0; r < matrix.length; r += 1) {
        for (let c = 0; c < matrix[r].length; c += 1) {
          if (matrix[r][c]) {
            const row = originRow + r;
            const col = originCol + c;
            if (row >= 0) {
              this.drawCell(this.ctx, row, col, piece.color);
            }
          }
        }
      }
    }
  }

  renderNext(piece) {
    const ctx = this.nextCtx;
    ctx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
    if (!piece) return;
    const matrix = piece.matrix;
    const cell = 24;
    let minR = Infinity;
    let maxR = -Infinity;
    let minC = Infinity;
    let maxC = -Infinity;
    for (let r = 0; r < matrix.length; r += 1) {
      for (let c = 0; c < matrix[r].length; c += 1) {
        if (matrix[r][c]) {
          minR = Math.min(minR, r);
          maxR = Math.max(maxR, r);
          minC = Math.min(minC, c);
          maxC = Math.max(maxC, c);
        }
      }
    }
    const width = (maxC - minC + 1) * cell;
    const height = (maxR - minR + 1) * cell;
    const offsetX = (this.nextCanvas.width - width) / 2;
    const offsetY = (this.nextCanvas.height - height) / 2;
    for (let r = 0; r < matrix.length; r += 1) {
      for (let c = 0; c < matrix[r].length; c += 1) {
        if (matrix[r][c]) {
          ctx.fillStyle = piece.color;
          ctx.fillRect(
            offsetX + (c - minC) * cell + 1,
            offsetY + (r - minR) * cell + 1,
            cell - 2,
            cell - 2
          );
        }
      }
    }
  }
}
