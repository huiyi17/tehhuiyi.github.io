// invoiceRouter.js

var express = require('express');
var router = express.Router();
//const invoiceController = require('../controllers/invoiceController.js');
const {scanData, uploadDataInvoice,getData,exportDataCSV,exportDataExcel} = require('../controllers/invoiceController.js');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + 'invoice'+ '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage })

router.post('/scanData', upload.single('file'), scanData);
router.post('/uploadDataInvoice', uploadDataInvoice); 
router.get('/getData', getData);
// router.get('/exportInvoiceToCSV', exportInvoiceDataCSV);
// router.get('/exportInvoiceToExcel', exportInvoiceDataExcel);

module.exports = router;
