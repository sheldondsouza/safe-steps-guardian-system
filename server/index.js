
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sensorRoutes = require('./routes/sensors');
const alertRoutes = require('./routes/alerts');
const userRoutes = require('./routes/users');
const admin = require('firebase-admin');
const axios = require("axios")
// Load environment variables
dotenv.config();


// You'll need to download a service account key JSON file
// from your Firebase project settings (Project settings > Service accounts > Generate new private key)
// Store this file securely and DO NOT expose it publicly.
const serviceAccount = require('./secert.json'); // <--- SECURE THIS FILE!

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wearable-fall-dect-default-rtdb.firebaseio.com/" // Your RTDB URL
});

// You can now get a reference to the database service
const db = admin.database();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/sensors', sensorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});
app.get('/api/useme', async (req, res) => {
  try {
    const usersRef = db.ref('users'); // Get a reference to the 'users' path
    const snapshot = await usersRef.once('value'); // Fetch the data once

    if (snapshot.exists()) {
      // snapshot.val() gets the data as a JSON object
      res.json(snapshot.val());
    } else {
      res.status(404).send('No users found.');
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error.');
  }
});
async function createNewFirebaseUser(email, password, displayName = null) {
  if (!email || !password) {
    console.error('Email and password are required to create a user.');
    return null;
  }

  try {
    const userProperties = {
      email: email,
      password: password,
    };

    if (displayName) {
      userProperties.displayName = displayName;
    }

    const userRecord = await admin.auth().createUser(userProperties);
    return userRecord;

  } catch (error) {
    console.error('Error creating new user:', error);
    return null;
  }
}

app.post('/api/signup', async (req, res) => {
  const { email, password, displayName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const newUser = await createNewFirebaseUser(email, password, displayName);

    if (newUser) {
      res.status(201).json({
        message: 'User created successfully',
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName
      });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Send a POST request to Firebase Authentication REST API to authenticate the user
    const response = await axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCG6iSfzw9hDkyH_B26huce-c-BaNDqZMQ"
, {
      email: email,
      password: password,
      returnSecureToken: true,
    });

    // Get the ID token from the response
    const idToken = response.data.idToken;

    // Use Firebase Admin SDK to verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const emailVerified = decodedToken.email_verified;

    // The user is authenticated successfully
    res.status(200).json({
      message: 'User logged in successfully',
      uid,
      emailVerified,
      email: decodedToken.email,
      idToken: idToken,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(401).json({ error: 'Unauthorized', message: error.response ? error.response.data.error.message : error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

