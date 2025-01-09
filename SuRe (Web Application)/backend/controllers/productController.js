// Assuming you have already installed and required the "john-package" and "mongoose" in your application
const mongoose = require('mongoose');
const productModel = require('../models/productModel.js');


// Function to upload data to MongoDB
async function uploadDataToMongoDBProd(data) {

    try {
      // TODO: make this connection more modular
      /*const url = 'mongodb+srv://reenee1601:QNbeHPQLj8pwP7UC@cluster0.i4ee9cb.mongodb.net/project_data?retryWrites=true&w=majority'; // Replace with your MongoDB server information
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });*/
      // Save the extracted data to the products collection
      await productModel.create(data);
  
      console.log('Data uploaded to MongoDB successfully!');
      console.log(data);
    } catch (error) {
      console.error('Error uploading data to MongoDB:', error);
    } finally {
      //mongoose.disconnect();
    }
  }

exports.handleUploadProd = async function handleUploadProd(req, res, next){
  try{
    const data = req.body;
    if (data==null){
      return res.status(400).json({ error: 'No valid data provided for upload.' });
    }
    console.log(data);
    await uploadDataToMongoDBProd(data);
    console.log('OCR data extracted and uploaded to MongoDB successfully!');
    res.status(200).json({ message: 'File uploaded and data extracted successfully!' });
  } catch (error) {
    console.error('Error processing OCR and uploading to MongoDB:', error);
    res.status(500).json({ error: 'Error uploading file and extracting data.' });
  }

}

exports.getProdDataFromMongoDB = async function getProdDataFromMongoDB(req, res, next) {
try {

    /*const url = 'mongodb+srv://reenee1601:QNbeHPQLj8pwP7UC@cluster0.i4ee9cb.mongodb.net/project_data?retryWrites=true&w=majority'; // Replace with your MongoDB server information
    await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });*/
    const prodData = await productModel.find(); // Fetch all documents from the 'products' collection
    console.log("IT CONNECTED")
    console.log(prodData);
    //mongoose.disconnect();
    res.json(prodData);

} catch (error) {
    console.error('Error fetching products data from MongoDB:', error);
    throw error;
}
}

async function getProdDataById(id) {
    try {
      /*const url = 'mongodb+srv://reenee1601:QNbeHPQLj8pwP7UC@cluster0.i4ee9cb.mongodb.net/project_data?retryWrites=true&w=majority'; // Replace with your MongoDB server information
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });*/
      const specificProdData = await productModel.findById(id); // Fetch data from the 'products' collection based on the _id
  
      //mongoose.disconnect();
      return specificProdData;
  
    } catch (error) {
      console.error('Error fetching specific products data from MongoDB:', error);
      throw error;
    }
  }
  
exports.getProdDataUsingId = async function getProdDataUsingId(req, res, next){
try {
    const { id } = req.params; // Extract the _id from the URL parameter
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid id format.' });
    }
    
    const specificProdData = await getProdDataById(id);
    // res.json(specificProdData);
    // res.status(200).json({ message: 'Fetch specific product data by id successful!' });
    res.status(200).json({
      message: 'Fetch specific product data by id successful!',
      data: specificProdData
    });
    
} catch (error) {
    console.error('Error fetching specific products data:', error);
    res.status(500).json({ error: 'Error fetching specific products data.' });
}
}



