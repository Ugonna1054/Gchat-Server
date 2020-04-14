
const express = require('express');
const router = express.Router();
const {auth} = require("../middleware/auth");
const message = require('../controllers/message')

//post new group message 
router.post('/', auth, message.postMessage );

//post new private message 
router.post('/private', auth, message.postMessagePrivate )

//get all group messages
router.get('/', message.getMessage);

//get messages from a single group
router.get('/:id', auth,  message.getSingleMessage)

//get all private messages
router.get("/private/all",auth , message.getPrivateMessageAll)

//get private message between two people
router.get("/private/:receiver", auth,  message.getPrivateMessage)





module.exports = (router); 