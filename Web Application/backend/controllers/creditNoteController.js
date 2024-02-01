// Assuming you have already installed and required the "john-package" and "mongoose" in your application
const johnPackage = require('john-package');
//const mongoose = require('mongoose');
const creditNoteModel = require('../models/creditNoteModel.js');
const db = require('../db'); // Import the db object

// Function to perform OCR and extract data
async function performOCRAndExtractDataCD(filepath) {
  try {
    // Perform OCR and get the analysis result
    const ocrDataCD = await johnPackage.getTextractAnalysis(filepath);

    // Extract forms and tables from the OCR result using "john-package" functions
    const formsDataCD = johnPackage.extractForms(ocrDataCD, formDict);
    const tablesDataCD = johnPackage.extractTables(ocrDataCD, tableDict);
    //transform the json data into object format

    const mappedDataCD = {
      supplierName: tablesDataCD['Supplier ID'] || '',
      retailerName: tablesDataCD['retailerName'] || '',
      creditNoteID: formsDataCD['CreditNote ID'] || '',
      invoiceID: formsDataCD['invoiceID']  || '',
      date: formsDataCD['Issued Date']  || '',
      creditAmount: formsDataCD['Amount']  || ''
    };
    return mappedDataCD;
  } catch (error) {
    console.error('Error performing OCR and extracting data:', error);
    throw error;
  }
}

// Function to upload data to MongoDB
async function uploadDataToMongoDBCD(data) {

  try {
    // TODO: make this connection more modular
    /*const url = 'mongodb+srv://reenee1601:QNbeHPQLj8pwP7UC@cluster0.i4ee9cb.mongodb.net/project_data?retryWrites=true&w=majority'; // Replace with your MongoDB server information
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });*/
    // Save the extracted data to the CD collection
    await creditNoteModel.create(data);

    console.log('Data uploaded to MongoDB successfully!');
    console.log(data);
  } catch (error) {
    console.error('Error uploading data to MongoDB:', error);
  } finally {
    //mongoose.disconnect();
  }
}
async function getCDDataFromMongoDB() {
  try {

    /*const url = 'mongodb+srv://reenee1601:QNbeHPQLj8pwP7UC@cluster0.i4ee9cb.mongodb.net/project_data?retryWrites=true&w=majority'; // Replace with your MongoDB server information
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });*/
    const CDData = await creditNoteModel.find(); // Fetch all documents from the 'CD' collection

    //mongoose.disconnect();

    return CDData;
  } catch (error) {
    console.error('Error fetching CD data from MongoDB:', error);
    throw error;
  }
}

// Example usage in a controller function
async function processOCRAndUploadToMongoDBCD(filepath) {
  try {
    // Perform OCR and extract data
    const extractedDataCD = await performOCRAndExtractDataCD(filepath);

    // Upload the extracted data to MongoDB
    await uploadDataToMongoDBCD(extractedDataCD);

    console.log('OCR data extracted and uploaded to MongoDB successfully!');
  } catch (error) {
    console.error('Error processing OCR and uploading to MongoDB:', error);
  }
}

//main function called in route
exports.uploadDataCD = async function uploadDataCD(req, res, next){
  try {
    // Get the uploaded file path from the request object
    const filepath = req.file.path;
    
    // Perform OCR and upload data to MongoDB
    await processOCRAndUploadToMongoDBCD(filepath);

    console.log('File uploaded and data extracted successfully!');
    res.status(200).json({ message: 'File uploaded and data extracted successfully!' });
  } catch (error) {
    console.error('Error uploading file and extracting data:', error);
    res.status(500).json({ error: 'Error uploading file and extracting data.' });
  }
}

exports.getCDData = async function getCDData(req, res, next){
  try {
    const CDData = await getCDDataFromMongoDB();
    res.json(CDData);
  } catch (error) {
      console.error('Error fetching CD data:', error);
      res.status(500).json({ error: 'Error fetching CD data.' });
  }
}

// Call the controller function with the file path and dictionary as needed

const tableDict = {
    headers: ['Invoice ID', 'CreditNote ID' ,'Issued Date', 'Due Date', 'Amount'],
    mapping: {
    'Ref. No.':'Invoice ID', 'Ref And Particulars':'Invoice ID', 'Tax Invoice':'Invoice ID', 
    'Document No.':'Invoice ID', 'Doc. No.':'Invoice ID', 'References':'Invoice ID', 'No':'Invoice ID', 
    'Invoice No./ CN NO':'Invoice ID', 'Invoice no.':'Invoice ID', 'REF.':'Invoice ID', 
    'Inv. No.':'Invoice ID', 'DOCUMENT NO.':'Invoice ID', 'DOCUMENT NUMBER':'Invoice ID', 
    'Our Ref.':'Invoice ID', 'Document No':'Invoice ID', 'No.':'Invoice ID', 'Reference':'Invoice ID',
    'Balance':'Amount', 'Accumulated Balance':'Amount', 'Balance Amount':'Amount', 
    'Document Amount':'Amount', 'Amount':'Amount', 'BALANCE':'Amount', 
    'Accumulated balance(Functional currency)':'Amount', 
    'Accum Balance':'Amount', 'OUTSTANDING BALANCE':'Amount',    
    'Date':'Issued Date', 'DATE':'Issued Date', 'Tran.Date':'Issued Date', 'Posting Date':'Issued Date', 
    '单据日期':'Issued Date', 'Invoice Date':'Issued Date', 'TOTAL DUE (GBP)':'Amount',
    'Due Date':'Due Date',  'Credit Note:':'CreditNote ID', 
    'Credit note No.:':'CreditNote ID', 'Credit Note Date:':'Issued Date',

}
}; // Replace with any required dictionary or options for "john-package"
const formDict = {
  headers: ['Supplier ID','Total Amount'],
  mapping: {
  'GST REG NO:':'Supplier ID', 'GST Reg No.:':'Supplier ID', 'GST Reg.No:':'Supplier ID', 'ST Reg. No.':'Supplier ID', 'GST Registration No':'Supplier ID',
  'GST Registration No.:':'Supplier ID','GST No :':'Supplier ID','GST REG.NO:':'Supplier ID','Company Reg No & GST Reg No:':'Supplier ID','GST REG NO.':'Supplier ID','GST Reg. No.':'Supplier ID','GST REG.NO':'Supplier ID',
  'TOTAL OUTSTANDING SGD':'Total Amount', '0.00':'Total Amount', 'SGD':'Total Amount', 'TOTAL':'Total Amount', 'Total':'Total Amount', 'TOTAL':'Total Amount', '$':'Total Amount', 'TOTAL (SGD)':'Total Amount', 'Total aging for each bill to':'Total Amount', 'S$ :':'Total Amount', 'Total in SGD':'Total Amount', '-':'Total Amount', 'Total=$':'Total Amount', 
  'Total Outstandings:':'Total Amount', 'Aged Amounts':'Total Amount', 'SGD:':'Total Amount',

}
};

async function getCDDataById(id) {
  try {
    /*const url = 'mongodb+srv://reenee1601:QNbeHPQLj8pwP7UC@cluster0.i4ee9cb.mongodb.net/project_data?retryWrites=true&w=majority'; // Replace with your MongoDB server information
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });*/
    const specificCDData = await creditNoteModel.findById(id); // Fetch data from the 'CD' collection based on the _id

    //mongoose.disconnect();
    return specificCDData;

  } catch (error) {
    console.error('Error fetching specific CD data from MongoDB:', error);
    throw error;
  }
}

exports.getCDDataUsingId = async function getCDDataUsingId(req, res, next){
  try {
    const { id } = req.params; // Extract the _id from the URL parameter
    const specificCDData = await getCDDataById(id);
    res.json(specificCDData);
    
  } catch (error) {
    console.error('Error fetching specific CD data:', error);
    res.status(500).json({ error: 'Error fetching specific CD data.' });
  }
}
