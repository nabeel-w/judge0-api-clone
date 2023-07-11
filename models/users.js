const mongoose = require('mongoose');
const Code= require('./code.js')
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    codes:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Code'
        }]
    }
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;