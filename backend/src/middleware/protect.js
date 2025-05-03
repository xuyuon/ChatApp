const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) return res.status(401).json({ msg: 'Not logged in' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userID).select('-password');
    if (!user) return res.status(401).json({ msg: 'User not found' });

    req.user = user; // attach user to request
    next();
  } catch {
    res.status(401).json({ msg: 'Token invalid' });
  }
};

module.exports = { protect };