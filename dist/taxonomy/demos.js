// Original, deterministic educational demonstrations. See data.json for scope.
const TAU = Math.PI * 2;
const INK = [72, 47, 110], PAPER = [242, 235, 247];
const clamp = n => Math.max(0, Math.min(1, n));
const mix = (a, b, t) => a + (b - a) * t;
const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
const gradients = Array.from({length: 8}, (_, i) => [Math.cos(i * TAU / 8), Math.sin(i * TAU / 8)]);

// Integer lattice hash selects a unit gradient; it does not generate value noise.
function gradient(ix, iy) {
  let n = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + 41;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return gradients[(n ^ (n >>> 16)) & 7];
}
export function gradientNoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y), dx = x - ix, dy = y - iy;
  const dot = (ox, oy) => { const g = gradient(ix + ox, iy + oy); return g[0] * (dx - ox) + g[1] * (dy - oy); };
  return mix(mix(dot(0, 0), dot(1, 0), fade(dx)), mix(dot(0, 1), dot(1, 1), fade(dx)), fade(dy));
}

export function gaussianKernel(sigma) {
  if (sigma <= 0) return [1];
  const radius = Math.ceil(sigma * 3);
  const kernel = Array.from({length: radius * 2 + 1}, (_, i) => Math.exp(-((i - radius) ** 2) / (2 * sigma * sigma)));
  const total = kernel.reduce((a, b) => a + b, 0);
  return kernel.map(value => value / total);
}
export function gaussianBlur(input, width, height, sigma) {
  const kernel = gaussianKernel(sigma), radius = (kernel.length - 1) / 2;
  const horizontal = new Float32Array(input.length), output = new Float32Array(input.length);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    let value = 0;
    for (let k = -radius; k <= radius; k++) value += input[y * width + Math.max(0, Math.min(width - 1, x + k))] * kernel[k + radius];
    horizontal[y * width + x] = value;
  }
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    let value = 0;
    for (let k = -radius; k <= radius; k++) value += horizontal[Math.max(0, Math.min(height - 1, y + k)) * width + x] * kernel[k + radius];
    output[y * width + x] = value;
  }
  return output;
}

export const BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
export function orderedDither(input, width, height) {
  return Float32Array.from(input, (value, index) => value > (BAYER4[Math.floor(index / width) % 4][index % width % 4] + 0.5) / 16 ? 1 : 0);
}
export function rewriteLSystem(generations) {
  let word = 'F';
  for (let i = 0; i < generations; i++) word = word.replaceAll('F', 'F[+F]F[-F]F');
  return word;
}

function raster(values, width, height) {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d'), data = ctx.createImageData(width, height);
  values.forEach((v, i) => { for (let channel = 0; channel < 3; channel++) data.data[i * 4 + channel] = mix(INK[channel], PAPER[channel], clamp(v)); data.data[i * 4 + 3] = 255; });
  ctx.putImageData(data, 0, 0); return canvas;
}
function pair(ctx, input, output, width, height, label) {
  ctx.font = '15px Arial'; ctx.fillStyle = '#584081';
  ctx.fillText('SOURCE', 28, 29); ctx.fillText(label, 338, 29);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(raster(input, width, height), 28, 46, 274, 240);
  ctx.drawImage(raster(output, width, height), 338, 46, 274, 240);
}
const imageWidth = 128, imageHeight = 112;
const source = Float32Array.from({length: imageWidth * imageHeight}, (_, i) => {
  const x = i % imageWidth, y = Math.floor(i / imageWidth), r = Math.hypot(x - 66, y - 53);
  const shape = r < 31 && r > 16 || x > 12 && x < 30 && y > 17 && y < 97 || y > 87 && y < 99 && x > 49;
  return shape ? 0 : 1;
});

export function drawDemo(canvas, id, value, seconds = 0) {
  const ctx = canvas.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#f2ebf7'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (id === 'perlin-noise') {
    const width = 320, height = 160;
    const field = Float32Array.from({length: width * height}, (_, i) => .5 + gradientNoise((i % width) / width * value + .137, Math.floor(i / width) / width * value + .319) * .76);
    ctx.imageSmoothingEnabled = true; ctx.drawImage(raster(field, width, height), 0, 0, canvas.width, canvas.height);
  } else if (id === 'gaussian-blur') {
    pair(ctx, source, gaussianBlur(source, imageWidth, imageHeight, value), imageWidth, imageHeight, 'GAUSSIAN BLUR');
  } else if (id === 'ordered-dithering') {
    const width = 96, height = 84;
    const tones = Float32Array.from({length: width * height}, (_, i) => {
      const x = i % width, y = Math.floor(i / width), distance = Math.hypot(x - 49, y - 40);
      return clamp((distance < 27 ? .2 + distance / 85 : .15 + x / width * .8) + value / 100);
    });
    pair(ctx, tones, orderedDither(tones, width, height), width, height, '4 × 4 BAYER');
  } else if (id === 'moire') {
    ctx.strokeStyle = '#583b79'; ctx.lineWidth = 2;
    for (const layer of [0, 1]) {
      ctx.save(); ctx.translate(canvas.width / 2, canvas.height / 2); ctx.rotate(layer * value / 180 * Math.PI);
      const phase = layer ? Math.sin(seconds * TAU / 12) * 10 : 0;
      ctx.beginPath();
      for (let x = -800; x <= 800; x += 10) { ctx.moveTo(x + phase, -800); ctx.lineTo(x + phase, 800); }
      ctx.stroke(); ctx.restore();
    }
  } else if (id === 'l-systems') {
    let x = 0, y = 0, angle = -Math.PI / 2; const stack = [], lines = [], delta = value * Math.PI / 180;
    for (const symbol of rewriteLSystem(4)) {
      if (symbol === 'F') { const nx = x + Math.cos(angle), ny = y + Math.sin(angle); lines.push([x, y, nx, ny]); x = nx; y = ny; }
      else if (symbol === '+') angle += delta;
      else if (symbol === '-') angle -= delta;
      else if (symbol === '[') stack.push([x, y, angle]);
      else if (symbol === ']') [x, y, angle] = stack.pop();
    }
    const xs = lines.flatMap(line => [line[0], line[2]]), ys = lines.flatMap(line => [line[1], line[3]]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const scale = Math.min((canvas.width - 70) / (maxX - minX), (canvas.height - 45) / (maxY - minY));
    ctx.translate(canvas.width / 2 - (minX + maxX) * scale / 2, canvas.height - 22 - maxY * scale);
    ctx.scale(scale, scale); ctx.lineWidth = 1.3 / scale; ctx.strokeStyle = '#583b79'; ctx.beginPath();
    for (const [x1, y1, x2, y2] of lines) { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); }
    ctx.stroke();
  }
}
