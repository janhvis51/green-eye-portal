
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import plantCareData from '@/data/plantCareData.json';

interface PlantInfo {
  care: string;
  className: string;
  height: string;
  width: string;
  category: string;
}

const PlantHealthChecker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [result, setResult] = useState<string>('');
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);

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
    setPlantInfo(null);

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
      console.log('API Response:', data);
      
      if (data.predictions && data.predictions.length > 0) {
        const detectedClass = data.predictions[0].class.toLowerCase();
        const plantData = plantCareData[detectedClass as keyof typeof plantCareData];
        
        if (plantData) {
          setPlantInfo(plantData);
          setResult(`Plant detected: ${plantData.className}`);
        } else {
          setResult(`Plant detected: ${detectedClass} (No care information available)`);
        }
      } else {
        setResult('No plant detected in the image. Please try again.');
      }
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
            <p className="text-sm text-gray-700">{result}</p>
          </div>
        )}

        {plantInfo && (
          <div className="bg-green-50 rounded-xl p-6 mt-4 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4">🌿 Plant Information</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Class Name:</span>
                <span className="text-green-700 font-medium">{plantInfo.className}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Height:</span>
                <span className="text-gray-600">{plantInfo.height}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Width:</span>
                <span className="text-gray-600">{plantInfo.width}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Category:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  plantInfo.category === 'healthy' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {plantInfo.category === 'healthy' ? '🌱 Healthy' : '🥀 Unhealthy'}
                </span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-green-200">
                <span className="font-semibold text-gray-700 block mb-2">Care Instructions:</span>
                <p className="text-gray-600 leading-relaxed">{plantInfo.care}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantHealthChecker;
