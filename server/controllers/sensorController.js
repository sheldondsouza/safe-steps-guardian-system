
// Mock database for demonstration purposes
const sensorData = [
  {
    id: 1,
    location: 'Bedroom',
    status: 'normal',
    batteryLevel: 85,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    location: 'Bathroom',
    status: 'normal',
    batteryLevel: 72,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 3,
    location: 'Living Room',
    status: 'alert',
    batteryLevel: 63,
    lastUpdated: new Date().toISOString()
  }
];

// Generate mock activity data for the past week
const generateMockActivityData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    
    data.push({
      time: time.toISOString(),
      movement: Math.floor(Math.random() * 10),
      fallRisk: Math.floor(Math.random() * 10)
    });
  }
  
  return data;
};

// Get all sensor data
exports.getSensorData = (req, res) => {
  res.status(200).json(sensorData);
};

// Get recent activity from sensors
exports.getRecentActivity = (req, res) => {
  const period = req.query.period || 'day';
  const activityData = generateMockActivityData();
  res.status(200).json(activityData);
};

// Update sensor status (for IoT devices to push data)
exports.updateSensorStatus = (req, res) => {
  const { sensorId, status, movement, batteryLevel } = req.body;
  
  // Find the sensor to update
  const sensorIndex = sensorData.findIndex(s => s.id === sensorId);
  
  if (sensorIndex === -1) {
    return res.status(404).json({
      error: 'Sensor not found',
      message: `No sensor found with ID ${sensorId}`
    });
  }
  
  // Update sensor data
  sensorData[sensorIndex] = {
    ...sensorData[sensorIndex],
    status,
    batteryLevel: batteryLevel || sensorData[sensorIndex].batteryLevel,
    lastUpdated: new Date().toISOString()
  };
  
  // Check if this is a fall alert
  const isFallAlert = status === 'alert' && movement && movement > 8;
  
  if (isFallAlert) {
    // In a real application, this would trigger notifications
    console.log(`FALL ALERT: High movement detected in ${sensorData[sensorIndex].location}`);
  }
  
  res.status(200).json({
    message: 'Sensor data updated successfully',
    sensor: sensorData[sensorIndex]
  });
};
