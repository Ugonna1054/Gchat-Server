const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


//define token schema
const tokenSchema = new mongoose.Schema({
  token:{
    type:String,
    index:true,
  },
  expiryDate:{
      type:String
  }
},
{
  timestamps:true
})

const userSchema = new mongoose.Schema({

  isVerified: {
    type: Boolean,
    default: false
  },
  code : {
    type: String,
  },
  email: {
    index: true,
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    //required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    index: true,
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    //required: true
  },
  school: {
    type: String,
    //required: true
  },
  department: {
    type: String,
    //required: true
  },
  country: {
    type: String,
    //required: true
  },
  region : {
    type: String,
    //required: true
  },
  displayPicture: {
    type: String,
    maxlength: 200
  },
  about: {
    type: String,
    maxlength: 200
  },
  isAdmin: Boolean,
  tokenSchema
},
  {
    timestamps: true
  })

//function to generate jwt token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({
    _id: this._id,
    isAdmin: this.isAdmin,
  },
    config.get('myPrivateKey'),
    { expiresIn: '100y' }
  );
  return token;
}

//define modfel
const User = mongoose.model('User', userSchema)

//Joi validation function for completing signup
function validate(user) {
  const schema = Joi.object().keys({
    name: Joi.string().max(50).required(),
    school: Joi.string().max(50).required(),
    department: Joi.string().max(50).required(),
    region: Joi.string().max(50).required(),
    country: Joi.string().max(30).required(),
  })

  return schema.validate(user);
}

//Joi validation function for login
function validateLogin(user) {
  const schema = Joi.object().keys({
    username: Joi.string().required()
  })

  return schema.validate(user);
}

//Joi validation function for change password
function validatePassword(user) {
  const schema = Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(6).required(),
  })

  return schema.validate(user);
}

//Joi validation function for reset password
function validatePasswordReset(user) {
  const schema = Joi.object().keys({
    password: Joi.string().min(6).max(6).required(),
  })

  return schema.validate(user);
}

//Joi validation function for signup
function validateEmail(user) {
  const schema = Joi.object().keys({
    username: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(11).max(15).required(),
  })

  return schema.validate(user);
}

//Joi validation function for Updating user profile
function validateProfileUpdate(user) {
  const schema = Joi.object().keys({
    email: Joi.string().email().optional(),
    username: Joi.string().min(3).max(15).optional(),
    school: Joi.string().max(50).optional(),
    department: Joi.string().max(50).optional(),
    region: Joi.string().max(50).optional(),
    phone: Joi.string().min(11).max(20).optional(),
    country: Joi.string().max(30).optional(),
    about: Joi.string().max(150).optional().allow(""),
  })

  return schema.validate(user);
}


exports.User = User
exports.validate = validate
exports.validateLogin = validateLogin
exports.validateEmail = validateEmail
exports.validatePassword = validatePassword
exports.validatePasswordReset = validatePasswordReset
exports.validateProfileUpdate = validateProfileUpdate