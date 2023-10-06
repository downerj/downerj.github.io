import { AnimationTimer } from "./animate.js";
import { Graphics3D } from "./graphics.js";

class Application {
  /**
   * @type {AnimationTimer}
   */
  #timer;
  /**
   * @type {Graphics3D}
   */
  #g3d;

  /**
   * 
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#g3d = new Graphics3D(canvas);
    this.#timer = new AnimationTimer(this.#onTick.bind(this), 1000/60);
  }

  /**
   * 
   * @param {DOMHighResTimeStamp} timestamp
   */
  #onTick(timestamp) {
    this.#g3d.render(timestamp);
    return true;
  }

  /**
   * 
   */
  async run() {
    await this.#g3d.init();
    document.getElementById('failureInfo').style.display = 'none';
    this.#timer.resume();
  }
}

async function window_onLoad() {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById('canvas');
  const app = new Application(canvas);

  function window_onResize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  window_onResize();
  window.addEventListener('resize', window_onResize);

  app.run();
}

window.addEventListener('load', window_onLoad);
