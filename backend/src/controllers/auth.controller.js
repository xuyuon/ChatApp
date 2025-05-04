const User = require('../models/user.model.js');
const License = require('../models/license.model.js');
const { generateJWT } = require('../lib/utils.js');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    const {username, password} = req.body;
    try {
        // console.log("req.body: ", req.body);

        // validation
        // check if all fields are filled
        if (!username || !password){
            return res.status(400).json({message: 'Please fill in all fields'});
        }

        // check if password length is greater or equal to 6
        if (password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }

        // check if user already exists
        const user = await User.findOne({username: username});
        if (user){
            return res.status(400).json({message: 'Username is already taken'});
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUser = new User({
            username: username,
            password: hashedPassword,
        });
        
        // console.log("newUser: ", newUser);

        // save user to database
        if (newUser) {
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                message: 'User created successfully'
            });

        } else {
            res.status(400).json({message: 'Failed to create user'});
        }

        
    } catch (error) {
        console.log("Error in signup route: ", error.message);
        res.status(500).send(error.message);
    }
}

const login = async (req, res) => {
    // res.send('login route');
    const {username, password} = req.body;

    try {
        const user = await User.findOne({username: username});

        // check if user exists
        if (!user){
            return res.status(400).json({message: "Invalid credentials"});
        }

        // check if password is correct
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        generateJWT(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            message: "Logged in successfully"
        })
    } catch (error) {
        console.log("Error in login route: ", error.message);
        res.status(500).send(error.message);
    }
}

const logout = (req, res) => {
    // res.send('logout route');
    try{
        // clear the cookie
        res.cookie('jwt', '', {maxAge: 0});
        res.status(200).json({message: 'Logged out successfully'});
    } catch (error){
        console.log("Error in logout route: ", error.message);
        res.status(500).json({message: error.message});

    }
}

const updateUsername = async (req, res) => {
    try{
        const {newUsername} = req.body;
        const user = await User.findById(req.user._id);

        // check if user exists
        if (!user){
            return res.status(400).json({message: "User not found"});
        }
        // check if new username is filled
        if (!newUsername){
            return res.status(400).json({message: "Empty username"});
        }
        // check if new username is same as old username
        if (newUsername === user.username){
            return res.status(400).json({message: "New username is same as old username"});
        }
        // check if the new username is already taken
        const existingUser = await User.findOne({username: newUsername});
        if (existingUser){
            return res.status(400).json({message: "Username is already taken"});
        }

        // update the username
        user.username = newUsername;
        await user.save();
        res.status(200).json({message: "Username updated successfully"});
    } catch (error){
        console.log("Error in updateProfile route: ", error.message);
        res.status(500).json({message: error.message});
    }
}


const updatePassword = async (req, res) => {
    try{
        const {oldPassword, newPassword} = req.body;
        const user = await User.findById(req.user._id);

        // check if user exists
        if (!user){
            return res.status(400).json({message: "User not found"});
        }

        // check if both old password and new password is filled
        if (!oldPassword || !newPassword){
            return res.status(400).json({message: "Empty fields"});
        }

        // check if old password is correct
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        // check if new password is same as old password
        if (newPassword === oldPassword){
            return res.status(400).json({message: "New password is same as old password"});
        }

        // check if new password length is greater or equal to 6
        if (newPassword.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }

        // hashing new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // update the password
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({message: "Password updated successfully"});
    }catch (error){
        console.log("Error in updateProfile route: ", error.message);
        res.status(500).json({message: error.message});
    }
}


const checkAuth = async (req, res) => {
    // To check if user is logged in or not
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Error in checkAuth route: ", error.message);
        res.status(500).json({message: error.message});
    }
}

const addLicense = async (req, res) => {
    // To add liscense to user
    try{
        const {licenseKey} = req.body;
        const user = await User.findById(req.user._id);

        const license = await License.findOne({ licenseKey: licenseKey });

        console.log("license: ", license);
        // check if liscense key is valid
        if (!license){
            return res.status(400).json({message: "Invalid license key"});
        }
        if (license.isActive === true){
            return res.status(400).json({message: "License key is already used"});
        }

        // check if user is already liscensed
        if (user.userType === "licensed"){
            return res.status(400).json({message: "User is already licensed"});
        }
        
        // update the liscense key to used
        license.isActive = true;
        license.userId = user._id;
        await license.save();

        // update the user to be liscensed
        user.userType = "licensed";
        await user.save();

        res.status(200).json({ message: "License added"});

    }catch (error){
        console.log("Error in addLicense route: ", error.message);
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    signup,
    login,
    logout,
    updateUsername,
    updatePassword,
    checkAuth,
    addLicense
};
