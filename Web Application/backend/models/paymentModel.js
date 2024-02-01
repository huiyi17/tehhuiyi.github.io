const mongoose = require('mongoose');

// Define the schema
const paymentSchema = new mongoose.Schema({
  PayerName: {type: String},
  Comment: {type: String},
  Reference: {type: String},
});

// Create the Invoice model using the schema
const paymentModel = mongoose.model('payment', paymentSchema);

// Export the model to be used in other parts of the application
module.exports = paymentModel;
