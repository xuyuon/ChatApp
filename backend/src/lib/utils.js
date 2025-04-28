const jwt = require('jsonwebtoken');

const generateJWT = (userID, res) => {
    /**
    Generate a JWT token and set it in a cookie
    The payload of the JWT token:
    {
        userID: userID
    }
     */

    const token = jwt.sign({userID}, process.env.JWT_SECRET, {expiresIn: '7d'});

module.exports = { generateJWT };