var express = require('express');
var router = express.Router();

//const uploadDataSOA= soaController.uploadDataSOA;

const {getSOAData, exportDataCSV,exportDataExcel,getSOADataUsingId,uploadDataSOA,scanData} =require('../controllers/soaController.js');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + 'soa'+ '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage })

router.post('/scanData', upload.single('file'), scanData)
  

router.get('/getSOAData', getSOAData);

router.get('/exportToCSV', exportDataCSV);

router.get('/exportToExcel', exportDataExcel);

router.get('/getSOAData/:id', getSOADataUsingId);
router.post('/uploadDataSOA', uploadDataSOA);


module.exports = router;
