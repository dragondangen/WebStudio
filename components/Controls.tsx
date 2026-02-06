import React from 'react';
import { EffectMode, EffectSettings } from '../types';
import { 
  Camera, 
  Binary, 
  Terminal, 
  Zap, 
  Grid3X3, 
  Settings2,
  Image as ImageIcon,
  MonitorUp
} from 'lucide-react';

interface ControlsProps {
  currentMode: EffectMode;
  setMode: (mode: EffectMode) => void;
  settings: EffectSettings;
  setSettings: React.Dispatch<React.SetStateAction<EffectSettings>>;
  onCapture: () => void;
  onVirtualCamera: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  currentMode, 
  setMode, 
  settings, 
  setSettings,
  onCapture,
  onVirtualCamera
}) => {
  
  const modes = [
    { id: EffectMode.None, label: 'Normal', icon: Camera },
    { id: EffectMode.Ascii, label: 'ASCII', icon: Terminal },
    { id: EffectMode.Matrix, label: 'Matrix', icon: Binary },
    { id: EffectMode.Glitch, label: 'Glitch', icon: Zap },
    { id: EffectMode.Pixelate, label: 'Pixelate', icon: Grid3X3 },
  ];

  return (
    <div className="w-full md:w-80 bg-zinc-900 border-l border-zinc-800 p-6 flex flex-col h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-8 text-white flex items-center gap-2">
        <span className="text-emerald-500">{`>_`}</span> WebStudio
      </h1>

      <div className="mb-8">
        <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-4 font-semibold">Modes</h3>
        <div className="grid grid-cols-1 gap-2">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentMode === m.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-8 border-t border-zinc-800 pt-6">
        <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-4 font-semibold flex items-center gap-2">
          <Settings2 size={14} /> Settings
        </h3>

        {currentMode === EffectMode.Ascii && (
          <div className="space-y-4">
             <div>
              <label className="text-xs text-zinc-400 mb-1 block">Character Size ({settings.resolution}px)</label>
              <input
                type="range"
                min="6"
                max="48"
                step="1"
                value={settings.resolution}
                onChange={(e) => setSettings(p => ({ ...p, resolution: Number(e.target.value) }))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Color</label>
              <input
                type="color"
                value={settings.color}
                onChange={(e) => setSettings(p => ({ ...p, color: e.target.value }))}
                className="w-full h-8 rounded bg-zinc-800 border-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {currentMode === EffectMode.Matrix && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Color</label>
              <input
                type="color"
                value={settings.color}
                onChange={(e) => setSettings(p => ({ ...p, color: e.target.value }))}
                className="w-full h-8 rounded bg-zinc-800 border-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {currentMode === EffectMode.Glitch && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Intensity</label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.intensity}
                onChange={(e) => setSettings(p => ({ ...p, intensity: Number(e.target.value) }))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        )}

        {currentMode === EffectMode.Pixelate && (
           <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Block Size</label>
              <input
                type="range"
                min="2"
                max="50"
                value={settings.resolution}
                onChange={(e) => setSettings(p => ({ ...p, resolution: Number(e.target.value) }))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        )}
         
         {currentMode === EffectMode.None && (
             <p className="text-xs text-zinc-600 italic">No settings available for normal mode.</p>
         )}
      </div>

      <div className="mt-auto space-y-3">
         <button 
            onClick={onVirtualCamera}
            className="w-full bg-zinc-800 text-emerald-400 border border-zinc-700 font-bold py-3 rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 group"
            title="Pop out video for capturing in OBS/Unity"
        >
            <MonitorUp size={18} className="group-hover:animate-pulse" />
            Virtual Camera
        </button>

        <button 
            onClick={onCapture}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
        >
            <ImageIcon size={18} />
            Capture Frame
        </button>
      </div>
    </div>
  );
};

export default Controls;