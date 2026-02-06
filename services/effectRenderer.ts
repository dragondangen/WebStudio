import { EffectMode, EffectSettings } from '../types';

const ASCII_CHARS = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";

// Matrix State
let drops: number[] = [];
let lastMatrixTime = 0;

export const renderEffect = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  mode: EffectMode,
  settings: EffectSettings,
  width: number,
  height: number
) => {
  // Clear canvas
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

  // Draw small
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) return;
  
  tempCtx.drawImage(video, 0, 0, w, h);

  // Turn off smoothing for crisp pixels
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
  // Font height (pixels)
  const fontSize = Math.max(6, settings.resolution);
  
  // Font width estimation (approx 0.6 aspect ratio for monospace)
  // This removes gaps between characters horizontally
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

  // Draw video resized to the number of columns/rows (1 pixel per character)
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
      
      // Draw character at calculated position
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
  // Draw faint video background
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

    // Random reset or move down based on speed
    if (drops[i] * fontSize > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    
    // Use speed setting to control update rate
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
  // Draw base
  ctx.drawImage(video, 0, 0, width, height);

  const intensity = settings.intensity / 100;
  const maxOffset = width * 0.05 * intensity; 
  const sliceHeight = height * 0.1;

  // Chromatic Aberration
  if (Math.random() < intensity) {
    const imageData = ctx.getImageData(0, 0, width, height);
    // This is computationally heavy to do manually in JS per pixel
    // Simulating via multiple draws with composite modes is faster for realtime
  }

  // Slice displacement
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
        
        // Color channel shift (simulated by overlaying colored rectangles with blending)
        if (Math.random() > 0.5) {
             ctx.fillStyle = `rgba(${Math.random() * 255}, 255, 255, 0.2)`;
             ctx.globalCompositeOperation = 'overlay';
             ctx.fillRect(0, y, width, h);
             ctx.globalCompositeOperation = 'source-over';
        }

    } catch(e) {
        // Ignore edge case errors
    }
  }
};