const {mat4} = glMatrix;

const DEG_TO_RAD = Math.PI / 180.0;
const RAD_TO_DEG = 180.0 / Math.PI;

function randomInteger(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}

class IntervalTimer {
  #callback;
  #interval;
  #handle = null;
  #previous = 0;
  
  constructor(callback, interval) {
    this.#callback = callback;
    this.#interval = interval;
  }
  
  #update() {
    this.#handle = window.requestAnimationFrame(this.#tick.bind(this));
  }
  
  #cancel() {
    window.cancelAnimationFrame(this.#handle);
    this.#handle = null;
  }
  
  #tick(timestamp) {
    if (timestamp - this.#previous >= this.#interval) {
      this.#previous = timestamp;
      const status = this.#callback(timestamp);
      if (!status) {
        this.#cancel();
        return;
      }
    }
    this.#update();
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
}

class Cube {
  static #VERTICES = [
    // Front
    -1, -1, 1,
    1, -1, 1,
    1, 1, 1,
    -1, 1, 1,
    // Back
    1, -1, -1,
    -1, -1, -1,
    -1, 1, -1,
    1, 1, -1,
    // Left
    -1, -1, -1,
    -1, -1, 1,
    -1, 1, 1,
    -1, 1, -1,
    // Right
    1, -1, 1,
    1, -1, -1,
    1, 1, -1,
    1, 1, 1,
    // Top
    -1, 1, 1,
    1, 1, 1,
    1, 1, -1,
    -1, 1, -1,
    // Bottom
    1, -1, 1,
    -1, -1, 1,
    -1, -1, -1,
    1, -1, -1,
  ];
  static #NORMALS = [
    // Front
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    // Back
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    // Left
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    // Right
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    // Top
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    // Bottom
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
  ];
  static #INDICES = [
    // Front
    0, 1, 2,
    0, 2, 3,
    // Back
    4, 5, 6,
    4, 6, 7,
    // Left
    8, 9, 10,
    8, 10, 11,
    // Right
    12, 13, 14,
    12, 14, 15,
    // Top
    16, 17, 18,
    16, 18, 19,
    // Bottom
    20, 21, 22,
    20, 22, 23,
  ];
  #position;
  #rotation;
  #color;
  
  constructor({
    x = 0,
    y = 0,
    z = 0,
    ax = 0,
    ay = 0,
    az = 0,
    red = 0,
    green = 0,
    blue = 0,
  } = {}) {
    this.#position = [x, y, z];
    this.#rotation = [ax, ay, az];
    this.#color = [red, green, blue];
  }
  
  get vertices() {
    return Cube.#VERTICES;
  }
  
  get normals() {
    return Cube.#NORMALS;
  }
  
  get indices() {
    return Cube.#INDICES;
  }
  
  get position() {
    return this.#position;
  }
  
  get ax() {
    return this.#rotation[0];
  }
  
  get ay() {
    return this.#rotation[1];
  }
  
  get az() {
    return this.#rotation[2];
  }
  
  get color() {
    return this.#color;
  }
}

class Camera {
  #positionNegative;
  #rotation;
  
  constructor({x = 0, y = 0, z = 0, ax = 0, ay = 0, az = 0,} = {}) {
    this.#positionNegative = [-x, -y, -z];
    this.#rotation = [ax, ay, az];
  }
  
  get positionNegative() {
    return this.#positionNegative;
  }
  
  get rotation() {
    return this.#rotation;
  }
  
  get ax() {
    return this.#rotation[0];
  }
  
  get ay() {
    return this.#rotation[1];
  }
  
  get az() {
    return this.#rotation[2];
  }
  
  walkForward(amount) {
    this.strafeFB(-amount);
  }
  
  walkBackward(amount) {
    this.strafeFB(amount);
  }
  
  strafeLeft(amount) {
    this.strafeLR(-amount);
  }
  
  strafeRight(amount) {
    this.strafeLR(amount);
  }
  
  ascend(amount) {
    this.#positionNegative[1] -= amount;
  }
  
  descend(amount) {
    this.#positionNegative[1] += amount;
  }
  
  strafeFB(amount) {
    const cosAX = Math.cos(this.#rotation[1] * DEG_TO_RAD);
    const sinAX = Math.sin(this.#rotation[1] * DEG_TO_RAD);
    this.#positionNegative[0] += amount * sinAX;
    this.#positionNegative[2] -= amount * cosAX;
  }
  
  strafeLR(amount) {
    const cosAX = Math.cos(this.#rotation[1] * DEG_TO_RAD);
    const sinAX = Math.sin(this.#rotation[1] * DEG_TO_RAD);
    this.#positionNegative[0] -= amount * cosAX;
    this.#positionNegative[2] -= amount * sinAX;
  }
  
  pitch(degrees) {
    this.#rotation[0] += degrees;
    if (this.#rotation[0] >= 90) {
      this.#rotation[0] = 90;
    } else if (this.#rotation[0] <= -90) {
      this.#rotation[0] = -90;
    }
  }
  
  yaw(degrees) {
    this.#rotation[1] += degrees;
    this.#rotation[1] %= 360;
    if (this.#rotation[1] < 0) {
      this.rotation[1] += 360;
    }
  }
  
  roll(degrees) {
    this.#rotation[2] += degrees;
    this.#rotation[2] %= 360;
    if (this.#rotation[2] < 0) {
      this.rotation[2] += 360;
    }
  }
}

const VERTEX_SOURCE = `#version 100
precision highp float;

attribute vec4 position;
attribute vec4 normal;

varying vec3 lighting;

uniform mat4 mvpMatrix;
uniform mat4 normalMatrix;
uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform vec3 objectColor;

void main() {
  gl_Position = mvpMatrix * position;
  
  vec4 transformedNormal = normalMatrix * normal;
  float directional = max(dot(transformedNormal.xyz, normalize(lightDirection)), 0.0);
  lighting = objectColor + (lightColor * directional * objectColor);
}
`;

const FRAGMENT_SOURCE = `#version 100
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#define PI 3.141592653589793

varying vec3 lighting;

void main() {
  gl_FragColor = vec4(lighting, 1.0);
}
`;

const AXIS_X = [1, 0, 0];
const AXIS_Y = [0, 1, 0];
const AXIS_Z = [0, 0, 1];

class Graphics {
  #width;
  #height;
  #gl;
  #programInfo = {
    program: null,
    locations: {
      attribute: {
        position: null,
        normal: null,
      },
      uniform: {
        mvpMatrix: null,
        normalMatrix: null,
        lightDirection: null,
        lightColor: null,
        objectColor: null,
      },
    }
  };
  #camera;
  #entities = [];
  
  static #getGL(canvas, {antialias = true,} = {}) {
    for (const api of ['webgl', 'webgl-experimental']) {
      const gl = canvas.getContext(api, {antialias: antialias,});
      if (gl) {
        return gl;
      }
    }
    throw 'Unable to get WebGL context';
  }
  
  constructor(canvas, camera) {
    this.#width = canvas.clientWidth;
    this.#height = canvas.clientHeight;
    const gl = Graphics.#getGL(canvas);
    this.#gl = gl;
    gl.viewport(0, 0, this.#width, this.#height); 
    const program = this.#createProgram(VERTEX_SOURCE, FRAGMENT_SOURCE);
    this.#programInfo.program = program;
    for (const name in this.#programInfo.locations.attribute) {
      this.#programInfo.locations.attribute[name] = gl.getAttribLocation(program, name);
    }
    for (const name in this.#programInfo.locations.uniform) {
      this.#programInfo.locations.uniform[name] = gl.getUniformLocation(program, name);
    }
    this.#camera = camera;
  }
  
  pushEntity(entity) {
    const gl = this.#gl;
    this.#entities.push({
      object: entity,
      buffers: {
        vertex: this.#createBuffer(
          gl.ARRAY_BUFFER,
          new Float32Array(entity.vertices),
          gl.STATIC_DRAW
        ),
        normal: this.#createBuffer(
          gl.ARRAY_BUFFER,
          new Float32Array(entity.normals),
          gl.STATIC_DRAW
        ),
        index: this.#createBuffer(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(entity.indices),
          gl.STATIC_DRAW
        ),
      },
      indexCount: entity.indices.length,
    });
  }
  
  render(timestamp) {
    const gl = this.#gl;
    const camera = this.#camera;
    const programInfo = this.#programInfo;
    const entities = this.#entities;
    const width = gl.canvas.clientWidth;
    const height = gl.canvas.clientHeight;
    
    if (width !== this.#width || height !== this.#height) {
      this.#width = width;
      this.#height = height;
      gl.viewport(0, 0, width, height);
    }
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    const projectionMat = mat4.create();
    const fieldOfView = 45 * DEG_TO_RAD;
    const aspectRatio = width / height;
    const near = 0.1;
    const far = 1000;
    mat4.perspective(projectionMat, fieldOfView, aspectRatio, near, far);
    
    const viewMat = mat4.create();
    mat4.rotate(viewMat, viewMat, camera.ax * DEG_TO_RAD, AXIS_X);
    mat4.rotate(viewMat, viewMat, camera.ay * DEG_TO_RAD, AXIS_Y);
    mat4.rotate(viewMat, viewMat, camera.az * DEG_TO_RAD, AXIS_Z);
    mat4.translate(viewMat, viewMat, camera.positionNegative);

    gl.useProgram(programInfo.program);
    
    for (const entity of entities) {
      gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.vertex);
      gl.vertexAttribPointer(
        programInfo.locations.attribute.position,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(programInfo.locations.attribute.position);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.normal);
      gl.vertexAttribPointer(
        programInfo.locations.attribute.normal,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(programInfo.locations.attribute.normal);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.buffers.index);
    
      const modelMat = mat4.create();
      mat4.translate(modelMat, modelMat, entity.object.position);
      mat4.rotate(modelMat, modelMat, entity.object.ax * DEG_TO_RAD, AXIS_X);
      mat4.rotate(modelMat, modelMat, entity.object.ay * DEG_TO_RAD, AXIS_Y);
      mat4.rotate(modelMat, modelMat, entity.object.az * DEG_TO_RAD, AXIS_Z);
      
      const mvpMat = mat4.create();
      mat4.multiply(mvpMat, mvpMat, projectionMat);
      mat4.multiply(mvpMat, mvpMat, viewMat);
      mat4.multiply(mvpMat, mvpMat, modelMat);
      
      const normalMat = mat4.create();
      mat4.invert(normalMat, modelMat);
      mat4.transpose(normalMat, normalMat);
      
      gl.uniformMatrix4fv(programInfo.locations.uniform.mvpMatrix, false, mvpMat);
      gl.uniformMatrix4fv(programInfo.locations.uniform.normalMatrix, false, normalMat);
      gl.uniform3fv(programInfo.locations.uniform.lightDirection, [0.85, 0.8, 0.75]);
      gl.uniform3fv(programInfo.locations.uniform.lightColor, [1, 1, 1]);
      gl.uniform3fv(programInfo.locations.uniform.objectColor, entity.object.color);
      
      gl.drawElements(
        gl.TRIANGLES,
        entity.indexCount,
        gl.UNSIGNED_SHORT,
        0
      );
    }
  }
  
  #createShader(type, source) {
    const gl = this.#gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }
  
  #createProgram(vertexSource, fragmentSource) {
    const gl = this.#gl;
    const vertexShader = this.#createShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.#createShader(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
      const vertexLog = gl.getShaderInfoLog(vertexShader);
      if (vertexLog.length > 0) {
        console.error(`Vertex shader log: ${vertexLog}`);
      }
      const fragmentLog = gl.getShaderInfoLog(fragmentShader);
      if (fragmentLog.length > 0) {
        console.error(`Fragment shader log: ${fragmentLog}`);
      }
      program = null;
    }
    gl.detachShader(program, vertexShader);
    gl.deleteShader(vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(fragmentShader);
    return program;
  }
  
  #createBuffer(target, data, usage) {
    const gl = this.#gl;
    const buffer = gl.createBuffer(target);
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, usage);
    gl.bindBuffer(target, null);
    return buffer;
  }
}

const KEY_UP = 0;
const KEY_DOWN = 1;
const KEY_DEBOUNCED = -1;

class Application {
  static #STRAFE_SPEED = 2;
  static #LOOK_SPEED_RATIO = 0.1;
  #camera = new Camera({z: 5,});
  #cubes = [];
  #graphics;
  #timer;
  #keys = {
    a: KEY_UP,
    d: KEY_UP,
    s: KEY_UP,
    w: KEY_UP,
    ' ': KEY_UP,
    Spacebar: KEY_UP,
    Shift: KEY_UP,
    ArrowLeft: KEY_UP,
    ArrowRight: KEY_UP,
    ArrowUp: KEY_UP,
    ArrowDown: KEY_UP,
  };
  
  constructor(canvas) {
    this.#graphics = new Graphics(canvas, this.#camera);
    for (let c = 0; c < 100; c++) {
      const cube = new Cube({
        x: randomInteger(-50, 50),
        y: randomInteger(-50, 50),
        z: randomInteger(-50, 50),
        ax: randomInteger(-45, 45),
        ay: randomInteger(-45, 45),
        az: randomInteger(-45, 45),
        red: Math.random(),
        green: Math.random(),
        blue: Math.random(),
      });
      this.#cubes.push(cube);
      this.#graphics.pushEntity(cube);
    }
    this.#timer = new IntervalTimer(this.#tick.bind(this), 10);
  }
  
  start() {
    this.#timer.resume();
  }
  
  pressKey(key) {
    if (!(key in this.#keys)) {
      return;
    }
    if (this.#keys[key] !== KEY_DEBOUNCED) {
      this.#keys[key] = KEY_DOWN;
    }
  }
  
  releaseKey(key) {
    if (!(key in this.#keys)) {
      return;
    }
    this.#keys[key] = KEY_UP;
  }
  
  moveMouse(dx, dy) {
    const hasMouse = document.pointerLockElement === cvs;
    if (!hasMouse) {
      return;
    }
    this.#camera.yaw(dx * Application.#LOOK_SPEED_RATIO);
    this.#camera.pitch(dy * Application.#LOOK_SPEED_RATIO);
  }
  
  #tick(timestamp) {
    this.#update();
    this.#graphics.render(timestamp);
    return true;
  }
  
  #update() {
    const keys = this.#keys;
    const camera = this.#camera;
    if (keys.w === KEY_DOWN || keys.ArrowUp === KEY_DOWN) {
      camera.walkForward(Application.#STRAFE_SPEED);
    } else if (keys.s === KEY_DOWN || keys.ArrowDown === KEY_DOWN) {
      camera.walkBackward(Application.#STRAFE_SPEED);
    }
    if (keys.a === KEY_DOWN || keys.ArrowLeft === KEY_DOWN) {
      camera.strafeLeft(Application.#STRAFE_SPEED);
    } else if (keys.d === KEY_DOWN || keys.ArrowRight === KEY_DOWN) {
      camera.strafeRight(Application.#STRAFE_SPEED);
    }
    if (keys[' '] === KEY_DOWN) {
      camera.ascend(Application.#STRAFE_SPEED);
    } else if (keys.Shift === KEY_DOWN) {
      camera.descend(Application.#STRAFE_SPEED);
    }
  }
}

let cvs;
let app;

function cvs_onMouseMove(event) {
  app.moveMouse(event.movementX, event.movementY);
}

function cvs_onClick() {
  if (document.pointerLockElement !== cvs) {
    cvs.requestPointerLock();
  }
}

function window_onLoad() {
  cvs = document.getElementById('cvs');
  cvs.addEventListener('mousemove', cvs_onMouseMove);
  cvs.addEventListener('click', cvs_onClick);
  window_onResize();
  
  app = new Application(cvs);
  app.start();
}

function window_onResize() {
  cvs.width = cvs.parentElement.clientWidth;
  cvs.height = cvs.parentElement.clientHeight;
}

function window_onKeyDown(event) {
  app.pressKey(event.key);
}

function window_onKeyUp(event) {
  app.releaseKey(event.key);
}

window.addEventListener('load', window_onLoad);
window.addEventListener('resize', window_onResize);
window.addEventListener('keydown', window_onKeyDown);
window.addEventListener('keyup', window_onKeyUp);
