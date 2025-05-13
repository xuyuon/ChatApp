/*
Routes for user managements
*/

const express = require('express');

const {
    signup,
    login,
    logout,
    updateUsername,
    updatePassword,
    checkAuth,
    addLicense
} = require('../controllers/auth.controller.js');
const { protectRoute } = require('../middleware/auth.middleware.js');


const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/add-license', protectRoute, addLicense);
router.put('/update-username', protectRoute, updateUsername);
router.put('/update-password', protectRoute, updatePassword);

router.get('/check-auth', protectRoute, checkAuth);

module.exports = router;