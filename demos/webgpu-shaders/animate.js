import { isNil } from './utils.js';

export class AnimationTimer {
  /**
   * @type {number}
   */
  #interval;
  /**
   * @type {(timestamp: DOMHighResTimeStamp) => boolean}
   */
  #callback;
  /**
   * @type {number}
   */
  #handle = null;
  /**
   * @type {DOMHighResTimeStamp}
   */
  #previous = 0;

  /**
   * 
   * @param {(timestamp: DOMHighResTimeStamp) => boolean} callback
   * @param {number} interval
   */
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

  /**
   * 
   * @param {DOMHighResTimeStamp} timestamp
   */
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

