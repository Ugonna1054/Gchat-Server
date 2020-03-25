const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

//define schema 
const groupSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        index:true
    },
    user : {
        type:ObjectId,
        ref : "User",
        required:true,
        index:true
      }
},
{timestamps:true})

const Group = mongoose.model('Group', groupSchema)

module.exports = Group