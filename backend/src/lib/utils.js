const jwt = require('jsonwebtoken');

// Ensure you have a secret key for signing JWTs (store in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

const generateJWT = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
    if (res) {
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }
    return token; // Return token for response body
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Failed to generate JWT');
  }
};

const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    throw new Error('Invalid or expired token');
  }
};

module.exports = { generateJWT, verifyJWT };