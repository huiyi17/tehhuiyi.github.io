// Assuming you have already installed and required the "john-package" and "mongoose" in your application
const johnPackage = require('john-package');
const mongoose = require('mongoose');
const invoiceModel = require('../models/invoiceModel.js');
const connection = require('../db.js');


// Function to perform OCR and extract data
async function performOCRAndExtractData(filepath, dict1, dict2) {
  try {
    // Perform OCR and get the analysis result
    const ocrData = await johnPackage.getTextractAnalysis(filepath);

    // Extract forms and tables from the OCR result using "john-package" functions
    const formsData = johnPackage.extractForms(ocrData, dict1);
    const tablesData = johnPackage.extractTables(ocrData, dict2);
    //transform the json data into object format
    //const data = JSON.parse(formsData);
    const mappedData = {
      invoiceID: formsData['Invoice ID'] || '',
      issuedDate: formsData['Issued Date'] || '',
      supplierID: formsData['Supplier ID'] || '',
      totalBeforeGST: formsData['Total Before GST'] || '',
      totalAfterGST: formsData['Total After GST'] || '',
      GST: formsData['GST'] || '',
      productCode: tablesData['Product Code'] || '',
      quantity: tablesData['Quantity'] || '',
      amount: tablesData['Amount'] || '',
      productName: tablesData['Product Name'] || ''
    };

    return mappedData;
  } catch (error) {
    console.error('Error performing OCR and extracting data:', error);
    throw error;
  }
}
async function uploadDataToMongoDB(data) {
  const url = 'mongodb+srv://reenee1601:QNbeHPQLj8pwP7UC@cluster0.i4ee9cb.mongodb.net/project_data?retryWrites=true&w=majority';
  const dbName = 'project_data'; // Replace with your desired database name

  try {
    connection;
    // Save the extracted data to the Invoice collection
    await invoiceModel.create(data);

    console.log('Data uploaded to MongoDB successfully!');
    console.log(data);
  } catch (error) {
    console.error('Error uploading data to MongoDB:', error);
  } finally {
    mongoose.disconnect();
  }
}

async function processOCRAndUploadToMongoDB(filepath, dict1, dict2) {
  try {
    // Perform OCR and extract data
    const extractedData = await performOCRAndExtractData(filepath, dict1, dict2);

    // Upload the extracted data to MongoDB
    await uploadDataToMongoDB(extractedData);

    console.log('OCR data extracted and uploaded to MongoDB successfully!');
  } catch (error) {
    console.error('Error processing OCR and uploading to MongoDB:', error);
  }
}

exports.uploadDataInvoice = async function uploadDataInvoice(req, res, next){
  try {
    // Get the uploaded file path from the request object
    const filepath = req.file.path;

    // Perform OCR and upload data to MongoDB
    await processOCRAndUploadToMongoDB(filepath);

    console.log('File uploaded and data extracted successfully!');
    res.status(200).json({ message: 'File uploaded and data extracted successfully!' });
  } catch (error) {
    console.error('Error uploading file and extracting data:', error);
    res.status(500).json({ error: 'Error uploading file and extracting data.' });
  }
}


// Call the controller function with the file path and dictionary as needed

const dict1 = {
  headers: ['Invoice ID', 'Issued Date', 'Supplier ID','GST','Total Before GST','Total After GST', 'GST' ],
  mapping: {'INVOICE NO.': 'Invoice ID','Tax Invoice':'Invoice ID',
  'Invoice Date': 'Issued Date' , 'DATE': 'Issued Date', 
  'GST 7%' : 'GST',  'Add 7% GST': 'GST', 
  'TOTAL':'Total After GST', 'GRAND TOTAL': 'Total After GST', 'Grand Total': 'Total After GST', 
  'Sub Total': 'Total Before GST', 'SUB TOTAL': 'Total Before GST', 
  'SUBTOTAL SGD': 'Total Before GST', 'TOTAL': 'Total Before GST'
,'Salesman Code': 'Supplier ID'}
};
const dict2 = {
headers: ['Product Code', 'Quantity', 'Amount', 'Product Name' ],
mapping: {
'ITEM ID' : 'Product Code','ode': 'Product Code','Product Code': 'Product Code'
 ,'QTY': 'Quantity', 'Qty' : 'Quantity', 'QUANTITY': 'Quantity', 
 'AMOUNT': 'Amount',  'Amount': 'Amount', 
'Description': 'Product Name','Description': 'Product Name','DESCRIPTION OF GOODS': 'Product Name',
'DESCRIPTION': 'Product Name' }
};
