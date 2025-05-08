import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LiveStatusProps {
  status: 'normal' | 'warning' | 'danger' | 'loading' | 'error' | 'unknown';
  name: string;
  location: string;
  lastUpdated: string;
  heartRate?: number;
  movement?: 'resting' | 'none' | 'active' | 'sleeping'; // Correctly typing movement prop
  bodyTemperature?: number;
  roomTemperature?: number;
  spo2?: number;
}

const LiveStatus: React.FC<LiveStatusProps> = ({ 
  status, 
  name, 
  location, 
  lastUpdated, 
  heartRate = 0, 
  movement = 'none' 
}) => {
  // Function to determine the status color
  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return 'bg-guardian-secondary';
      case 'warning':
        return 'bg-guardian-warning';
      case 'danger':
        return 'bg-guardian-danger animate-pulse-alert';
      default:
        return 'bg-gray-400';
    }
  };

  // Function to determine the status text
  const getStatusText = () => {
    switch (status) {
      case 'normal':
        return 'Normal Activity';
      case 'warning':
        return 'Unusual Activity';
      case 'danger':
        return 'Fall Detected';
      default:
        return 'Unknown';
    }
  };

  // Function to get the movement icon based on state
  const getMovementIcon = () => {
    switch (movement) {
      case 'active':
        return '🚶‍♂️'; // Walking icon for active
      case 'resting':
        return '🪑'; // Sitting/resting icon
      case 'sleeping':
        return '🛌'; // Sleeping icon
      case 'none':
      default:
        return '❓'; // Unknown movement state
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{name}</CardTitle>
            <CardDescription className="text-sm text-gray-500">{location}</CardDescription>
          </div>
          <div className={`${getStatusColor()} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
            {getStatusText()}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Heart Rate</span>
            <span className="text-xl font-bold">{heartRate} BPM</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Movement</span>
            <span className="text-xl">{getMovementIcon()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Last Updated</span>
            <span className="text-sm">{lastUpdated}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveStatus;
