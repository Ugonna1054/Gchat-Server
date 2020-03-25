
const express = require('express');
const router = express.Router();
const {auth} = require("../middleware/auth");
const message = require('../controllers/message')

//post new message 
router.post('/', auth, message.postMessage )

//get all messages
router.get('/', message.getMessage);

//get messages from a single group
router.get('/:name', message.getSingleMessage)

//get private message between two people
router.get("/private/:sender/:receiver", message.getPrivateMessage)




module.exports = (router); 