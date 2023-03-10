'use strict';

const mainVertexSource = `#version 100
precision highp float;

attribute vec4 position;
attribute vec4 normal;
attribute vec2 textureCoordIn;
varying vec2 textureCoord;
varying vec3 lighting;

uniform mat4 mvpMatrix;
uniform mat4 normalMatrix;
uniform vec3 lightColor;
uniform vec3 lightDirection;
uniform vec3 objectColor;

void main() {
  gl_Position = mvpMatrix * position;
  
  vec4 transformedNormal = normalize(normalMatrix * normal);
  float diffuseFactor = dot(transformedNormal.xyz, normalize(lightDirection));
  float diffuseFactorPositive = max(diffuseFactor, 0.0);
  lighting = objectColor + diffuseFactorPositive * lightColor;
  textureCoord = textureCoordIn;
}
`;
const mainFragmentSource = `#version 100
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 textureCoord;
varying vec3 lighting;

uniform sampler2D texture;

void main() {
  vec4 color = texture2D(texture, textureCoord);
  gl_FragColor = vec4(lighting * color.rgb, color.a);
}
`;
const cubeVertices = new Float32Array([
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
]);
const cubeNormals = new Float32Array([
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
]);
const cubeTextureCoords = new Float32Array([
  // Front
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  // Back
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  // Left
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  // Right
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  // Top
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  // Bottom
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
]);
const cubeIndices = new Uint16Array([
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
]);

const dynamicVertexSource = `#version 100
precision highp float;

attribute vec4 position;

void main() {
  gl_Position = position;
}
`;
const dynamicFragmentSource = `#version 100
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float time;

// https://github.com/hughsk/glsl-hsv2rgb/blob/master/index.glsl
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  float x = gl_FragCoord.x;
  float y = gl_FragCoord.y;
  float hue = mod((y - x) / 1000.0 + time / 1000.0, 360.0);
  float saturation = 1.0;
  float value = 1.0;
  vec3 hsv = vec3(hue, saturation, value);
  gl_FragColor = vec4(hsv2rgb(hsv), 1.0);
}
`;
const dynamicVertices = new Float32Array([
  -1.0, -1.0,
  1.0, -1.0,
  1.0, 1.0,
  -1.0, 1.0,
]);
const dynamicIndices = new Uint16Array([
  0, 1, 2,
  0, 2, 3,
]);

function getGL(canvas) {
  for (const api of ['webgl', 'webgl-experimental']) {
    const ctx = canvas.getContext(api);
    if (ctx) {
      return ctx;
    }
  }
  return null;
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let status = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!status) {
    console.error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
    const vertexLog = gl.getShaderInfoLog(vertexShader);
    if (vertexLog.length > 0) {
      console.error(`Vertex shader info log: ${vertexLog}`);
    }
    const fragmentLog = gl.getShaderInfoLog(fragmentShader);
    if (fragmentLog.length > 0) {
      console.error(`Fragment shader info log: ${fragmentLog}`);
    }
  }
  gl.detachShader(program, vertexShader);
  gl.deleteShader(vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(fragmentShader);
  if (!status) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function createBuffer(gl, target, data, usage) {
  const buffer = gl.createBuffer(target);
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, usage);
  gl.bindBuffer(target, null);
  return buffer;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function createBlankTexture(gl, width, height) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array(width * height * 4)
  );
  /*
  if (isPowerOf2(width) && isPowerOf2(height)) {
     gl.generateMipmap(gl.TEXTURE_2D);
  } else {
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
  */
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

function createTextureFramebuffer(gl, texture) {
  let framebuffer = gl.createFramebuffer();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.error(`Error creating framebuffer with texture: Status code ${status}`);
    framebuffer = null;
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return framebuffer;
}

function window_onResize(canvas) {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}

const {mat4} = glMatrix;
const DEG_TO_RAD = Math.PI / 180.0;
const AXIS_X = [1, 0, 0];
const AXIS_Y = [0, 1, 0];
const AXIS_Z = [0, 0, 1];

function window_onLoad() {
  const canvas = document.getElementById('cvs');
  window.addEventListener('resize', () => {
    window_onResize(canvas);
  });
  window_onResize(canvas);
  
  const gl = getGL(canvas);
  if (!gl) {
    throw `Unable to get WebGL context`;
  }
  
  const mainProgram = createProgram(
    gl,
    mainVertexSource,
    mainFragmentSource
  );
  if (!mainProgram) {
    return;
  }
  const mainPositionLocation = gl.getAttribLocation(mainProgram, 'position');
  const mainNormalLocation = gl.getAttribLocation(mainProgram, 'normal');
  const mainTextureCoordLocation = gl.getAttribLocation(mainProgram, 'textureCoordIn');
  const mainMVPMatrixLocation = gl.getUniformLocation(mainProgram, 'mvpMatrix');
  const mainNormalMatrixLocation = gl.getUniformLocation(mainProgram, 'normalMatrix');
  const mainLightColorLocation = gl.getUniformLocation(mainProgram, 'lightColor');
  const mainLightDirectionLocation = gl.getUniformLocation(mainProgram, 'lightDirection');
  const mainObjectColorLocation = gl.getUniformLocation(mainProgram, 'objectColor');
  const mainTextureLocation = gl.getUniformLocation(mainProgram, 'texture');
  const cubeVertexBuffer = createBuffer(
    gl,
    gl.ARRAY_BUFFER,
    cubeVertices,
    gl.STATIC_DRAW
  );
  const cubeNormalBuffer = createBuffer(
    gl,
    gl.ARRAY_BUFFER,
    cubeNormals,
    gl.STATIC_DRAW
  );
  const cubeTextureCoordBuffer = createBuffer(
    gl,
    gl.ARRAY_BUFFER,
    cubeTextureCoords,
    gl.STATIC_DRAW
  );
  const cubeIndexBuffer = createBuffer(
    gl,
    gl.ELEMENT_ARRAY_BUFFER,
    cubeIndices,
    gl.STATIC_DRAW
  );
  const textureWidth = 512;
  const textureHeight = textureWidth;
  const cubeTexture = createBlankTexture(gl, textureWidth, textureHeight);
  
  const dynamicProgram = createProgram(
    gl,
    dynamicVertexSource,
    dynamicFragmentSource
  );
  if (!dynamicProgram) {
    return;
  }
  const dynamicPositionLocation = gl.getAttribLocation(dynamicProgram, 'position');
  const dynamicTimeLocation = gl.getUniformLocation(dynamicProgram, 'time');
  const dynamicVertexBuffer = createBuffer(
    gl,
    gl.ARRAY_BUFFER,
    dynamicVertices,
    gl.STATIC_DRAW
  );
  const dynamicIndexBuffer = createBuffer(
    gl,
    gl.ELEMENT_ARRAY_BUFFER,
    dynamicIndices,
    gl.STATIC_DRAW
  );
  const textureFramebuffer = createTextureFramebuffer(gl, cubeTexture);
  if (!textureFramebuffer) {
    return;
  }
  
  function render(timestamp) {
    const canvasWidth = gl.canvas.clientWidth;
    const canvasHeight = gl.canvas.clientHeight;
    
    // Draw to the cube's texture.
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, textureFramebuffer);
    gl.useProgram(dynamicProgram);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
    gl.disable(gl.DEPTH_TEST);
    gl.viewport(0, 0, textureWidth, textureHeight);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, dynamicVertexBuffer);
    gl.vertexAttribPointer(
      dynamicPositionLocation,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(dynamicPositionLocation);
    
    gl.uniform1f(dynamicTimeLocation, timestamp);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dynamicIndexBuffer);
    gl.drawElements(
      gl.TRIANGLES,
      dynamicIndices.length,
      gl.UNSIGNED_SHORT,
      0
    );
    
    gl.disableVertexAttribArray(dynamicPositionLocation);
    gl.disable(gl.BLEND);
    
    // Draw the cube to the screen.
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(mainProgram);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvasWidth, canvasHeight);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.vertexAttribPointer(
      mainPositionLocation,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(mainPositionLocation);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
    gl.vertexAttribPointer(
      mainNormalLocation,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(mainNormalLocation);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeTextureCoordBuffer);
    gl.vertexAttribPointer(
      mainTextureCoordLocation,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(mainTextureCoordLocation);
    
    const projectionMatrix = mat4.create();
    const fieldOfView = 45 * DEG_TO_RAD;
    const aspectRatio = canvasWidth / canvasHeight;
    const near = 0.1;
    const far = 1000;
    mat4.perspective(projectionMatrix, fieldOfView, aspectRatio, near, far);
    
    const viewMatrix = mat4.create();
    const cameraAngleX = 0;
    const cameraAngleY = 0;
    const cameraAngleZ = 0;
    const cameraPosition = [0, 0, -5];
    mat4.rotate(viewMatrix, viewMatrix, cameraAngleX * DEG_TO_RAD, AXIS_X);
    mat4.rotate(viewMatrix, viewMatrix, cameraAngleY * DEG_TO_RAD, AXIS_Y);
    mat4.rotate(viewMatrix, viewMatrix, cameraAngleZ * DEG_TO_RAD, AXIS_Z);
    mat4.translate(viewMatrix, viewMatrix, cameraPosition);
    
    const modelMatrix = mat4.create();
    const cubeAngleX = timestamp * 0.01;
    const cubeAngleY = timestamp * 0.02;
    const cubeAngleZ = timestamp * 0.04;
    const cubePosition = [0, 0, 0];
    mat4.rotate(modelMatrix, modelMatrix, cubeAngleX * DEG_TO_RAD, AXIS_X);
    mat4.rotate(modelMatrix, modelMatrix, cubeAngleY * DEG_TO_RAD, AXIS_Y);
    mat4.rotate(modelMatrix, modelMatrix, cubeAngleZ * DEG_TO_RAD, AXIS_Z);
    mat4.translate(modelMatrix, modelMatrix, cubePosition);
    
    const mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, mvpMatrix, projectionMatrix);
    mat4.multiply(mvpMatrix, mvpMatrix, viewMatrix);
    mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);
    
    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    
    gl.uniformMatrix4fv(mainMVPMatrixLocation, false, mvpMatrix);
    gl.uniformMatrix4fv(mainNormalMatrixLocation, false, normalMatrix);
    gl.uniform3f(mainLightColorLocation, 1.0, 1.0, 1.0);
    gl.uniform3f(mainLightDirectionLocation, 0.5, 0.7, 0.8);
    gl.uniform3f(mainObjectColorLocation, 0.3, 0.3, 0.3);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
    gl.uniform1i(mainTextureLocation, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.drawElements(
      gl.TRIANGLES,
      cubeIndices.length,
      gl.UNSIGNED_SHORT,
      0
    );
    
    gl.disableVertexAttribArray(mainTextureCoordLocation);
    gl.disableVertexAttribArray(mainNormalLocation);
    gl.disableVertexAttribArray(mainPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
  
  let previous = 0;
  const interval = 10;
  function tick(timestamp) {
    if (timestamp - previous >= interval) {
      previous = timestamp;
      render(timestamp);
    }
    window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);
}

window.addEventListener('load', window_onLoad);
