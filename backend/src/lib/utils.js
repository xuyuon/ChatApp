import jwt from 'jsonwebtoken';

export const generateJWT = (userID, res) => {
    /**
    Generate a JWT token and set it in a cookie
    The payload of the JWT token:
    {
        userID: userID
    }
     */

    const token = jwt.sign({userID}, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie('jwt', token, {
        httpOnly: true, 
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        // TODO: make it more secure?
    });

    return token;
}