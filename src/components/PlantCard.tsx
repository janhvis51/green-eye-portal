
import React from 'react';
import { cn } from '@/lib/utils';

interface Plant {
  id: number;
  name: string;
  health: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  image: string;
  lastWatered: string;
  nextWatering: string;
}

interface PlantCardProps {
  plant: Plant;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Excellent': return 'text-green-500 bg-green-100';
      case 'Good': return 'text-green-400 bg-green-50';
      case 'Fair': return 'text-yellow-500 bg-yellow-100';
      case 'Poor': return 'text-orange-500 bg-orange-100';
      case 'Critical': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'Excellent': return '🌟';
      case 'Good': return '🌱';
      case 'Fair': return '🌿';
      case 'Poor': return '🍂';
      case 'Critical': return '🥀';
      default: return '🌿';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-green-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{plant.name}</h3>
        <span className="text-2xl">{getHealthIcon(plant.health)}</span>
      </div>
      
      <div className="mb-4">
        <img 
          src={plant.image} 
          alt={plant.name}
          className="w-full h-48 object-cover rounded-xl"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Health Status:</span>
          <span className={cn(
            'px-3 py-1 rounded-full text-sm font-semibold',
            getHealthColor(plant.health)
          )}>
            {plant.health}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Last Watered:</span>
          <span className="text-gray-800">{plant.lastWatered}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Next Watering:</span>
          <span className="text-blue-600 font-semibold">{plant.nextWatering}</span>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
