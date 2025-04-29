const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");


const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;

        // check if jwt token exists
        if (!token){
            return res.status(401).json({message: "Unauthorized"});
        }

        // verify the jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: "Unauthorized"});
        }

        // check if user exists
        const user = await User.findById(decoded.userID).select("-password");
        if(!user){
            return res.status(401).json({message: "Unauthorized"});
        }

        // set the user in the request object
        req.user = user;

        // call the next function
        next()

    } catch (error){
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({message: error.message});
    }
}

module.exports = { protectRoute };