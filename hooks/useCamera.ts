import { useState, useEffect, useRef } from 'react';

export const useCamera = (constraints: MediaStreamConstraints) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamReady, setStreamReady] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // If component unmounted while waiting for permission, stop immediately
        if (!isMounted) {
          newStream.getTracks().forEach(track => track.stop());
          return;
        }

        stream = newStream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Try to play immediately
          try {
            await videoRef.current.play();
            if (isMounted) setStreamReady(true);
          } catch (e) {
            console.warn("Autoplay blocked or failed, waiting for user interaction or metadata", e);
            // Fallback: wait for metadata if play failed immediately
            videoRef.current.onloadedmetadata = async () => {
               if (isMounted) {
                 try {
                   await videoRef.current?.play();
                   setStreamReady(true);
                 } catch (retryError) {
                   console.error("Retry play failed", retryError);
                 }
               }
            };
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error accessing camera:", err);
          setError("Could not access webcam. Please allow permissions.");
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return { videoRef, streamReady, error };
};