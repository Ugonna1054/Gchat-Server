const group = require ("../controllers/group")
const express = require('express');
const router = express.Router();
const {auth} = require("../middleware/auth")

//create group
router.post('/', auth, group.createGroup)

//join group
router.post('/join/:id', auth, group.joinGroup)

//get all groups
router.get('/', auth, group.getAllGroup)

//get a single group
router.get('/:name', group.getSingleGroup)

//edit group name
router.put('/:name', auth, group.editGroup)


module.exports = (router);