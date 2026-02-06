export enum EffectMode {
  None = 'Normal',
  Ascii = 'ASCII',
  Matrix = 'Matrix',
  Glitch = 'Glitch',
  Pixelate = 'Pixelate'
}

export interface EffectSettings {
  resolution: number; // For ASCII (char size) and Pixelate (block size)
  intensity: number;  // For Glitch amount or Matrix density
  speed: number;      // For Matrix rain speed
  color: string;      // Hex color for ASCII/Matrix
}

export const DEFAULT_SETTINGS: EffectSettings = {
  resolution: 12,
  intensity: 50,
  speed: 15,
  color: '#00ff00'
};