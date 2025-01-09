var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController.js');
const handleUploadProd= productController.handleUploadProd;
const getProdDataFromMongoDB= productController.getProdDataFromMongoDB;
const getProdDataUsingId= productController.getProdDataUsingId;


router.post('/uploadDataProd', handleUploadProd);
  
router.get('/getProdData', getProdDataFromMongoDB);

router.get('/getProdData/:id', getProdDataUsingId);


module.exports = router;