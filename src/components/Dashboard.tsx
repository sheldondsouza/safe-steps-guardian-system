// import React, { useState, useEffect } from 'react';
// import LiveStatus from './LiveStatus';
// import ActivityChart from './ActivityChart';
// import AlertSystem from './AlertSystem';
// import UserProfile from './UserProfile';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
//       {/* LiveStatus Cards */}
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

// export default Dashboard;