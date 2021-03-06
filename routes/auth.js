const express = require('express');
const router = express.Router();
const auth = require("../controllers/auth")
const auth_ = require("../middleware/auth")

//Sign in User Start
router.post('/login', auth.LoginStart)

//Sign in User Complete
router.post('/login/verify/:code', auth.LoginComplete)


//Signout User
router.post('/logout', async (req, res) => {
    res.header('x-auth-token', '').send('Logged out Successfully')
});

//send password reset email
router.post('/forgotPassword/:email',  auth.ResetEmail);

//Reset password
router.put('/resetPassword/:token',  auth.ResetPassword);

//change password
router.put('/changePassword', auth_.auth,  auth.ChangePassword)

//update schema
router.put('/update',  auth.updateSchema)

module.exports = router; 