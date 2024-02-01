/////// INVOICE CONTROLLER
const { unlink } = require('fs') // use this to delete the file after we're done
const utils = require('../utils/utils.js')
//const Invoice = require('../models/invoiceModel');
const paymentModel = require('../models/paymentModel');
const johnPackage = require('john-package');
const mongoose = require('mongoose');

const accountSid = 'ACb10e36162bf1e9c551cdf7a8ce779d97';
const authToken = '4b9979e0b448bad52d5beb6537bcee05';
const client = require('twilio')(accountSid, authToken);


// const { Client } = require('whatsapp-web.js');
// const client = new Client();

const tablesDict = { // list of table headers you want to extract
headers: ['PayerName', 'Comment', 'Reference'],
mapping: {
'From': 'PayerName', 'Your Comments' : 'Comment','Reference No.': 'Reference'}
};

// client.on('qr', (qr) => {

//   });
// client.on('ready', () => {
//     console.log('WhatsApp client is ready');
//     // Now the client is ready, you can send messages
//   });
  
// client.initialize();



////// NON EXPORTED FUNCTIONS
////// EXPORTED FUNCTIONS
exports.scanDataPayment = async function(req, res) { // function for textractData POST endpoint
    console.log('start of console');
    file = await req.file;
    if (!file) {res.status(500).json({message: 'no file sent'})}
    var ocrDataPayment;
    console.log(file);
    console.log(ocrDataPayment);

    // do file operations here
    try{
        // perform ocr AND extract the tables and forms; look at utils.js for more info
        //ocrDataPayment = await utils.performOcrPayment("C:/HuiYi/SUTD/Modules/Term 5/Elements of Software Construction/payment.jpg", tablesDict);
        ocrDataPayment = await utils.performOcrPayment(file.path, tablesDict);
        await paymentModel.create(ocrDataPayment);

    } catch (err) {
        console.error('Error performing OCR Payment on file ' + file.originalname, err);
        res.status(500).json({message: 'Error performing OCR Payment on file ' + file.originalname})
    }

    // delete the file after operations
    unlink(file.path, err => {console.log('file deleted'); if (err) {console.log(err)} })
    console.log('end of console')
    
    // return the data to the front end
    res.json(ocrDataPayment)
    // res.json({message:'file uploaded successfully at '})
}


exports.sendWhatsApp = async function(req, res) {
    //const phoneNumber = '+6583023966'; // Replace with the recipient's phone number including country code (e.g., +1234567890)
    try {
        client.messages
            .create({
                body: 'Payment received!',
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+6583023966'
            })
            .then(message => console.log(message.sid))
            .done();
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
    }
  }
