export enum EffectMode {
  None = 'Normal',
  Ascii = 'ASCII',
  Matrix = 'Matrix',
  Glitch = 'Glitch',
  Pixelate = 'Pixelate',
  Halftone = 'Halftone',
  RgbShift = 'RGB Shift',
  Mirror = 'Mirror',
  Crt = 'CRT',
  Ripple = 'Ripple'
}

export interface EffectSettings {
  resolution: number;
  intensity: number;
  speed: number;
  color: string;
}

export const DEFAULT_SETTINGS: EffectSettings = {
  resolution: 12,
  intensity: 50,
  speed: 15,
  color: '#00ff00'
};