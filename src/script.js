import { randomInteger, isNil } from './utils.js';
import { Loop } from './loop.js';

class GalleryApp {
  static #STAR_COUNT = 100;
  static #STAR_DX = 1;
  static #STAR_DY = 1;
  static #TWINKLE_INVERSE_FACTOR = 2;
  static #REINIT_TIMEOUT_MS = 100;
  #stars;
  #context;
  #loop;
  #reinitTimeout = null;

  constructor(canvas) {
    this.#context = canvas.getContext('2d');
    this.#reinit(canvas.width, canvas.height);
    this.#loop = new Loop(() => {
      this.#update()
      this.#draw();
      return true;
    }, 50);
  }

  start() {
    this.#loop.resume();
  }

  resize(width, height) {
    this.#loop.suspend();
    if (!isNil(this.#reinitTimeout)) {
      clearTimeout(this.#reinitTimeout);
    }
    this.#reinitTimeout = setTimeout(() => {
      this.#reinit(width, height);
      this.#loop.resume();
      clearTimeout(this.#reinitTimeout);
      this.#reinitTimeout = null;
    }, GalleryApp.#REINIT_TIMEOUT_MS);
  }

  #reinit(width, height) {
    this.#stars = [];
    const hueDivision = 12;
    const hueDelta = Math.floor(360 / hueDivision);
    for (let _s = 0; _s < GalleryApp.#STAR_COUNT; _s++) {
      const hue = randomInteger(0, hueDivision) * hueDelta;
      const lightness = randomInteger(10, 50);
      this.#stars.push({
        x: randomInteger(0, width),
        y: randomInteger(0, height),
        baseColor: `hsl(${hue} 100% ${lightness}%)`,
        twinkleColor: `hsl(${hue} 100% 50%)`,
      });
    }
  }

  #update() {
    const canvas = this.#context.canvas;
    this.#stars.forEach((star) => {
      star.x += GalleryApp.#STAR_DX;
      star.y += GalleryApp.#STAR_DY;
      if (star.x > canvas.width) {
        star.x = 0;
      }
      if (star.y > canvas.height) {
        star.y = 0;
      }
    });
  }

  #draw() {
    const ctx = this.#context;
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.#stars.forEach((star) => {
      const twinkleState = randomInteger(0, GalleryApp.#TWINKLE_INVERSE_FACTOR);
      ctx.fillStyle = twinkleState ? star.baseColor : star.twinkleColor;
      ctx.fillRect(star.x, star.y, 2, 2);
    });
  }
}

function window_onLoad() {
  const cvs = document.getElementById('cvs');
  const app = new GalleryApp(cvs);
  
  function window_onResize() {
    cvs.width = cvs.parentElement.clientWidth;
    cvs.height = cvs.parentElement.clientHeight;
    app.resize(cvs.width, cvs.height);
  }
  window_onResize();
  window.addEventListener('resize', window_onResize);
  app.start();
}

window.addEventListener('load', window_onLoad);

