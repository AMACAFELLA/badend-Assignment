const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if token doesn't exist
  if (!token) {
    return res.status(401).json({ message: 'Authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
};

module.exports = auth;
