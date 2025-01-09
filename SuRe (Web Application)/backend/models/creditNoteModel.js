const mongoose = require('../db');

// Define the schema
const creditNoteSchema = new mongoose.Schema({
  creditNoteID: {type: String},
  invoiceID: {type: String},
  supplierID: {type: String },
  retailerID: {type: String },
  creditAmount: {type: String },
  productCode: {type: Array},
  quantity: {type: Array },
  amount: {type: Number, require:true },
  productName: {type: Array},
});

// Create the Invoice model using the schema
const creditNoteModel = mongoose.model('creditNote', creditNoteSchema);

// Export the model to be used in other parts of the application
module.exports = creditNoteModel;