const mongoose = require('../db');

// Define the schema
const invoiceSchema = new mongoose.Schema({
  invoiceID: {type: String, required: true},
  issuedDate: {type: String},
  dueDate: {type: String},
  supplierID: {type: String },
  totalBeforeGST: {type: String},
  totalAfterGST: {type: String },
  GST: {type: String },
  productCode: {type: Array},
  quantity: {type: Array },
  amount: {type: Array},
  productName: {type: Array},
});

// Create the Invoice model using the schema
const invoiceModel = mongoose.model('invoices', invoiceSchema);

// Export the model to be used in other parts of the application
module.exports = invoiceModel;
