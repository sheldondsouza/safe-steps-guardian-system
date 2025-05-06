
// Mock alerts database
let alerts = [
  {
    id: '1',
    timestamp: '2025-05-05T10:15:00Z',
    type: 'fall_risk',
    location: 'Bathroom',
    status: 'active',
    details: 'Unusual movement pattern detected'
  },
  {
    id: '2',
    timestamp: '2025-05-05T08:30:00Z',
    type: 'inactivity',
    location: 'Bedroom',
    status: 'resolved',
    details: 'No movement detected for 4 hours'
  },
  {
    id: '3',
    timestamp: '2025-05-04T22:45:00Z',
    type: 'fall_detected',
    location: 'Kitchen',
    status: 'resolved',
    details: 'Sudden movement followed by inactivity'
  }
];

// Get all alerts with optional filtering
exports.getAlerts = (req, res) => {
  const { status, type, fromDate, toDate } = req.query;
  let filteredAlerts = [...alerts];
  
  if (status) {
    filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
  }
  
  if (type) {
    filteredAlerts = filteredAlerts.filter(alert => alert.type === type);
  }
  
  if (fromDate) {
    const fromDateTime = new Date(fromDate).getTime();
    filteredAlerts = filteredAlerts.filter(alert => {
      const alertTime = new Date(alert.timestamp).getTime();
      return alertTime >= fromDateTime;
    });
  }
  
  if (toDate) {
    const toDateTime = new Date(toDate).getTime();
    filteredAlerts = filteredAlerts.filter(alert => {
      const alertTime = new Date(alert.timestamp).getTime();
      return alertTime <= toDateTime;
    });
  }
  
  res.status(200).json(filteredAlerts);
};

// Create a new alert
exports.createAlert = (req, res) => {
  const { type, location, details } = req.body;
  
  if (!type || !location) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Type and location are required fields'
    });
  }
  
  const newAlert = {
    id: (alerts.length + 1).toString(),
    timestamp: new Date().toISOString(),
    type,
    location,
    status: 'active',
    details: details || ''
  };
  
  alerts.push(newAlert);
  
  // In a real application, this would trigger notifications to caregivers
  console.log(`NEW ALERT: ${type} alert created for ${location}`);
  
  res.status(201).json(newAlert);
};

// Update an alert
exports.updateAlert = (req, res) => {
  const { id } = req.params;
  const { status, details } = req.body;
  
  const alertIndex = alerts.findIndex(alert => alert.id === id);
  
  if (alertIndex === -1) {
    return res.status(404).json({
      error: 'Alert not found',
      message: `No alert found with ID ${id}`
    });
  }
  
  alerts[alertIndex] = {
    ...alerts[alertIndex],
    status: status || alerts[alertIndex].status,
    details: details || alerts[alertIndex].details
  };
  
  res.status(200).json({
    message: 'Alert updated successfully',
    alert: alerts[alertIndex]
  });
};

// Delete an alert
exports.deleteAlert = (req, res) => {
  const { id } = req.params;
  const originalLength = alerts.length;
  
  alerts = alerts.filter(alert => alert.id !== id);
  
  if (alerts.length === originalLength) {
    return res.status(404).json({
      error: 'Alert not found',
      message: `No alert found with ID ${id}`
    });
  }
  
  res.status(200).json({
    message: 'Alert deleted successfully'
  });
};
