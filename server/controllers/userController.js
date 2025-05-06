
// Mock user database
const users = [
  {
    id: '1',
    name: 'John Smith',
    age: 78,
    room: '101',
    caregivers: [
      { name: 'Mary Johnson', phone: '+1-555-123-4567', relationship: 'Daughter' },
      { name: 'Robert Smith', phone: '+1-555-987-6543', relationship: 'Son' }
    ],
    medicalConditions: ['Hypertension', 'Arthritis'],
    mobilityLevel: 'Limited',
    preferences: {
      sleepTime: '22:00',
      wakeTime: '07:30',
      mealtimes: ['08:00', '12:30', '18:00']
    }
  },
  {
    id: '2',
    name: 'Emma Davis',
    age: 82,
    room: '102',
    caregivers: [
      { name: 'Thomas Davis', phone: '+1-555-222-3333', relationship: 'Son' }
    ],
    medicalConditions: ['Diabetes Type 2', 'Glaucoma'],
    mobilityLevel: 'Moderate',
    preferences: {
      sleepTime: '21:30',
      wakeTime: '06:45',
      mealtimes: ['07:30', '12:00', '17:30']
    }
  }
];

// Get user profile
exports.getUserProfile = (req, res) => {
  const { id } = req.params;
  const user = users.find(user => user.id === id);
  
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: `No user found with ID ${id}`
    });
  }
  
  res.status(200).json(user);
};

// Update user profile
exports.updateUserProfile = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'User not found',
      message: `No user found with ID ${id}`
    });
  }
  
  // Prevent updating the ID
  delete updates.id;
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates
  };
  
  res.status(200).json({
    message: 'User profile updated successfully',
    user: users[userIndex]
  });
};
