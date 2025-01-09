var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const creditNoteController = require('../controllers/creditNoteController.js');
const uploadDataSOA= creditNoteController.uploadDataCD;
const getSOAData= creditNoteController.getCDData;
const getSOADataUsingId= creditNoteController.getCDDataUsingId;


router.post('/uploadDataCD', upload.single('pdfFile'), uploadDataSOA);
  
router.get('/getCDData', getSOAData);


router.get('/getCDData/:id', getSOADataUsingId);


module.exports = router;