const mongoose = require('../db');

// Define the schema
const productSchema = new mongoose.Schema({
  image: {type: String},
  productName: {type: String },
  supplierID: {type: String },
  price: {type: Number, require: true},
  productCode: {type: String},
  quantity: {type: Number},
  description: {type: String}
});

// Create the Invoice model using the schema
const productModel = mongoose.model('products', productSchema);

// Export the model to be used in other parts of the application
module.exports = productModel;