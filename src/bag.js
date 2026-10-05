import { PIECE_TYPES } from './config.js';

function shuffle(items, rng) {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export class Bag {
  constructor(rng = Math.random) {
    this.rng = rng;
    this.queue = [];
  }

  refill() {
    this.queue = shuffle(PIECE_TYPES, this.rng);
  }

  next() {
    if (this.queue.length === 0) {
      this.refill();
    }
    return this.queue.shift();
  }
}
