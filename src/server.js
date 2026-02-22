require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import your authentication routes
const authRoutes = require('./authentication/routes');

const app = express();

// Middleware
app.use(cors()); // Allows your frontend to talk to this backend
app.use(express.json()); // Allows Express to parse JSON bodies from Postman/Frontend

// Mount the authentication routes
// Every route in routes.js will now be prefixed with /api/auth
app.use('/api/auth', authRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.send('Secure-Finance-WebApp Backend is running!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🔑 Auth endpoints ready at http://localhost:${PORT}/api/auth`);
})