import User from '../models/user.model.js';
import { generateJWT } from '../lib/utils.js';
import bcrypt from 'bcryptjs';


export const signup = async (req, res) => {
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
            // generate JWT
            generateJWT(newUser._id, res);
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

export const login = (req, res) => {
    res.send('login route');
}

export const logout = (req, res) => {
    res.send('logout route');
}