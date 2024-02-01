const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    company: String,
    email: String,
    password: String,
  });

// Create the user model using the schema
const userModel = mongoose.model('users', userSchema);

// Export the model to be used in other parts of the application
module.exports = userModel;