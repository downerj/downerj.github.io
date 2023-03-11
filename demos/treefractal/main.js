const DEG_TO_RAD = Math.PI / 180;

function rotate(x, y, radius, degrees) {
  const cosA = Math.cos(degrees * DEG_TO_RAD);
  const sinA = Math.sin(degrees * DEG_TO_RAD);
  const x1 = x + radius*cosA;
  const y1 = y + radius*sinA;
  return [x1, y1];
}

class TreeBranch {
  #x;
  #y;
  #length;
  #angle;
  #hue;
  #depth;
  #children = [];

  constructor(x, y, length, angle, hue, depth = 0) {
    this.#x = x;
    this.#y = y;
    this.#length = length;
    this.#angle = angle;
    this.#hue = hue;
    this.#depth = depth;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get length() {
    return this.#length;
  }

  get angle() {
    return this.#angle;
  }

  get hue() {
    return this.#hue;
  }

  get depth() {
    return this.#depth;
  }

  getChildren(lengthRatio, angleDelta, hueDelta) {
    if (this.#children.length === 0) {
      const newLength = this.#length * lengthRatio;
      const newHue = (this.#hue + hueDelta) % 360;
      const newDepth = this.#depth + 1;
      const [x1, y1] = rotate(
        this.#x,
        this.#y,
        this.#length,
        this.#angle
      );
      const leftChild = new TreeBranch(
        x1,
        y1,
        newLength,
        this.#angle - angleDelta,
        newHue,
        newDepth
      );
      const rightChild = new TreeBranch(
        x1,
        y1,
        newLength,
        this.#angle + angleDelta,
        newHue,
        newDepth
      );
      this.#children.push(leftChild);
      this.#children.push(rightChild);
    }
    return [...this.#children];
  }
}

class TreeFractal {
  #lengthRatio;
  #angleDelta;
  #hueDelta;
  #maxDepth;
  #branches = [];

  constructor(trunkLength, trunkX, trunkY, {
    trunkAngle = -90,
    trunkHue = 0,
    lengthRatio = 0.6,
    angleDelta = 45,
    hueDelta = 10,
    maxDepth = 11,
  } = {}) {
    this.#lengthRatio = lengthRatio;
    this.#angleDelta = angleDelta;
    this.#hueDelta = hueDelta;
    this.#maxDepth = maxDepth;

    this.#branches.push(new TreeBranch(trunkX, trunkY, trunkLength, trunkAngle, trunkHue));
  }

  iterateAndDraw(ctx) {
    if (this.#branches.length === 0) {
      return false;
    }
    const branch = this.#branches.shift();
    if (branch.depth > this.#maxDepth) {
      this.#branches = [];
      return false;
    }

    const [leftBranch, rightBranch] = branch.getChildren(
      this.#lengthRatio,
      this.#angleDelta,
      this.#hueDelta
    );
    this.#branches.push(leftBranch);
    this.#branches.push(rightBranch);
    
    ctx.strokeStyle = `hsl(${branch.hue}, 100%, 50%)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(branch.x, branch.y);
    ctx.lineTo(leftBranch.x, leftBranch.y);
    ctx.stroke();

    return true;
  }
}

class IntervalTimer {
  #callback;
  #interval;
  #previous = 0;
  #handle = null;

  constructor(callback, interval) {
    this.#callback = callback;
    this.#interval = interval;
  }

  resume() {
    if (this.#handle !== null) {
      return;
    }
    this.#update();
  }

  suspend() {
    if (this.#handle === null) {
      return;
    }
    this.#cancel();
  }

  #update() {
    this.#handle = window.requestAnimationFrame(this.#tick.bind(this));
  }

  #cancel() {
    window.cancelAnimationFrame(this.#handle);
    this.#handle = null;
  }

  #tick(timestamp) {
    if (timestamp - this.#previous > this.#interval) {
      this.#previous = timestamp;
      const status = this.#callback(timestamp);
      if (!status) {
        this.#cancel();
        return;
      }
    }
    this.#update();
  }
}

function window_onLoad() {
  const cvs = document.getElementById('cvs');
  const ctx = cvs.getContext('2d');
  cvs.width = cvs.parentElement.clientWidth;
  cvs.height = cvs.parentElement.clientHeight;

  const trunkLength = Math.min(cvs.width, cvs.height) * 0.2;
  const trunkX = cvs.width * 0.5;
  const trunkY = cvs.height * 0.5;
  const numTrunks = 3;
  const trunkDeltaAngle = 360 / numTrunks;
  const trees = [];
  for (let t = 0; t < numTrunks; t++) {
    trees.push(new TreeFractal(trunkLength, trunkX, trunkY, {
      trunkAngle: -90 + trunkDeltaAngle*t,
      lengthRatio: 0.6,
      hueDelta: 30,
      angleDelta: 60,
      maxDepth: 10,
    }));
  }
  
  function timer_onTick(timestamp) {
    for (const tree of trees) {
      const status = tree.iterateAndDraw(ctx);
      if (!status) {
        trees.splice(trees.indexOf(tree), 1);
      }
    }
    if (trees.length === 0) {
      console.log('Done');
    }
    return trees.length > 0;
  }
  const timer = new IntervalTimer(timer_onTick.bind(this), 10);
  timer.resume();
}

window.addEventListener('load', window_onLoad);

