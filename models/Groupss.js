const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Joi = require('@hapi/joi');

//define members schema 
const memberSchema = new mongoose.Schema({
    member : {
        type:ObjectId,
        ref : "User",
        required:true,
        index:true
    }, 
    details : {
        type:ObjectId,
        ref : "User",
        required:true,
        index:true
    },
    role : {
        type:"String",
        enum : ["admin", "user"],
        default:"user",
        required:true
    }
})

//define lastMessage schema 
const lastMessage = new mongoose.Schema({
    sender : {
        type:ObjectId,
        ref : "User",
    }, 
    message : {
        type:String
    }
})

//define schema 
const groupSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        index:true
    },
    lastMessage,
    displayPicture:{
        type:String,
    },
    creator : {
        type:ObjectId,
        ref : "User",
        required:true,
        index:true
    },
    members : [memberSchema]
},
{timestamps:true})

//define model
const Group = mongoose.model('Group', groupSchema);

//Joi validation function for Updating user profile
function validateGroup(group) {
    const schema = Joi.object().keys({
      name: Joi.string().required().max(20),
      members:Joi.array().required(),
      //role:Joi.string().required().max(20)  
    })
  
    return schema.validate(group);
  }

exports.Group = Group
exports.validateGroup = validateGroup