/////// INVOICE CONTROLLER
const { unlink } = require('fs') // use this to delete the file after we're done
const utils = require('../utils/utils.js')
const Invoice = require('../models/invoiceModel');
const mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ExcelJS = require('exceljs');
var path = require('path');

// Establish the MongoDB connection
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

const formsDict = { // list of key-value pairs you want to extract
  headers: ['invoiceID', 'issuedDate', 'dueDate', 'supplierID','GST','totalBeforeGST','totalAfterGST' ],
mapping: {'INVOICE NO.':'invoiceID','Tax Invoice':'invoiceID',
  'Invoice Date':'issuedDate' , 'DATE':'issuedDate', 
    'Due Date': 'dueDate',
  'GST 7%' : 'GST',  'Add 7% GST': 'GST', 
  'TOTAL':'totalAfterGST', 'GRAND TOTAL':'totalAfterGST', 'Grand Total':'totalAfterGST', 'Amount Payable':'totalAfterGST',
  'Sub Total':'totalBeforeGST', 'SUB TOTAL':'totalBeforeGST', 'Net Amount':'totalBeforeGST',
  'SUBTOTAL SGD':'totalBeforeGST', 'TOTAL':'totalBeforeGST'
,'Salesman Code':'supplierID',
  }
};

const tablesDict = { // list of table headers you want to extract
headers: ['productCode', 'quantity', 'amount', 'productName' ],
mapping: {
'ITEM ID' :'productCode','Produc Code':'productCode','Product Code':'productCode', 'ode': 'ProductCode'
 ,'QTY':'quantity', 'Qty' :'quantity', 'QUANTITY':'quantity', 
 'AMOUNT':'amount',  'Amount':'amount', 
'Description':'productName','Description':'productName','DESCRIPTION OF GOODS':'productName',
'DESCRIPTION':'productName' }
};

/*async function uploadDataToMongoDB(data) {

  try {
    // Save the extracted data to the Invoice collection
    await Invoice.create(data);

    console.log('Data uploaded to MongoDB successfully!');
    console.log(data);
  } catch (error) {
    console.error('Error uploading data to MongoDB:', error);
  }
}*/

////// NON EXPORTED FUNCTIONS
////// EXPORTED FUNCTIONS
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
    }

    // delete the file after operations
    unlink(file.path, err => {console.log('file deleted'); if (err) {console.log(err)} })
    console.log('end of console')
    
    // return the data to the front end
    res.status(200).json(ocrData)
    // res.json({message:'file uploaded successfully at '})
}

exports.uploadDataInvoice = async function(req, res) {

  try {
    const data = req.body; // Declare 'data' using 'const'
    if (data==null) {
      return res.status(400).json({ message: 'No data provided for upload.' });
    }

    //await uploadDataToMongoDB(data);
    //await Invoice.validate(data);
    await Invoice.create(data);
    console.log('Invoice data uploaded successfully');
    return res.status(200).json({ message: 'Successfully uploaded invoice data.' });
  } catch (err) {
    console.error('Error uploading Invoice to MongoDB', err);
    return res.status(500).json({ message: 'Error uploading invoice data.' });
  }
};


exports.getData = async function(req, res){ // funcitonfor getData GET endpoint

  try {
      const invoiceData = await Invoice.find();
        console.log('retreived invoive data')
        res.json(invoiceData);
    } catch (error) {
        console.error('Error fetching SOA data:', error);
        throw error;
    }
}

// Function to export data to an Excel file
async function exportInvoiceDataToExcel() {
  try {
    const data = await getSOADataFromMongoDB(); // Retrieve data from MongoDB

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Define the Excel columns
    worksheet.columns = [
      { header: 'Invoice ID', key: 'invoiceID', width: 15 },
      { header: 'Issued Date', key: 'issuedDate', width: 15 },
      { header: 'Due Date', key: 'dueDate', width: 15 },
      { header: 'Supplier ID', key: 'supplierID', width: 15 },
      { header: 'Total Before GST', key: 'totalBeforeGST', width: 15 },
      { header: 'Total After GST', key: 'totalAfterGST', width: 15 },
      { header: 'GST', key: 'GST', width: 15 },
      { header: 'Product Code', key: 'productCode', width: 15 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Product Name', key: 'productName', width: 15 },
      // Add more columns as needed
    ];

    // Add the data to the worksheet
    data.forEach((item) => {
      worksheet.addRow(item);
    });

    // Save the workbook to an Excel file
    const filePath = './InvoiceData.xlsx';
    await workbook.xlsx.writeFile(filePath);
    //console.log(data);
    return filePath;


    console.log('Data exported to Excel successfully!');
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
  }
}

exports.exportInvoiceDataExcel = async function exportInvoiceDataExcel(req, res, next){
  try {
    const filePath = await exportInvoiceDataToExcel();

    // Set the headers to trigger the file download
    res.setHeader('Content-Disposition', `attachment; filename=${filePath}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Create a read stream from the saved file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    console.log("Excel exported");
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
    res.status(500).json({ error: 'Error exporting data to Excel.' });
  }
}

async function exportInvoiceDataToCSV() {
  try {
    const data = await getSOADataFromMongoDB(); // Retrieve data from MongoDB

    // Convert data to the format expected by the csv-writer library
    const csvData = data.map((item) => ({
      invoiceID: item.invoiceID,
      issuedDate: item.issuedDate,
      dueDate: item.dueDate,
      supplierID: item.supplierID,
      totalBeforeGST: item.totalBeforeGST,
      totalAfterGST: item.totalAfterGST,
      GST: item.GST,
      productCode: item.productCode,
      quantity: item.quantity,
      amount: item.amount,
      productName: item.productName,
    }));
    const filePath = path.resolve(__dirname, 'InvoiceData.csv');
    // const filePath = 'data.csv';
    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: 'invoiceID', title: 'Invoice ID' },
        { id: 'issuedDate', title: 'Issued Date' },
        { id: 'dueDate', title: 'Due Date' },
        { id: 'supplierID', title: 'Supplier ID' },
        { id: 'totalBeforeGST', title: 'Total Before GST' },
        { id: 'totalAfterGST', title: 'Total After GST' },
        { id: 'GST', title: 'GST' },
        { id: 'productCode', title: 'Product Code' },
        { id: 'quantity', title: 'Quantity' },
        { id: 'amount', title: 'Amount' },
        { id: 'productName', title: 'Product Name' },
        
        // Add more columns as needed
      ],
    });

    // Write the data to the CSV file
    await csvWriter.writeRecords(csvData);
    //console.log(csvData);
    return filePath;

  } catch (error) {
    console.error('Error exporting data to CSV:', error);
  }
}

exports.exportInvoiceDataCSV = async function exportInvoiceDataCSV(req, res, next){
  try {
    const filePath = await exportInvoiceDataToCSV();

    // Set the headers to trigger the file download
    res.setHeader('Content-Disposition', `attachment; filename=${filePath}`);
    res.setHeader('Content-Type', 'text/csv');

    // Create a read stream from the saved file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    console.log("CSV exported");
  } catch (error) {
    console.error('Error exporting data to CSV:', error);
    res.status(500).json({ error: 'Error exporting data to CSV.' });
  }
}

async function getInvoiceDataById(id) {
  try {
    
    /*const url = 'mongodb+srv://reenee1601:QNbeHPQLj8pwP7UC@cluster0.i4ee9cb.mongodb.net/project_data?retryWrites=true&w=majority'; 
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });*/
    const specificInvoiceData = await Invoice.findById(id); // Fetch data from the 'soa' collection based on the _id

    //mongoose.disconnect();

    return specificInvoiceData;
  } catch (error) {
    console.error('Error fetching specific Invoice data from MongoDB:', error);
    throw error;
  }
}

exports.getInvoiceDataUsingId = async function getSOADataUsingId(req, res, next){
  try {
    const { id } = req.params; // Extract the _id from the URL parameter
    const specificInvoiceData = await getInvoiceDataById(id);
    res.status(200).json({
      message: 'Fetch specific invoice data by id successful!',
      data: specificInvoiceData
    });
    
  } catch (error) {
    console.error('Error fetching specific Invoice data:', error);
    res.status(500).json({ error: 'Error fetching specific Invoice data.' });
  }
}
