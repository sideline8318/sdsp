import { APP_VERSION, APP_COMMIT } from './config.js';
import { Game } from './game.js';
import { Renderer } from './renderer.js';
import { bindInput } from './input.js';
import { createPiece } from './tetromino.js';

function init() {
  const boardCanvas = document.getElementById('board');
  const nextCanvas = document.getElementById('next');
  const overlay = document.getElementById('overlay');
  const overlayText = document.getElementById('overlay-text');
  const restartBtn = document.getElementById('restart-btn');
  const scoreEl = document.getElementById('score');
  const linesEl = document.getElementById('lines');
  const levelEl = document.getElementById('level');
  const versionEl = document.getElementById('version');

  const renderer = new Renderer(boardCanvas, nextCanvas);
  const game = new Game();
  game.reset();

  versionEl.textContent = `v${APP_VERSION} (${APP_COMMIT})`;
  window.__APP_VERSION__ = APP_VERSION;

  function syncHud() {
    const state = game.store.snapshot();
    scoreEl.textContent = String(state.score);
    linesEl.textContent = String(state.lines);
    levelEl.textContent = String(state.level);

    if (state.status === 'gameover') {
      overlay.classList.remove('hidden');
      overlayText.textContent = '游戏结束';
    } else if (state.status === 'paused') {
      overlay.classList.remove('hidden');
      overlayText.textContent = '已暂停';
    } else {
      overlay.classList.add('hidden');
    }
  }

  function draw() {
    renderer.render(game.board, game.current, game.originRow, game.originCol);
    renderer.renderNext(game.nextType ? createPiece(game.nextType) : null);
    syncHud();
  }

  function loop(timestamp) {
    if (!game.lastTimestamp) game.lastTimestamp = timestamp;
    const delta = timestamp - game.lastTimestamp;
    game.lastTimestamp = timestamp;
    game.tick(delta);
    draw();
    requestAnimationFrame(loop);
  }

  bindInput(window, (action) => {
    game.handleAction(action);
    draw();
  });

  restartBtn.addEventListener('click', () => {
    game.handleAction('restart');
    draw();
  });

  draw();
  requestAnimationFrame(loop);

  window.__TETRIS__ = {
    game,
    draw,
    action: (name) => {
      const result = game.handleAction(name);
      draw();
      return result;
    },
    getBoard: () => game.board,
    getState: () => game.store.snapshot(),
    reset: () => {
      game.reset();
      draw();
    }
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
