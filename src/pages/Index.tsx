
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PlantCard from '@/components/PlantCard';
import PlantHealthChecker from '@/components/PlantHealthChecker';
import plantsData from '@/data/plants.json';

interface Plant {
  id: number;
  name: string;
  health: string;
  image: string;
  lastWatered: string;
  nextWatering: string;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'plants' | 'scanner'>('home');
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    setPlants(plantsData as Plant[]);
  }, []);

  const renderHomeSection = () => (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-white drop-shadow-2xl">
          🌿 Plant Care Portal 🌿
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Monitor your plants health and wellbeing with our advanced care system
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        <Button
          onClick={() => setActiveSection('plants')}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          🌱 View My Plants
        </Button>
        <Button
          onClick={() => setActiveSection('scanner')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-xl font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          📸 Health Scanner
        </Button>
      </div>
    </div>
  );

  const renderPlantsSection = () => (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-slide-in">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white drop-shadow-lg">
          🌿 Your Plant Collection 🌿
        </h2>
        <p className="text-lg text-white/90">
          Track the health and care schedule of all your plants
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={() => setActiveSection('home')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 text-lg rounded-xl transition-all duration-300"
        >
          🏠 Back to Home
        </Button>
      </div>
    </div>
  );

  const renderScannerSection = () => (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-in">
      <PlantHealthChecker />
      <div className="text-center">
        <Button
          onClick={() => setActiveSection('home')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 text-lg rounded-xl transition-all duration-300"
        >
          🏠 Back to Home
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black/20" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&h=900&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 w-full flex items-center justify-center min-h-screen py-8">
          {activeSection === 'home' && renderHomeSection()}
          {activeSection === 'plants' && renderPlantsSection()}
          {activeSection === 'scanner' && renderScannerSection()}
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
        }
      `}</style>
    </>
  );
};

export default Index;
