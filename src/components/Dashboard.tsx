// import React, { useState, useEffect } from 'react';
// import LiveStatus from './LiveStatus';
// import ActivityChart from './ActivityChart';
// import AlertSystem from './AlertSystem';
// import UserProfile from './UserProfile';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useEffect } from 'react';
import LiveStatus from './LiveStatus';
import ActivityChart from './ActivityChart';
import AlertSystem from './AlertSystem';
import UserProfile from './UserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { database } from "c:/Users/SheldonDsouza/OneDrive/Desktop/code command/safe-steps-guardian-system/src/firebaseconfig";
import { ref, onValue } from "C:/Users/SheldonDsouza/OneDrive/Desktop/code command/safe-steps-guardian-system/server/node_modules/@firebase/database";

// Define types for the health data structure from RTDB
interface HealthData {
  bodyTemperature?: number;
  fallDetected?: boolean;
  heartRate?: number;
  roomTemperature?: number;
  spo2?: number;
}

interface MotionData {
  accelerationX?: number;
  accelerationY?: number;
  accelerationZ?: number;
  totalAcceleration?: number;
  gyroX?: number;
  gyroY?: number;
  gyroZ?: number;
  currentPosture?: string;
  fallDetected?: boolean;
  temperature?: number;
}

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

const mockUsers = {
  elizabeth: {
    id: '1',
    name: 'Elizabeth Johnson',
    age: 78,
    room: '302',
    medicalConditions: ['Hypertension', 'Arthritis', 'Vision Impairment'],
    fallRiskLevel: 'moderate' as const,
    contactName: 'Michael Johnson (Son)',
    contactPhone: '(555) 123-4567',
    movement: "resting"
  },
  robert: {
    id: '2',
    name: 'Robert Davis',
    location: 'Room 204',
    lastUpdated: "5 min ago",
    heartRate: 85,
    movement: "resting",
  },
  margaret: {
    id: '3',
    name: 'Margaret Wilson',
    location: 'Room 118',
    lastUpdated: "1 min ago",
    heartRate: 95,
    movement: "none",
  }
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

// Status type for the LiveStatus component
type StatusType = 'normal' | 'warning' | 'danger' | 'loading' | 'error' | 'unknown';

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  
  // State for Elizabeth's health data
  const [elizabethData, setElizabethData] = useState<HealthData | null>(null);
  const [motionData, setMotionData] = useState<MotionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Effect hook to listen for real-time health data updates
  useEffect(() => {
    // Reference to the health data in Firebase
    const healthDataRef = ref(database, 'healthData/current');
    
    // Set up the listener
    const unsubscribe = onValue(healthDataRef, (snapshot) => {
      const data = snapshot.val() as HealthData | null;
      setElizabethData(data);
      console.log("Health data updated:", data);
    }, (error) => {
      setError(error);
      console.error("Error fetching health data:", error);
    });
    
    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Effect hook to listen for real-time motion data updates
  useEffect(() => {
    // Reference to the motion data in Firebase
    const motionDataRef = ref(database, 'healthData');
    
    // Set up the listener
    const unsubscribe = onValue(motionDataRef, (snapshot) => {
      setLoading(false);
      const data = snapshot.val();
      
      if (data) {
        // Extract motion data
        const motionData: MotionData = {
          accelerationX: data.accelerationX,
          accelerationY: data.accelerationY,
          accelerationZ: data.accelerationZ,
          totalAcceleration: data.totalAcceleration,
          gyroX: data.gyroX,
          gyroY: data.gyroY,
          gyroZ: data.gyroZ,
          currentPosture: data.currentPosture,
          fallDetected: data.fallDetected,
          temperature: data.temperature
        };
        
        setMotionData(motionData);
        console.log("Motion data updated:", motionData);
      }
    }, (error) => {
      setLoading(false);
      setError(error);
      console.error("Error fetching motion data:", error);
    });
    
    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);
  
  // Helper function to determine status based on health data
  const getElizabethStatus = (): StatusType => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (!elizabethData && !motionData) return 'unknown';
    
    // Check for critical conditions - prioritize fall detection from either data source
    if ((elizabethData?.fallDetected) || (motionData?.fallDetected)) return 'danger';
    
    // Check for warning conditions
    if (
      (elizabethData?.heartRate && elizabethData.heartRate > 90) ||
      (elizabethData?.spo2 && elizabethData.spo2 < 95) ||
      (elizabethData?.bodyTemperature && (elizabethData.bodyTemperature < 36 || elizabethData.bodyTemperature > 38)) ||
      (motionData?.currentPosture === "FALLEN")
    ) {
      return 'warning';
    }
    
    return 'normal';
  };
  
  // Helper function to determine movement state based on posture and acceleration data
  const getElizabethMovement = (): "resting" | "none" | "active" | "sleeping" => {
    if (!motionData) return 'resting';
    
    // Check for fall detection
    if (motionData.fallDetected) return 'none';
    
    // Check posture
    if (motionData.currentPosture === "STANDING") {
      // Check if there's significant acceleration indicating movement
      const totalAccel = motionData.totalAcceleration || 0;
      if (totalAccel > 10) return 'active';
      return 'active';
    } else if (motionData.currentPosture === "SITTING") {
      return 'resting';
    } else if (motionData.currentPosture === "LYING") {
      return 'sleeping';
    }
    
    return 'resting'; // Default
  };
  
  // Helper function to determine last updated time
  const getLastUpdated = (): string => {
    if (loading) return 'Loading...';
    if (error) return 'Error fetching data';
    if (!elizabethData && !motionData) return 'No data available';
    return 'Just now'; // In a real app, you'd calculate this from a timestamp
  };

  // Helper function to get combined health and motion data
  const getCombinedData = () => {
    return {
      ...elizabethData,
      currentPosture: motionData?.currentPosture,
      accelerationX: motionData?.accelerationX,
      accelerationY: motionData?.accelerationY,
      accelerationZ: motionData?.accelerationZ,
      totalAcceleration: motionData?.totalAcceleration,
      gyroX: motionData?.gyroX,
      gyroY: motionData?.gyroY,
      gyroZ: motionData?.gyroZ
    };
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Elizabeth's LiveStatus with real-time data */}
        <LiveStatus 
          status={getElizabethStatus()}
          name={mockUsers.elizabeth.name}
          location={mockUsers.elizabeth.room}
          lastUpdated={getLastUpdated()}
          heartRate={elizabethData?.heartRate}
          movement={getElizabethMovement()}
          bodyTemperature={elizabethData?.bodyTemperature}
          roomTemperature={elizabethData?.roomTemperature}
          spo2={elizabethData?.spo2}
          currentPosture={motionData?.currentPosture}
          acceleration={motionData?.totalAcceleration}
        />
        
        {/* Other users still using mock data */}
        <LiveStatus 
          status="warning"
          name={mockUsers.robert.name}
          location={mockUsers.robert.location}
          lastUpdated={mockUsers.robert.lastUpdated}
          heartRate={mockUsers.robert.heartRate}
          movement={mockUsers.robert.movement}
        />
        
        <LiveStatus 
          status="danger"
          name={mockUsers.margaret.name}
          location={mockUsers.margaret.location}
          lastUpdated={mockUsers.margaret.lastUpdated}
          heartRate={mockUsers.margaret.heartRate}
          movement={mockUsers.margaret.movement}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <Tabs defaultValue="activity" className="mb-6">
            <TabsList>
              <TabsTrigger value="activity">Activity Monitoring</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="motionData">Motion Details</TabsTrigger>
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
            <TabsContent value="motionData">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Motion Sensor Data</h2>
                {loading ? (
                  <p>Loading motion data...</p>
                ) : error ? (
                  <p className="text-red-500">Error loading motion data</p>
                ) : !motionData ? (
                  <p>No motion data available</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-md">
                      <h3 className="font-medium mb-2">Current Posture</h3>
                      <p className="text-lg font-bold">{motionData.currentPosture || 'Unknown'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <h3 className="font-medium mb-2">Fall Detection</h3>
                      <p className={`text-lg font-bold ${motionData.fallDetected ? 'text-red-500' : 'text-green-500'}`}>
                        {motionData.fallDetected ? 'DETECTED' : 'Not Detected'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <h3 className="font-medium mb-2">Acceleration (m/s²)</h3>
                      <p>X: {motionData.accelerationX?.toFixed(2) || 'N/A'}</p>
                      <p>Y: {motionData.accelerationY?.toFixed(2) || 'N/A'}</p>
                      <p>Z: {motionData.accelerationZ?.toFixed(2) || 'N/A'}</p>
                      <p className="font-bold mt-1">Total: {motionData.totalAcceleration?.toFixed(2) || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <h3 className="font-medium mb-2">Gyroscope (rad/s)</h3>
                      <p>X: {motionData.gyroX?.toFixed(2) || 'N/A'}</p>
                      <p>Y: {motionData.gyroY?.toFixed(2) || 'N/A'}</p>
                      <p>Z: {motionData.gyroZ?.toFixed(2) || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <UserProfile user={mockUsers.elizabeth} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;













/*import React, { useState, useEffect } from 'react';
import LiveStatus from './LiveStatus';
import ActivityChart from './ActivityChart';
import AlertSystem from './AlertSystem';
import UserProfile from './UserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { database } from "c:/Users/SheldonDsouza/OneDrive/Desktop/code command/safe-steps-guardian-system/src/firebaseconfig"
;
import { ref, onValue } from "C:/Users/SheldonDsouza/OneDrive/Desktop/code command/safe-steps-guardian-system/server/node_modules/@firebase/database";

// Define a type for the health data structure from RTDB
interface HealthData {
  bodyTemperature?: number;
  fallDetected?: boolean;
  heartRate?: number;
  roomTemperature?: number;
  spo2?: number;
  // Add other fields if they exist in your database
}

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

const mockUsers = {
  elizabeth: {
    id: '1',
    name: 'Elizabeth Johnson',
    age: 78,
    room: '302',
    medicalConditions: ['Hypertension', 'Arthritis', 'Vision Impairment'],
    fallRiskLevel: 'moderate' as const,
    contactName: 'Michael Johnson (Son)',
    contactPhone: '(555) 123-4567',
    movement:"resting"
  },
  robert: {
    id: '2',
    name: 'Robert Davis',
    location: 'Room 204',
    lastUpdated: "5 min ago",
    heartRate: 85,
    movement: "resting",
  },
  margaret: {
    id: '3',
    name: 'Margaret Wilson',
    location: 'Room 118',
    lastUpdated: "1 min ago",
    heartRate: 95,
    movement: "none",
  }
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

// Status type for the LiveStatus component
type StatusType = 'normal' | 'warning' | 'danger' | 'loading' | 'error' | 'unknown';

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  
  // State for Elizabeth's health data
  const [elizabethData, setElizabethData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Effect hook to listen for real-time data updates
  useEffect(() => {
    // Reference to the health data in Firebase
    const healthDataRef = ref(database, 'healthData/current');
    
    // Set up the listener
    const unsubscribe = onValue(healthDataRef, (snapshot) => {
      setLoading(false);
      const data = snapshot.val() as HealthData | null;
      setElizabethData(data);
      console.log("Real-time data updated:", data);
    }, (error) => {
      setLoading(false);
      setError(error);
      console.error("Error fetching real-time data:", error);
    });
    
    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);
  
  // Helper function to determine status based on health data
  const getElizabethStatus = (): StatusType => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (!elizabethData) return 'unknown';
    
    // Check for critical conditions
    if (elizabethData.fallDetected) return 'danger';
    
    // Check for warning conditions
    if (
      (elizabethData.heartRate && elizabethData.heartRate > 90) ||
      (elizabethData.spo2 && elizabethData.spo2 < 95) ||
      (elizabethData.bodyTemperature && (elizabethData.bodyTemperature < 36 || elizabethData.bodyTemperature > 38))
    ) {
      return 'warning';
    }
    
    return 'normal';
  };
  
  // Helper function to determine movement state
// Helper function to determine movement state
const getElizabethMovement = (): "resting" | "none" | "active" | "sleeping" => {
  if (elizabethData?.fallDetected) return 'none'; // Assume 'none' means no movement due to fall detection.
  // Add more logic here for other movement states based on your health data.
  return 'active'; // Default state
};

  
  // Helper function to determine last updated time
  const getLastUpdated = (): string => {
    if (loading) return 'Loading...';
    if (error) return 'Error fetching data';
    if (!elizabethData) return 'No data available';
    return 'Just now'; // In a real app, you'd calculate this from a timestamp
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Elizabeth's LiveStatus with real-time data *//*}/*
      /*  <LiveStatus 
          status={getElizabethStatus()}
          name={mockUsers.elizabeth.name}
          location={mockUsers.elizabeth.room}
          lastUpdated={getLastUpdated()}
          heartRate={elizabethData?.heartRate}
          movement={getElizabethMovement()}
          bodyTemperature={elizabethData?.bodyTemperature}
          roomTemperature={elizabethData?.roomTemperature}
          spo2={elizabethData?.spo2}
        />
        
        {/* Other users still using mock data *//*}/*
      /*  <LiveStatus 
          status="warning"
          name={mockUsers.robert.name}
          location={mockUsers.robert.location}
          lastUpdated={mockUsers.robert.lastUpdated}
          heartRate={mockUsers.robert.heartRate}
          movement={mockUsers.robert.movement}
        />
        
        <LiveStatus 
          status="danger"
          name={mockUsers.margaret.name}
          location={mockUsers.margaret.location}
          lastUpdated={mockUsers.margaret.lastUpdated}
          heartRate={mockUsers.margaret.heartRate}
          movement={mockUsers.margaret.movement}
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
          <UserProfile user={mockUsers.elizabeth} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;*/












































/*import React, { useState } from 'react';
import LiveStatus from './LiveStatus';
import ActivityChart from './ActivityChart';
import AlertSystem from './AlertSystem';
import UserProfile from './UserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// // For Firebase v9 compatibility, use these imports:
// //import { ref, onValue, off, Database } from '../';
// import { db } from '../firebaseconfig'; // Ensure this exports the database object correctly

// // Define a type for the current health data structure
// interface HealthData {
//   bodyTemperature?: number;
//   fallDetected?: boolean;
//   heartRate?: number;
//   roomTemperature?: number;
//   spo2?: number;
// }

// // Status type for LiveStatus component
// type StatusType = "normal" | "warning" | "danger" | "loading" | "error" | "unknown";

// // Mock Data
// const activityData = [
//   { time: '00:00', movement: 10, fallRisk: 20 },
//   { time: '04:00', movement: 5, fallRisk: 15 },
//   { time: '08:00', movement: 40, fallRisk: 25 },
//   { time: '12:00', movement: 65, fallRisk: 30 },
//   { time: '16:00', movement: 50, fallRisk: 40 },
//   { time: '20:00', movement: 35, fallRisk: 35 },
//   { time: '24:00', movement: 15, fallRisk: 25 },
// ];

// const mockUserElizabeth = {
//   id: '1',
//   name: 'Elizabeth Johnson',
//   age: 78,
//   room: '302',
//   medicalConditions: ['Hypertension', 'Arthritis', 'Vision Impairment'],
//   fallRiskLevel: 'moderate' as const,
//   contactName: 'Michael Johnson (Son)',
//   contactPhone: '(555) 123-4567',
// };

// const mockUserRobert = {
//   id: '2',
//   name: 'Robert Davis',
//   location: 'Room 204',
//   lastUpdated: "5 min ago",
//   heartRate: 85,
//   movement: "resting",
//   status: "warning" as StatusType,
// };

// const mockUserMargaret = {
//   id: '3',
//   name: 'Margaret Wilson',
//   location: 'Room 118',
//   lastUpdated: "1 min ago",
//   heartRate: 95,
//   movement: "none",
//   status: "danger" as StatusType,
// };

// const mockAlerts = [
//   {
//     id: '1',
//     type: 'fall' as const,
//     message: 'Fall detected in bathroom of Room 302',
//     timestamp: 'Today, 09:23 AM',
//     resolved: false,
//     location: 'Room 302 - Bathroom'
//   },
//   {
//     id: '2',
//     type: 'inactivity' as const,
//     message: 'Unusual inactivity detected for over 3 hours',
//     timestamp: 'Today, 08:15 AM',
//     resolved: true,
//     location: 'Room 302 - Bedroom'
//   },
//   {
//     id: '3',
//     type: 'irregularMovement' as const,
//     message: 'Irregular movement pattern detected',
//     timestamp: 'Yesterday, 10:45 PM',
//     resolved: true,
//     location: 'Room 302 - Living Room'
//   },
//   {
//     id: '4',
//     type: 'systemAlert' as const,
//     message: 'Motion sensor battery low (15%)',
//     timestamp: 'Yesterday, 06:30 PM',
//     resolved: false,
//     location: 'Room 302 - Kitchen'
//   }
// ];

// const Dashboard: React.FC = () => {
//   // State for controlling the period selection in the Activity Monitoring tab
//   const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');

//   // State for Elizabeth's health data
//   const [currentElizabethHealthData, setCurrentElizabethHealthData] = useState<HealthData | null>(null);
//   const [loadingElizabethHealthData, setLoadingElizabethHealthData] = useState(true);
//   const [elizabethHealthDataError, setElizabethHealthDataError] = useState<Error | null>(null);

//   // Effect to set up Firebase Realtime Database listener
//   useEffect(() => {
//     // Use Firebase v9 syntax
//     const elizabethDataRef = ref(db, 'healthData/current');

//     // Set up the listener
//     const unsubscribe = onValue(
//       elizabethDataRef,
//       (snapshot) => {
//         setLoadingElizabethHealthData(false);
//         const data: HealthData | null = snapshot.val();
//         setCurrentElizabethHealthData(data);
//         console.log("Real-time data updated for Elizabeth:", data);
//       },
//       (error) => {
//         setLoadingElizabethHealthData(false);
//         setElizabethHealthDataError(error);
//         console.error("Error fetching Elizabeth's real-time data: ", error);
//         setCurrentElizabethHealthData(null);
//       }
//     );

//     // Cleanup function
//     return () => {
//       // In Firebase v9, unsubscribe is the function returned by onValue
//       unsubscribe();
//       console.log("Elizabeth data listener detached.");
//     };
//   }, []);

//   // Helper function to determine status
//   const getElizabethStatus = (
//     data: HealthData | null, 
//     loading: boolean, 
//     error: Error | null
//   ): StatusType => {
//     if (loading) return "loading";
//     if (error) return "error";

//     if (!data) return "unknown";

//     if (data.fallDetected === true) return "danger";
    
//     if (
//       (data.heartRate !== undefined && data.heartRate > 90) || 
//       (data.spo2 !== undefined && data.spo2 < 95)
//     ) return "warning";

//     return "normal";
//   };

//   // Helper function for movement description
//   const getElizabethMovement = (data: HealthData | null): string => {
//     if (data?.fallDetected === true) return "Fall Detected!";
//     return "Active";
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       {/* LiveStatus Cards */
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         {/* Elizabeth's LiveStatus */}
//         <LiveStatus
//           status={getElizabethStatus(currentElizabethHealthData, loadingElizabethHealthData, elizabethHealthDataError)}
//           name={mockUserElizabeth.name}
//           location={mockUserElizabeth.room}
//           lastUpdated={
//             loadingElizabethHealthData ? "Loading..." :
//             elizabethHealthDataError ? "Error" :
//             (currentElizabethHealthData ? "Just now" : "No data")
//           }
//           heartRate={currentElizabethHealthData?.heartRate}
//           movement={getElizabethMovement(currentElizabethHealthData)}
//           bodyTemperature={currentElizabethHealthData?.bodyTemperature}
//           roomTemperature={currentElizabethHealthData?.roomTemperature}
//           spo2={currentElizabethHealthData?.spo2}
//         />

//         {/* Other residents - Mock data */}
//         <LiveStatus
//           status={mockUserRobert.status}
//           name={mockUserRobert.name}
//           location={mockUserRobert.location}
//           lastUpdated={mockUserRobert.lastUpdated}
//           heartRate={mockUserRobert.heartRate}
//           movement={mockUserRobert.movement}
//         />
        
//         <LiveStatus
//           status={mockUserMargaret.status}
//           name={mockUserMargaret.name}
//           location={mockUserMargaret.location}
//           lastUpdated={mockUserMargaret.lastUpdated}
//           heartRate={mockUserMargaret.heartRate}
//           movement={mockUserMargaret.movement}
//         />
//       </div>

//       {/* Activity and Alerts Tabs */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="col-span-2">
//           <Tabs defaultValue="activity" className="mb-6">
//             <TabsList>
//               <TabsTrigger value="activity">Activity Monitoring</TabsTrigger>
//               <TabsTrigger value="alerts">Alerts</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="activity">
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-xl font-bold">Activity Monitoring</h2>
                  
//                   {/* Period selection buttons */}
//                   <div className="flex space-x-2">
//                     {(['day', 'week', 'month'] as const).map((p) => (
//                       <button
//                         key={p}
//                         onClick={() => setPeriod(p)}
//                         className={`px-3 py-1 text-sm rounded-md ${
//                           period === p ? 'bg-guardian-primary text-white' : 'bg-gray-100'
//                         }`}
//                       >
//                         {p.charAt(0).toUpperCase() + p.slice(1)}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* Activity Chart */}
//                 <ActivityChart
//                   data={activityData}
//                   title="Movement & Fall Risk Analysis"
//                   period={period}
//                 />
//               </div>
//             </TabsContent>

//             <TabsContent value="alerts">
//               <AlertSystem alerts={mockAlerts} />
//             </TabsContent>
//           </Tabs>
//         </div>
        
//         {/* User Profile (assuming this would be on the right side) */}
//         <div className="col-span-1">
//           <UserProfile user={mockUserElizabeth} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;*/