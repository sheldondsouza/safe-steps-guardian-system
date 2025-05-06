
import React, { useState } from 'react';
import LiveStatus from './LiveStatus';
import ActivityChart from './ActivityChart';
import AlertSystem from './AlertSystem';
import UserProfile from './UserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for demonstration purposes
const activityData = [
  { time: '00:00', movement: 10, fallRisk: 20 },
  { time: '04:00', movement: 5, fallRisk: 15 },
  { time: '08:00', movement: 40, fallRisk: 25 },
  { time: '12:00', movement: 65, fallRisk: 30 },
  { time: '16:00', movement: 50, fallRisk: 40 },
  { time: '20:00', movement: 35, fallRisk: 35 },
  { time: '24:00', movement: 15, fallRisk: 25 },
];

const mockUser = {
  id: '1',
  name: 'Elizabeth Johnson',
  age: 78,
  room: '302',
  medicalConditions: ['Hypertension', 'Arthritis', 'Vision Impairment'],
  fallRiskLevel: 'moderate' as const,
  contactName: 'Michael Johnson (Son)',
  contactPhone: '(555) 123-4567',
};

const mockAlerts = [
  {
    id: '1',
    type: 'fall' as const,
    message: 'Fall detected in bathroom of Room 302',
    timestamp: 'Today, 09:23 AM',
    resolved: false,
    location: 'Room 302 - Bathroom'
  },
  {
    id: '2',
    type: 'inactivity' as const,
    message: 'Unusual inactivity detected for over 3 hours',
    timestamp: 'Today, 08:15 AM',
    resolved: true,
    location: 'Room 302 - Bedroom'
  },
  {
    id: '3',
    type: 'irregularMovement' as const,
    message: 'Irregular movement pattern detected',
    timestamp: 'Yesterday, 10:45 PM',
    resolved: true,
    location: 'Room 302 - Living Room'
  },
  {
    id: '4',
    type: 'systemAlert' as const,
    message: 'Motion sensor battery low (15%)',
    timestamp: 'Yesterday, 06:30 PM',
    resolved: false,
    location: 'Room 302 - Kitchen'
  }
];

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <LiveStatus 
          status="normal"
          name="Elizabeth Johnson"
          location="Room 302"
          lastUpdated="2 min ago"
          heartRate={72}
          movement="active"
        />
        <LiveStatus 
          status="warning"
          name="Robert Davis"
          location="Room 204"
          lastUpdated="5 min ago"
          heartRate={85}
          movement="resting"
        />
        <LiveStatus 
          status="danger"
          name="Margaret Wilson"
          location="Room 118"
          lastUpdated="1 min ago"
          heartRate={95}
          movement="none"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <Tabs defaultValue="activity" className="mb-6">
            <TabsList>
              <TabsTrigger value="activity">Activity Monitoring</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
            <TabsContent value="activity">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Activity Monitoring</h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setPeriod('day')}
                      className={`px-3 py-1 text-sm rounded-md ${period === 'day' ? 'bg-guardian-primary text-white' : 'bg-gray-100'}`}
                    >
                      Day
                    </button>
                    <button 
                      onClick={() => setPeriod('week')}
                      className={`px-3 py-1 text-sm rounded-md ${period === 'week' ? 'bg-guardian-primary text-white' : 'bg-gray-100'}`}
                    >
                      Week
                    </button>
                    <button 
                      onClick={() => setPeriod('month')}
                      className={`px-3 py-1 text-sm rounded-md ${period === 'month' ? 'bg-guardian-primary text-white' : 'bg-gray-100'}`}
                    >
                      Month
                    </button>
                  </div>
                </div>
                <ActivityChart 
                  data={activityData} 
                  title="Movement & Fall Risk Analysis" 
                  period={period}
                />
              </div>
            </TabsContent>
            <TabsContent value="alerts">
              <AlertSystem alerts={mockAlerts} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <UserProfile user={mockUser} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
