const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const user = require("../controllers/user");
const multer = require("multer")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
})

const upload = multer({ storage: storage })
const cpUpload = upload.fields([{ name: 'displayPicture', maxCount: 1 }])



//post and get request to Create new user and get all users
router.route('/')
    .get(user.getUsers)
    .post(user.createUser)

//Get User profile
router.get('/me', auth, user.getUserProfile);

//verify email
router.get("/verify/:code", user.verify)

//Get current User 
router.get('/:id', auth, user.getOneUser);

//update user info on signup
router.put("/update/profile/:email",  user.updateProfileSignup)

//update display picture
router.put("/update/picture", auth, cpUpload, user.updatePicture)

//update user profile
router.put("/update", auth, user.updateProfile)


module.exports = (router); 