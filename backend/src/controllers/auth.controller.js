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

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
      console.log("Received login request with body:", req.body);
  
      // Validation
      if (!username || !password) {
        console.log("Validation failed: Missing fields");
        return res.status(400).json({ message: 'Please fill in all fields' });
      }
  
      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        console.log("Validation failed: User not found");
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Validation failed: Incorrect password");
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT and set cookie
      console.log("Generating JWT for user:", user.username);
      generateJWT(user._id, res);
  
      // Send success response
      res.status(200).json({
        _id: user._id,
        username: user.username,
        message: 'Login successful',
      });
    } catch (error) {
      console.log("Error in login route:", error.message, error.stack);
      res.status(500).json({ message: error.message });
    }
  };

  export const logout = (req, res) => {
    try {
      console.log("Received logout request");
  
      // Clear the JWT cookie
      res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), // Set the cookie to expire immediately
      });
  
      // Send success response
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.log("Error in logout route:", error.message, error.stack);
      res.status(500).json({ message: error.message });
    }
  };