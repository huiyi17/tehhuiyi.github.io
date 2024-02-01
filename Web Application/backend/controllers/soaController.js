// Assuming you have already installed and required the "john-package" and "mongoose" in your application
//const johnPackage = require('john-package');
const utils = require('../utils/utils.js')
const mongoose = require('mongoose');
const { unlink } = require('fs'); // use this to delete the file after we're done
const soaModel = require('../models/soaModel.js');
const { fs } = require('fs');


const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ExcelJS = require('exceljs');
var path = require('path');

//const db = require('../db.js')

/*mongoose.connect('mongodb+srv://reenee1601:QNbeHPQLj8pwP7UC@cluster0.i4ee9cb.mongodb.net/project_data?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Get the connection object
const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
connection.once('open', () => {
  console.log('Connected to the database');
});
*/

// CONST DICTIONARIES
/*
const tablesDict = {
    headers: ['Invoice ID', 'Issued Date', 'Due Date', 'Amount'],
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
    '单据日期':'Issued Date', 'Invoice Date':'Issued Date',
    'Due Date':'Due Date',

}
}; // Replace with any required dictionary or options for "john-package"
const formsDict = {
  headers: ['Supplier ID','Total Amount'],
  mapping: {
  'GST REG NO:':'Supplier ID', 'GST Reg No.:':'Supplier ID', 'GST Reg.No:':'Supplier ID', 'ST Reg. No.':'Supplier ID', 'GST Registration No':'Supplier ID',
  'GST Registration No.:':'Supplier ID','GST No :':'Supplier ID','GST REG.NO:':'Supplier ID','Company Reg No & GST Reg No:':'Supplier ID','GST REG NO.':'Supplier ID','GST Reg. No.':'Supplier ID','GST REG.NO':'Supplier ID',
  'TOTAL OUTSTANDING SGD':'Total Amount', '0.00':'Total Amount', 'SGD':'Total Amount', 'TOTAL':'Total Amount', 'Total':'Total Amount', 'TOTAL':'Total Amount', '$':'Total Amount', 'TOTAL (SGD)':'Total Amount', 'Total aging for each bill to':'Total Amount', 'S$ :':'Total Amount', 'Total in SGD':'Total Amount', '-':'Total Amount', 'Total=$':'Total Amount', 
  'Total Outstandings:':'Total Amount', 'Aged Amounts':'Total Amount', 'SGD:':'Total Amount', 

}
};
*/
const tablesDict = {
    headers: ['invoiceID', 'issuedDate', 'dueDate', 'amount'],
    mapping: {
    'Ref. No.':'invoiceID', 'Ref And Particulars':'invoiceID', 'Tax Invoice':'invoiceID', 
    'Document No.':'invoiceID', 'Doc. No.':'invoiceID', 'References':'invoiceID', 'No':'invoiceID', 
    'Invoice No./ CN NO':'invoiceID', 'Invoice no.':'invoiceID', 'REF.':'invoiceID', 
    'Inv. No.':'invoiceID', 'DOCUMENT NO.':'invoiceID', 'DOCUMENT NUMBER':'invoiceID', 
    'Our Ref.':'invoiceID', 'Document No':'invoiceID', 'No.':'invoiceID', 'Reference':'invoiceID',
    'Balance':'amount', 'Accumulated Balance':'amount', 'Balance Amount':'amount', 
    'Document Amount':'amount', 'Amount':'amount', 'BALANCE':'amount', 
    'Accumulated balance(Functional currency)':'amount', 
    'Accum Balance':'amount', 'OUTSTANDING BALANCE':'amount',    
    'Date':'issuedDate', 'DATE':'issuedDate', 'Tran.Date':'issuedDate', 'Posting Date':'issuedDate', 
    '单据日期':'issuedDate', 'Invoice Date':'issuedDate',
    'Due Date':'dueDate',

}
}; // Replace with any required dictionary or options for "john-package"

const formsDict = {
  headers: ['supplierID','totalAmount'],
  mapping: {
  'GST REG NO:':'supplierID', 'GST Reg No.:':'supplierID', 'GST Reg.No:':'supplierID', 'ST Reg. No.':'supplierID', 'GST Registration No':'supplierID',
  'GST Registration No.:':'supplierID','GST No :':'supplierID','GST REG.NO:':'supplierID','Company Reg No & GST Reg No:':'supplierID','GST REG NO.':'supplierID','GST Reg. No.':'supplierID','GST REG.NO':'supplierID',
  'TOTAL OUTSTANDING SGD':'totalAmount', '0.00':'totalAmount', 'SGD':'totalAmount', 'TOTAL':'totalAmount', 'Total':'totalAmount', 'TOTAL':'totalAmount', '$':'totalAmount', 'TOTAL (SGD)':'totalAmount', 'Total aging for each bill to':'totalAmount', 'S$ :':'totalAmount', 'Total in SGD':'totalAmount', '-':'totalAmount', 'Total=$':'totalAmount', 
  'Total Outstandings:':'totalAmount', 'Aged Amounts':'totalAmount', 'SGD:':'totalAmount', 

}
};
async function uploadDataToMongoDB(data) {
  
  try {
    // Save the extracted data to the Invoice collection
    await soaModel.create(data);

    console.log('Data uploaded to MongoDB successfully!');
    console.log(data);
  } catch (error) {
    console.error('Error uploading data to MongoDB:', error);
  }
}

async function getSOADataFromMongoDB() {
  try {
    // const url = 'mongodb+srv://reenee1601:QNbeHPQLj8pwP7UC@cluster0.i4ee9cb.mongodb.net/project_data?retryWrites=true&w=majority'; // Replace with your MongoDB server information
    // await mongoose.connect(url, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });

    const soaData = await soaModel.find(); // Fetch all documents from the 'soa' collection

    // mongoose.disconnect();

    return soaData;
  } catch (error) {
    console.error('Error fetching SOA data from MongoDB:', error);
    throw error;
  }
}


// END OF CONST DICTIONARIES

// Function to perform OCR and extract data
exports.uploadDataSOA = async function(req, res) {

  try {
    const data = req.body; // Declare 'data' using 'const'
    if (data==null) {
      return res.status(400).json({ message: 'No data provided for upload.' });
    }

    await uploadDataToMongoDB(data);

    console.log('Soa data uploaded successfully');
    return res.status(200).json({ message: 'Successfully uploaded soa data.' });
  } catch (err) {
    console.error('Error uploading soa to MongoDB', err);
    return res.status(500).json({ message: 'Error uploading soa data.' });
  }
};
exports.scanData = async function(req, res) { // function for textractData POST endpoint
    console.log('start of console');
    //file = await req.file;
    file = req.file;
    if (!file) {return res.status(500).json({message: 'no file sent'})}
    var ocrData;

    // do file operations here
    try{
        // perform ocr AND extract the tables and forms; look at utils.js for more info
        ocrData = await utils.performOcr(file.path, tablesDict, formsDict);

    } catch (err) {
        console.error('Error performing OCR on file ' + file.originalname, err);
        res.status(500).json({message: 'Error performing OCR on file ' + file.originalname})
        throw error;
    }

    // delete the file after operations
    unlink(file.path, err => {console.log('file deleted'); if (err) {console.log(err)} })
    console.log('end of console')
    
    // return the data to the front end
    res.status(200).json(ocrData)
    // res.json({message:'file uploaded successfully at '})
}


// Function to upload data to MongoDB

// exports.uploadDataSOA = async function(req, res) { // function for uploadData POST endpoint
//     try{data = req.body;
//       //db;
//       if (!data) {
//         return res.status(500).json({message:'Error uploading Invoice to MongoDB'})
//       }
//     //console.log(data)
//     await soaModel.create(data);


//     console.log()
//     return res.status(200).json({message:'Successfully uploaded invoice onto MongoDB'})}
//     catch (err) {
//         console.error('Error uploading Invoice to MongoDB', err);
//         return res.status(500).json({message:'Error uploading Invoice to MongoDB'})
//     }
// }


exports.getSOAData = async function(req, res){ // funcitonfor getData GET endpoint

  try {
      const soaData = await soaModel.find();
        console.log('retreived invoive data')
        res.json(soaData);

        
    } catch (error) {
        console.error('Error fetching SOA data:', error);
        throw error;
    }
}

// Function to export data to an Excel file
async function exportDataToExcel() {
  try {
    const data = await getSOADataFromMongoDB(); // Retrieve data from MongoDB

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Define the Excel columns
    worksheet.columns = [
      { header: 'Invoice ID', key: 'invoiceID', width: 15 },
      { header: 'Issued Date', key: 'issuedDate', width: 15 },
      { header: 'Due Date', key: 'dueDate', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Supplier ID', key: 'supplierID', width: 15 },
      { header: 'Total Amount', key: 'totalAmount', width: 15 },
      // Add more columns as needed
    ];

    // Add the data to the worksheet
    data.forEach((item) => {
      worksheet.addRow(item);
    });

    // Save the workbook to an Excel file
    const filePath = './data.xlsx';
    await workbook.xlsx.writeFile(filePath);
    //console.log(data);
    return filePath;


    console.log('Data exported to Excel successfully!');
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
  }
}

exports.exportDataExcel = async function exportDataExcel(req, res, next){
  try {
    const filePath = await exportDataToExcel();
    console.log(filePath);
    // Set the headers to trigger the file download
    res.setHeader('Content-Disposition', `attachment; filename=${filePath}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Create a read stream from the saved file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    console.log(res);
    console.log("Excel exported");
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
    res.status(500).json({ error: 'Error exporting data to Excel.' });
  }
}

async function exportDataToCSV() {
  try {
    const data = await getSOADataFromMongoDB(); // Retrieve data from MongoDB

    // Convert data to the format expected by the csv-writer library
    const csvData = data.map((item) => ({
      invoiceID: item.invoiceID,
      issuedDate: item.issuedDate,
      dueDate: item.dueDate,
      amount: item.amount,
      supplierID: item.supplierID,
      totalAmount: item.totalAmount,
    }));
    const filePath = path.resolve(__dirname, 'data.csv');
    
    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: 'invoiceID', title: 'Invoice ID' },
        { id: 'issuedDate', title: 'Issued Date' },
        { id: 'dueDate', title: 'Due Date' },
        { id: 'amount', title: 'Amount' },
        { id: 'supplierID', title: 'Supplier ID' },
        { id: 'totalAmount', title: 'Total Amount' },
        
      ],
    });

    // Write the data to the CSV file
    await csvWriter.writeRecords(csvData);
    //console.log(csvData);
    return filePath;

  } catch (error) {
    console.error('Error exporting data to CSV:', error);
    throw error;
  }
}

exports.exportDataCSV = async function exportDataCSV(req, res, next){
  try {
    const filePath = await exportDataToCSV();

    // Set the headers to trigger the file download
    res.setHeader('Content-Disposition', `attachment; filename=${filePath}`);
    res.setHeader('Content-Type', 'text/csv');

    // Create a read stream from the saved file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);

    // Handle errors during stream piping
    fileStream.on('error', (error) => {
      console.error('Error reading CSV file:', error);
      res.status(500).json({ error: 'Error exporting data to CSV.' });
    });

    fileStream.pipe(res);
    console.log("CSV exported");
  } catch (error) {
    console.error('Error exporting data to CSV:', error);
    res.status(500).json({ error: 'Error exporting data to CSV.' });
  }
}

async function getSOADataById(id) {
  try {
    
    /*const url = 'mongodb+srv://reenee1601:QNbeHPQLj8pwP7UC@cluster0.i4ee9cb.mongodb.net/project_data?retryWrites=true&w=majority'; 
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });*/
    const specificSoaData = await soaModel.findById(id); // Fetch data from the 'soa' collection based on the _id

    //mongoose.disconnect();

    return specificSoaData;
  } catch (error) {
    console.error('Error fetching specific SOA data from MongoDB:', error);
    throw error;
  }
}

exports.getSOADataUsingId = async function getSOADataUsingId(req, res, next){
  try {
    const { id } = req.params; // Extract the _id from the URL parameter
    const specificSoaData = await getSOADataById(id);
    res.status(200).json({
      message: 'Fetch specific soa data by id successful!',
      data: specificSoaData
    });
    
  } catch (error) {
    console.error('Error fetching specific SOA data:', error);
    res.status(500).json({ error: 'Error fetching specific SOA data.' });
  }
}
