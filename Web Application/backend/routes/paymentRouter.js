var express = require('express');
var router = express.Router();
const paymentController = require('../controllers/paymentController.js');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + 'payment'+ '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage })

// Create a route to handle the data upload
router.post('/scanDataPayment', upload.single('file'), paymentController.scanDataPayment); // run textract analysis on given data. 
router.post('/sendWhatsApp', paymentController.sendWhatsApp);


module.exports = router;