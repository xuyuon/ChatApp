import jwt from 'jsonwebtoken';

export const generateJWT = (userID, res) => {
    const token = jwt.sign({userID}, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie('jwt', token, {
        httpOnly: true, 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        // TODO: make it more secure?
        secure : process.env.NODE_ENV === 'development', // Set to true if using HTTPS in development
    });

    return token;
}