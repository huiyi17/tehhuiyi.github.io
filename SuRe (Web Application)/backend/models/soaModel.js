const mongoose = require('../db');

// Define the schema
const soaSchema = new mongoose.Schema({
  invoiceID: {type: Array},
  issuedDate: {type: Array},
  dueDate: {type: Array},
  amount: {type: Array },
  supplierID: {type: String },
  totalAmount: {type: String},
});

// Create the soa model using the schema
const soaModel = mongoose.model('soas', soaSchema);


// Export the model to be used in other parts of the application
module.exports = soaModel;