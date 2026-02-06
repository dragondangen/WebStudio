import { EffectMode, EffectSettings } from '../types';

const ASCII_CHARS = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";

let drops: number[] = [];

export const renderEffect = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  mode: EffectMode,
  settings: EffectSettings,
  width: number,
  height: number
) => {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  switch (mode) {
    case EffectMode.None:
      ctx.drawImage(video, 0, 0, width, height);
      break;

    case EffectMode.Pixelate:
      renderPixelate(ctx, video, settings, width, height);
      break;

    case EffectMode.Ascii:
      renderAscii(ctx, video, settings, width, height);
      break;

    case EffectMode.Matrix:
      renderMatrix(ctx, video, settings, width, height);
      break;

    case EffectMode.Glitch:
      renderGlitch(ctx, video, settings, width, height);
      break;
      
    case EffectMode.Halftone:
      renderHalftone(ctx, video, settings, width, height);
      break;

    case EffectMode.RgbShift:
      renderRgbShift(ctx, video, settings, width, height);
      break;

    case EffectMode.Mirror:
      renderMirror(ctx, video, settings, width, height);
      break;

    case EffectMode.Crt:
      renderCrt(ctx, video, settings, width, height);
      break;

    case EffectMode.Ripple:
      renderRipple(ctx, video, settings, width, height);
      break;
  }
};

const renderPixelate = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  settings: EffectSettings,
  width: number,
  height: number
) => {
  const size = Math.max(2, settings.resolution);
  const w = Math.ceil(width / size);
  const h = Math.ceil(height / size);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) return;
  
  tempCtx.drawImage(video, 0, 0, w, h);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, 0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
};

const renderAscii = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  settings: EffectSettings,
  width: number,
  height: number
) => {
  const fontSize = Math.max(6, settings.resolution);
  const charWidth = fontSize * 0.6;
  const charHeight = fontSize;

  const cols = Math.floor(width / charWidth);
  const rows = Math.floor(height / charHeight);

  if (cols <= 0 || rows <= 0) return;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = cols;
  tempCanvas.height = rows;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.drawImage(video, 0, 0, cols, rows);
  const frameData = tempCtx.getImageData(0, 0, cols, rows).data;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  
  ctx.font = `${fontSize}px monospace`;
  ctx.fillStyle = settings.color;
  ctx.textBaseline = 'top';

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const pixelIndex = (y * cols + x) * 4;
      const r = frameData[pixelIndex];
      const g = frameData[pixelIndex + 1];
      const b = frameData[pixelIndex + 2];
      
      const brightness = (r + g + b) / 3;
      const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
      
      const char = ASCII_CHARS[ASCII_CHARS.length - 1 - charIndex];
      
      ctx.fillText(char, x * charWidth, y * charHeight);
    }
  }
};

const renderMatrix = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  settings: EffectSettings,
  width: number,
  height: number
) => {
  ctx.globalAlpha = 0.2;
  ctx.drawImage(video, 0, 0, width, height);
  ctx.globalAlpha = 1.0;

  const fontSize = 16;
  const columns = Math.floor(width / fontSize);

  if (drops.length !== columns) {
    drops = new Array(columns).fill(1);
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = settings.color;
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = String.fromCharCode(0x30A0 + Math.random() * 96);
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    
    drops[i]++;
  }
};

const renderGlitch = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  settings: EffectSettings,
  width: number,
  height: number
) => {
  ctx.drawImage(video, 0, 0, width, height);

  const intensity = settings.intensity / 100;
  const maxOffset = width * 0.05 * intensity; 
  const sliceHeight = height * 0.1;

  const slices = Math.floor(10 * intensity);
  
  for (let i = 0; i < slices; i++) {
    const y = Math.floor(Math.random() * height);
    const h = Math.floor(Math.random() * sliceHeight);
    const xOffset = (Math.random() - 0.5) * maxOffset * 2;

    try {
        ctx.drawImage(
            video, 
            0, y, width, h, 
            xOffset, y, width, h
        );
        
        if (Math.random() > 0.5) {
             ctx.fillStyle = `rgba(${Math.random() * 255}, 255, 255, 0.2)`;
             ctx.globalCompositeOperation = 'overlay';
             ctx.fillRect(0, y, width, h);
             ctx.globalCompositeOperation = 'source-over';
        }

    } catch(e) {
    }
  }
};

const renderHalftone = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  settings: EffectSettings,
  width: number,
  height: number
) => {
  const gridSize = Math.max(5, settings.resolution);
  
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = cols;
  tempCanvas.height = rows;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  tempCtx.drawImage(video, 0, 0, cols, rows);
  const data = tempCtx.getImageData(0, 0, cols, rows).data;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = settings.color;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const idx = (y * cols + x) * 4;
      const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3 / 255;
      
      const radius = (gridSize / 2) * (1 - brightness) * 1.2;
      
      if (radius > 0) {
        ctx.beginPath();
        ctx.arc(
            x * gridSize + gridSize / 2, 
            y * gridSize + gridSize / 2, 
            radius, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
      }
    }
  }
};

const renderRgbShift = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  settings: EffectSettings,
  width: number,
  height: number
) => {
  ctx.drawImage(video, 0, 0, width, height);

  const offset = settings.intensity * 0.5;
  if (offset <= 0) return;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const copy = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      
      const leftX = Math.max(0, x - Math.floor(offset));
      const rightX = Math.min(width - 1, x + Math.floor(offset));
      
      const redIndex = (y * width + leftX) * 4;
      data[index] = copy[redIndex];
      
      const blueIndex = (y * width + rightX) * 4 + 2;
      data[index + 2] = copy[blueIndex];
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

const renderMirror = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  settings: EffectSettings,
  width: number,
  height: number
) => {
  const halfWidth = width / 2;
  
  ctx.drawImage(video, 
    0, 0, video.videoWidth / 2, video.videoHeight, 
    0, 0, halfWidth, height
  );

  ctx.save();
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 
    0, 0, video.videoWidth / 2, video.videoHeight, 
    0, 0, halfWidth, height
  );
  ctx.restore();
};

const renderCrt = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  settings: EffectSettings,
  width: number,
  height: number
) => {
  ctx.drawImage(video, 0, 0, width, height);

  const scanlineOpacity = settings.intensity / 100;
  const lineSpacing = Math.max(2, Math.floor(settings.resolution / 2));
  
  ctx.fillStyle = `rgba(0, 0, 0, ${scanlineOpacity})`;
  
  for (let y = 0; y < height; y += lineSpacing) {
    ctx.fillRect(0, y, width, 1);
  }

  const gradient = ctx.createRadialGradient(width/2, height/2, height/3, width/2, height/2, height);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.6)");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = settings.color;
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.1;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
};

const renderRipple = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  settings: EffectSettings,
  width: number,
  height: number
) => {
  const time = Date.now() / 1000;
  const frequency = settings.resolution / 100;
  const amplitude = settings.intensity / 2;
  
  const sliceHeight = 2;
  
  for (let y = 0; y < height; y += sliceHeight) {
    const xOffset = Math.sin((y * frequency) + (time * 2)) * amplitude;
    
    ctx.drawImage(
      video,
      0, y, video.videoWidth, sliceHeight,
      xOffset, y, width + (amplitude * 2), sliceHeight
    );
  }
};