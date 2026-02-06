import React, { useEffect, useRef, useState } from 'react';
import { useCamera } from './hooks/useCamera';
import Controls from './components/Controls';
import { EffectMode, EffectSettings, DEFAULT_SETTINGS } from './types';
import { renderEffect } from './services/effectRenderer';

const App: React.FC = () => {
  const { videoRef, streamReady, error } = useCamera({
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      facingMode: 'user',
    },
    audio: false,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pipVideoRef = useRef<HTMLVideoElement | null>(null);
  const popupWindowRef = useRef<Window | null>(null); 
  const animationRef = useRef<number>(0);
  
  const [mode, setMode] = useState<EffectMode>(EffectMode.Ascii);
  const [settings, setSettings] = useState<EffectSettings>(DEFAULT_SETTINGS);

  const draw = () => {
    if (!videoRef.current || !canvasRef.current || !streamReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.videoWidth === 0 || video.videoHeight === 0) {
       animationRef.current = requestAnimationFrame(draw);
       return;
    }

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    if (ctx) {
      renderEffect(ctx, video, mode, settings, canvas.width, canvas.height);
    }

    animationRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    if (streamReady) {
      animationRef.current = requestAnimationFrame(draw);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (popupWindowRef.current && !popupWindowRef.current.closed) {
        popupWindowRef.current.close();
      }
    };
  }, [streamReady, mode, settings]);

  const handleCapture = () => {
    if (canvasRef.current) {
        const link = document.createElement('a');
        link.download = `webstudio_${mode}_${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    }
  };

  const handleVirtualCamera = async () => {
    if (!canvasRef.current) return;

    if (popupWindowRef.current && !popupWindowRef.current.closed) {
        popupWindowRef.current.close();
        popupWindowRef.current = null;
        return;
    }

    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        return;
    }

    let stream: MediaStream;
    try {
       // @ts-ignore
       stream = canvasRef.current.captureStream(30);
    } catch (e) {
       alert("Capture stream failed.");
       return;
    }

    const pipVideo = pipVideoRef.current;

    const openPopupFallback = () => {
        const width = canvasRef.current?.width || 800;
        const height = canvasRef.current?.height || 600;
        
        const win = window.open('', 'WebStudioVirtualCam', `width=${width},height=${height},menubar=no,toolbar=no,location=no,status=no`);
        
        if (!win) {
            alert("Please allow popups to use the Virtual Camera feature.");
            return;
        }

        popupWindowRef.current = win;
        
        win.document.title = "WebStudio - Virtual Camera Output";
        win.document.body.style.margin = '0';
        win.document.body.style.background = '#000';
        win.document.body.style.height = '100vh';
        win.document.body.style.overflow = 'hidden';
        win.document.body.style.display = 'flex';
        win.document.body.style.alignItems = 'center';
        win.document.body.style.justifyContent = 'center';
        
        const winVideo = win.document.createElement('video');
        winVideo.srcObject = stream;
        winVideo.autoplay = true;
        winVideo.muted = true;
        winVideo.playsInline = true;
        winVideo.style.width = '100%';
        winVideo.style.height = '100%';
        winVideo.style.objectFit = 'contain';
        
        win.document.body.appendChild(winVideo);

        win.onbeforeunload = () => {
            popupWindowRef.current = null;
        };
    };

    try {
        const isPipSupported = 
            'pictureInPictureEnabled' in document && 
            document.pictureInPictureEnabled &&
            pipVideo && 
            typeof pipVideo.requestPictureInPicture === 'function';

        if (!isPipSupported) {
             throw new Error("PiP not supported");
        }
        
        if (pipVideo) {
            pipVideo.srcObject = stream;
            await pipVideo.play();
            await pipVideo.requestPictureInPicture();
        }

    } catch (e) {
        openPopupFallback();
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden">
      <video ref={videoRef} className="hidden" playsInline muted autoPlay />
      
      <video ref={pipVideoRef} className="hidden" playsInline muted autoPlay />

      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 p-4">
        {error ? (
          <div className="text-red-500 bg-red-900/20 p-6 rounded-lg border border-red-900">
            {error}
          </div>
        ) : (
          <div className="relative shadow-2xl shadow-black rounded-lg overflow-hidden border border-zinc-800">
             {!streamReady && (
                 <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-zinc-500 z-10">
                     <span className="animate-pulse">Initializing Camera...</span>
                 </div>
             )}
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[80vh] w-auto h-auto block"
            />
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 text-xs text-zinc-600 font-mono pointer-events-none">
            {streamReady ? 'STREAM: ACTIVE' : 'STREAM: CONNECTING...'}
        </div>
      </div>

      <Controls 
        currentMode={mode}
        setMode={setMode}
        settings={settings}
        setSettings={setSettings}
        onCapture={handleCapture}
        onVirtualCamera={handleVirtualCamera}
      />
    </div>
  );
};

export default App;