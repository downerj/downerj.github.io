import { isNil } from './utils.js';

export class Loop {
  #interval;
  #callback;
  #handle = null;
  #previous = 0;

  constructor(callback, interval) {
    this.#callback = callback;
    this.#interval = interval;
  }

  resume() {
    if (!isNil(this.#handle)) {
      return;
    }
    this.#update();
  }

  suspend() {
    if (isNil(this.#handle)) {
      return;
    }
    this.#cancel();
  }

  #update() {
    this.#handle = window.requestAnimationFrame(this.#onTick.bind(this));
  }

  #cancel() {
    window.cancelAnimationFrame(this.#handle);
    this.#handle = null;
  }

  #onTick(timestamp) {
    if (timestamp - this.#previous >= this.#interval) {
      const result = this.#callback(timestamp);
      if (!result) {
        this.#cancel();
        return;
      }
      this.#previous = timestamp;
    }
    this.#update();
  }
}

