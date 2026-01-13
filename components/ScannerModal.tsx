
import React, { useRef, useEffect } from 'react';

interface ScannerModalProps {
  onClose: () => void;
  onScan: (code: string) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
    setupCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full relative">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-lg">📦 Nexus IoT Scanner</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">✕</button>
        </div>
        <div className="aspect-square bg-slate-950 relative">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale opacity-50" />
          <div className="absolute inset-0 border-2 border-emerald-500/50 m-12 rounded-xl flex items-center justify-center">
            <div className="w-full h-0.5 bg-emerald-500 animate-pulse" />
          </div>
          <p className="absolute bottom-6 left-0 right-0 text-center text-white/70 text-sm italic">
            Align barcode within frame...
          </p>
        </div>
        <div className="p-6">
          <button 
            onClick={() => onScan('SCANNED-ITEM-001')}
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition-all"
          >
            Simulate Decode Result
          </button>
        </div>
      </div>
    </div>
  );
};
