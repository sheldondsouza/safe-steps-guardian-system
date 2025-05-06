
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Alert {
  id: string;
  type: 'fall' | 'inactivity' | 'irregularMovement' | 'systemAlert';
  message: string;
  timestamp: string;
  resolved: boolean;
  location: string;
}

interface AlertSystemProps {
  alerts: Alert[];
}

const AlertSystem: React.FC<AlertSystemProps> = ({ alerts }) => {
  const getAlertTypeStyles = (type: Alert['type']) => {
    switch (type) {
      case 'fall':
        return 'bg-guardian-danger text-white';
      case 'inactivity':
        return 'bg-guardian-warning text-black';
      case 'irregularMovement':
        return 'bg-guardian-info text-white';
      case 'systemAlert':
        return 'bg-guardian-dark text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getAlertTypeText = (type: Alert['type']) => {
    switch (type) {
      case 'fall':
        return 'Fall Detected';
      case 'inactivity':
        return 'Inactivity';
      case 'irregularMovement':
        return 'Irregular Movement';
      case 'systemAlert':
        return 'System Alert';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle>Alert System</CardTitle>
        <CardDescription>Real-time monitoring and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[480px] pr-4">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 border rounded-md ${alert.resolved ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getAlertTypeStyles(alert.type)}>
                    {getAlertTypeText(alert.type)}
                  </Badge>
                  <span className="text-xs text-gray-500">{alert.timestamp}</span>
                </div>
                <p className="text-sm mb-1">{alert.message}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{alert.location}</span>
                  {alert.resolved ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Resolved
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 animate-pulse">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertSystem;
