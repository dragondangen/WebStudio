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
  MonitorUp,
  Newspaper,
  Move3d,
  FlipHorizontal,
  Tv,
  Waves,
  X
} from 'lucide-react';

interface ControlsProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: EffectMode;
  setMode: (mode: EffectMode) => void;
  settings: EffectSettings;
  setSettings: React.Dispatch<React.SetStateAction<EffectSettings>>;
  onCapture: () => void;
  onVirtualCamera: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  isOpen,
  onClose,
  currentMode, 
  setMode, 
  settings, 
  setSettings,
  onCapture,
  onVirtualCamera
}) => {
  
  const modes = [
    { id: EffectMode.None, label: 'Normal', icon: Camera },
    { id: EffectMode.Mirror, label: 'Mirror', icon: FlipHorizontal },
    { id: EffectMode.Crt, label: 'CRT', icon: Tv },
    { id: EffectMode.Ripple, label: 'Ripple', icon: Waves },
    { id: EffectMode.Glitch, label: 'Glitch', icon: Zap },
    { id: EffectMode.RgbShift, label: 'RGB Shift', icon: Move3d },
    { id: EffectMode.Ascii, label: 'ASCII', icon: Terminal },
    { id: EffectMode.Matrix, label: 'Matrix', icon: Binary },
    { id: EffectMode.Pixelate, label: 'Pixelate', icon: Grid3X3 },
    { id: EffectMode.Halftone, label: 'Halftone', icon: Newspaper },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-zinc-900/95 backdrop-blur-xl border-l border-zinc-800 p-6 flex flex-col z-40 transition-transform duration-300 ease-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-emerald-500">{`>_`}</span> WebStudio
            </h1>
            <button 
                onClick={onClose}
                className="text-zinc-400 hover:text-white transition-colors bg-zinc-800 p-2 rounded-lg"
            >
                <X size={20} />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
            
            {/* Modes Grid */}
            <div>
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-4 font-semibold">Modes</h3>
                <div className="grid grid-cols-2 gap-3">
                {modes.map((m) => {
                    const Icon = m.icon;
                    return (
                    <button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        className={`flex items-center flex-col justify-center gap-2 px-2 py-4 rounded-lg transition-all duration-200 text-sm border ${
                        currentMode === m.id
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/50'
                            : 'bg-zinc-800/50 border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                    >
                        <Icon size={20} />
                        <span className="font-medium">{m.label}</span>
                    </button>
                    );
                })}
                </div>
            </div>

            {/* Settings */}
            <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-4 font-semibold flex items-center gap-2">
                <Settings2 size={14} /> Settings
                </h3>

                {currentMode === EffectMode.Ascii && (
                <div className="space-y-4">
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Character Size ({settings.resolution}px)</label>
                    <input
                        type="range"
                        min="6"
                        max="48"
                        step="1"
                        value={settings.resolution}
                        onChange={(e) => setSettings(p => ({ ...p, resolution: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                    </div>
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Color</label>
                    <div className="flex gap-2">
                         <input
                            type="color"
                            value={settings.color}
                            onChange={(e) => setSettings(p => ({ ...p, color: e.target.value }))}
                            className="w-10 h-10 rounded bg-zinc-800 border border-zinc-700 cursor-pointer p-0 overflow-hidden"
                        />
                        <div className="flex-1 bg-zinc-800 rounded px-3 flex items-center text-xs text-zinc-400 font-mono">
                            {settings.color}
                        </div>
                    </div>
                   
                    </div>
                </div>
                )}

                {currentMode === EffectMode.Matrix && (
                <div className="space-y-4">
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Color</label>
                    <input
                        type="color"
                        value={settings.color}
                        onChange={(e) => setSettings(p => ({ ...p, color: e.target.value }))}
                        className="w-full h-10 rounded bg-zinc-800 border border-zinc-700 cursor-pointer"
                    />
                    </div>
                </div>
                )}

                {currentMode === EffectMode.Glitch && (
                <div className="space-y-4">
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Intensity</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.intensity}
                        onChange={(e) => setSettings(p => ({ ...p, intensity: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                    </div>
                </div>
                )}

                {currentMode === EffectMode.Pixelate && (
                <div className="space-y-4">
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Block Size</label>
                    <input
                        type="range"
                        min="2"
                        max="50"
                        value={settings.resolution}
                        onChange={(e) => setSettings(p => ({ ...p, resolution: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                    </div>
                </div>
                )}

                {currentMode === EffectMode.Halftone && (
                <div className="space-y-4">
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Dot Size ({settings.resolution})</label>
                    <input
                        type="range"
                        min="5"
                        max="30"
                        value={settings.resolution}
                        onChange={(e) => setSettings(p => ({ ...p, resolution: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                    </div>
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Ink Color</label>
                    <input
                        type="color"
                        value={settings.color}
                        onChange={(e) => setSettings(p => ({ ...p, color: e.target.value }))}
                        className="w-full h-10 rounded bg-zinc-800 border border-zinc-700 cursor-pointer"
                    />
                    </div>
                </div>
                )}

                {currentMode === EffectMode.RgbShift && (
                <div className="space-y-4">
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Separation Amount</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.intensity}
                        onChange={(e) => setSettings(p => ({ ...p, intensity: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                    </div>
                </div>
                )}
                
                {currentMode === EffectMode.Mirror && (
                <div className="space-y-4">
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Center Line Color</label>
                    <input
                        type="color"
                        value={settings.color}
                        onChange={(e) => setSettings(p => ({ ...p, color: e.target.value }))}
                        className="w-full h-10 rounded bg-zinc-800 border border-zinc-700 cursor-pointer"
                    />
                    </div>
                </div>
                )}

                {currentMode === EffectMode.Crt && (
                <div className="space-y-4">
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Scanline Opacity</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.intensity}
                        onChange={(e) => setSettings(p => ({ ...p, intensity: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                    </div>
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Line Thickness</label>
                    <input
                        type="range"
                        min="2"
                        max="10"
                        value={settings.resolution}
                        onChange={(e) => setSettings(p => ({ ...p, resolution: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                    </div>
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Tint Color</label>
                    <input
                        type="color"
                        value={settings.color}
                        onChange={(e) => setSettings(p => ({ ...p, color: e.target.value }))}
                        className="w-full h-10 rounded bg-zinc-800 border border-zinc-700 cursor-pointer"
                    />
                    </div>
                </div>
                )}

                {currentMode === EffectMode.Ripple && (
                <div className="space-y-4">
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Wave Amplitude</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.intensity}
                        onChange={(e) => setSettings(p => ({ ...p, intensity: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                    </div>
                    <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Wave Frequency</label>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={settings.resolution}
                        onChange={(e) => setSettings(p => ({ ...p, resolution: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                    </div>
                </div>
                )}
                
                {currentMode === EffectMode.None && (
                    <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-800">
                         <p className="text-xs text-zinc-500 italic text-center">Select an effect to see settings.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-zinc-800 space-y-3">
            <button 
                onClick={onVirtualCamera}
                className="w-full bg-zinc-800 text-emerald-400 border border-zinc-700 font-bold py-3 rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 group text-sm"
            >
                <MonitorUp size={18} className="group-hover:animate-pulse" />
                Virtual Camera
            </button>

            <button 
                onClick={onCapture}
                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-sm"
            >
                <ImageIcon size={18} />
                Capture Frame
            </button>
        </div>
      </div>
    </>
  );
};

export default Controls;