import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, CssBaseline, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const quotes = [
    { text: "Prevention is better than cure, especially when it comes to falls.", author: "Elder Guard" },
    { text: "Safety doesn't happen by accident. It's a choice we consciously make every day.", author: "Elder Care Specialist" },
    { text: "A safe environment is the first step towards independent aging.", author: "Gerontology Expert" },
    { text: "Preventing falls today keeps independence in place tomorrow.", author: "Elder Guard" }
  ];

  const images = [
    "/img1.webp", // Replace with actual image paths
    // "/path/to/image2.jpg",
    // "/path/to/image3.jpg",
    // "/path/to/image4.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');

    if (!email) {
      setEmailError('Please enter your email');
      return;
    }
    if (!password) {
      setPasswordError('Please enter your password');
      return;
    }
    if (password.length < 7) {
      setPasswordError('Password must be 8 characters or longer');
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login (e.g., store token, redirect)
        console.log('Login successful:', data);
        navigate("/");
        
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 lg:px-10">
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div className="mb-8 text-center">
              <Typography variant="h4" className="text-blue-600 font-bold">
                Elder Guard
              </Typography>
              <Typography variant="subtitle1" className="text-gray-600">
                Fall Prevention System
              </Typography>
            </div>

            <Typography variant="h5" className="mb-6">
              Log in to your account
            </Typography>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              className="mb-3"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
            />

            <div className="flex items-center justify-between w-full mt-2 mb-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ marginTop: 2, width: '100%' }}>
                {errorMessage}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                backgroundColor: '#3B82F6',
                '&:hover': {
                  backgroundColor: '#2563EB',
                }
              }}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
            </Button>

            <Typography variant="body2" className="mt-4 text-center text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </a>
            </Typography>
          </Box>
        </Container>
      </div>

      {/* Right side - Image slideshow with quotes */}
      <div className="hidden md:block md:w-1/2 relative bg-blue-50">
        {images.map((imgSrc, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentImageIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-400/30 to-blue-600/50 z-10"></div>
            
            {/* Image */}
            <img 
              src={imgSrc} 
              alt="Elder Guard" 
              className="w-full h-full object-cover"
            />
            
            {/* Quote box */}
            <div className="absolute bottom-12 left-0 right-0 px-8 z-20">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                <p className="text-lg text-gray-800 italic mb-3">{quotes[index].text}</p>
                <p className="text-right text-gray-600 font-medium">— {quotes[index].author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;