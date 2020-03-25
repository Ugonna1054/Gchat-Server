const group = require ("../controllers/group")
const express = require('express');
const router = express.Router();
const {auth} = require("../middleware/auth")

//create/join group
router.post('/', auth, group.addGroup)

//get all groups
router.get('/', group.getAllGroup)

//get a single group
router.get('/:name', group.getSingleGroup)

//edit group name
router.put('/:name', auth, group.editGroup)


module.exports = (router);