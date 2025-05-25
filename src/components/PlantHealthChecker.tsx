
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const PlantHealthChecker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setResult('Error accessing camera. Please ensure camera permissions are granted.');
    }
  };

  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    setResult('Analyzing plant health...');

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];

    try {
      const response = await fetch('https://detect.roboflow.com/plantsdetector/1?api_key=eoF3dHN6vYVl7mStkt2I', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: base64Image
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Detection error:', error);
      setResult('Error detecting plant. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        🌱 Plant Health Scanner 🌱
      </h2>
      
      <div className="space-y-6">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            className="w-full max-w-md mx-auto rounded-xl shadow-lg"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <div className="text-center">
          <Button
            onClick={captureAndDetect}
            disabled={isCapturing}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            {isCapturing ? '🔍 Analyzing...' : '📸 Capture & Detect'}
          </Button>
        </div>

        {result && (
          <div className="bg-gray-100 rounded-xl p-4 mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Detection Result:</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-40">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantHealthChecker;
