const mongoose = require('mongoose');

const users = mongoose.Schema({
    username: String,
    password: String,
    role : String,
    active: Boolean
  });
  
  const userModel= mongoose.model("users", users);
  module.exports= userModel;