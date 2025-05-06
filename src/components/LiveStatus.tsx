
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LiveStatusProps {
  status: 'normal' | 'warning' | 'danger' | 'offline';
  name: string;
  location: string;
  lastUpdated: string;
  heartRate?: number;
  movement?: 'active' | 'resting' | 'sleeping' | 'none';
}

const LiveStatus: React.FC<LiveStatusProps> = ({ 
  status, 
  name, 
  location, 
  lastUpdated, 
  heartRate = 0, 
  movement = 'none' 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return 'bg-guardian-secondary';
      case 'warning':
        return 'bg-guardian-warning';
      case 'danger':
        return 'bg-guardian-danger animate-pulse-alert';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'normal':
        return 'Normal Activity';
      case 'warning':
        return 'Unusual Activity';
      case 'danger':
        return 'Fall Detected';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const getMovementIcon = () => {
    switch (movement) {
      case 'active':
        return '🚶';
      case 'resting':
        return '🪑';
      case 'sleeping':
        return '🛌';
      case 'none':
      default:
        return '❓';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{location}</CardDescription>
          </div>
          <div className={`${getStatusColor()} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
            {getStatusText()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
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
