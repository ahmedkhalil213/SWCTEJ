const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; // Replace with your secret key

function authenticateToken() {
  return (req, res, next) => {
    // Check if the authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    // Split the authorization header
    const tokenParts = req.headers.authorization.split(' ');

    // Check if the header is in the correct format
    const token = tokenParts[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });

      // Check the user's role against the requiredRole
      req.user = user;
      next();
    });
  };
}

module.exports = authenticateToken;