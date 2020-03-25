const mongoose = require('mongoose');
const {Schema} = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId

//define Schema
const MessageSchema = new Schema({
  message : {
    type : String,
    required:true
  },
  user : {
    type:ObjectId,
    required:true,
    ref:"User",
    index:true
  },
  group : {
    type:String,
    required:true,
    index:true
  }
},
{timestamps:true})

//define model
const Message = mongoose.model('Message',MessageSchema);

module.exports = Message
