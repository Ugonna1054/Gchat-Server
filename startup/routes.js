const express = require("express");
const users = require('../routes/users');
//const groups = require('../routes/groups');
const messages = require('../routes/messages');
const auth = require('../routes/auth');
const error = require('../middleware/error');


module.exports = function (app) {
    app.use(express.static("public"))
    app.use(express.json({ limit:"50mb", extended:true}));
    app.use(express.urlencoded({ limit:"50mb", extended:true}));
    app.use('/api/users', users);
    //app.use('/api/groups', groups);
    app.use('/api/auth', auth);
    app.use('/api/messages', messages);
   
   
    //Central eror handling
    app.use(error)                          
}



