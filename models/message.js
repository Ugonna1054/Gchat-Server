const mongoose = require('mongoose');
const {Schema} = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Joi = require('@hapi/joi');

//define Schema
const MessageSchema = new Schema({
  message : {
    type : String,
    required:true
  },
  sender : {
    type:ObjectId,
    required:true,
    ref:"User",
    index:true
  },
  group : {
    type:ObjectId,
    ref:"Group",
    required:true,
    index:true
  }
},
{timestamps:true})

//Joi validation function for Updating user profile
function validateMessage(message) {
  const schema = Joi.object().keys({
    message: Joi.string().required(),

    group:Joi.string().required(),
    
  })

  return schema.validate(message);
}


//define model
const Message = mongoose.model('Message',MessageSchema);


//define private message Schema
const PrivateMessageSchema = new Schema({
  message : {
    type : String,
    required:true
  },
  sender : {
    type:ObjectId,
    required:true,
    ref:"User",
    index:true
  },
  receiver : {
    type:ObjectId,
    ref:"User",
    required:true,
    index:true
  }
},
{timestamps:true})

//Joi validation function 
function validatePrivateMessage(message) {
  const schema = Joi.object().keys({
    message: Joi.string().required(),

    receiver:Joi.string().required(),
    
  })

  return schema.validate(message);
}


//define model
const PrivateMessage = mongoose.model('PrivateMessage',PrivateMessageSchema);


exports.Message = Message;
exports.validateMessage = validateMessage;
exports.PrivateMessage = PrivateMessage;
exports.validatePrivateMessage = validatePrivateMessage
