export const COLS = 10;
export const ROWS = 20;
export const CELL = 30;

export const EMPTY = null;

export const COLORS = {
  I: '#4fd8ff',
  O: '#f7d154',
  T: '#b072f0',
  S: '#5fd67a',
  Z: '#f0605f',
  J: '#4f8cff',
  L: '#f0a24f'
};

export const SHAPES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ]
};

export const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export const LINE_SCORES = [0, 100, 300, 500, 800];

export const LINES_PER_LEVEL = 10;

export const GRAVITY_TABLE = {
  1: 800,
  2: 720,
  3: 630,
  4: 550,
  5: 470,
  6: 380,
  7: 300,
  8: 220,
  9: 160,
  10: 120
};

export const MIN_GRAVITY = 80;

export const APP_VERSION = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '0.1.0';
export const APP_COMMIT = typeof __GIT_SHA__ === 'string' ? __GIT_SHA__ : 'dev';
