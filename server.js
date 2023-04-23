const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectDB = require('./db/connect');
const { auth } = require('express-openid-connect'); // Import the auth router
const jwt = require('jsonwebtoken');
const productController = require('./ controllers/products');



// Import routes
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(req.body);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Add Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

// Use the auth router with the Auth0 configuration
app.use(auth(config));

app.get('/', (req, res) => {
  res.send('Hello, this is the homepage!');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // TODO: Check if the user's credentials are correct

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, secure: true });
  res.json({ success: true });
});

const { requiresAuth } = require('express-openid-connect');

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// POST /products
app.post('/products', requiresAuth(), productController.createProduct);

// Routes
app.use('/products', productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
