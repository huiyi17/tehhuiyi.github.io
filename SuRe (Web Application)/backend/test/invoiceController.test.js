const { uploadDataInvoice, getData} = require('../controllers/invoiceController');
const Invoice = require('../models/invoiceModel'); 

jest.mock('../models/invoiceModel');

describe('uploadDataInvoice - Boundary Tests (Valid Data)', () => {
    it('should upload valid data to MongoDB', async () => {
      const req = { body: { 
            'invoiceID': "IV167626",
            'issuedDate': "10/08/2023",
            'dueDate': "10/09/2023",
            'supplierID': "SDUV1122",
            'totalBeforeGST': "199",
            'totalAfterGST': "208",
            'GST': "9",
            'productCode': ['SHVD15245'],
            'quantity': ['10'],
            'amount': ["200"],
            'productName': ['Apple'],
          } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await uploadDataInvoice(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Successfully uploaded invoice data.' });
    });
  });

  describe('uploadDataInvoice - Negative Tests (Invalid Data)', () => {
    it('should return error when data is missing', async () => {
      const req = { body: undefined }; // Missing data
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await uploadDataInvoice(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No data provided for upload.' });
    });
  });

  describe('uploadDataInvoice - Boundary Tests (Empty Data)', () => {
    it('should return success for empty data', async () => {
      const req = { body: {} }; // Empty data
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await uploadDataInvoice(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Successfully uploaded invoice data.' });
    });
  });

  describe('uploadDataInvoice - Boundary Tests (Successful Upload)', () => {
    it('should return success for a successful data upload', async () => {
      const req = { body: { 
        'invoiceID': "IV167626",
        'issuedDate': "10/08/2023",
        'dueDate': "10/09/2023",
        'supplierID': "SDUV1122",
        'totalBeforeGST': "199",
        'totalAfterGST': "208",
        'GST': "9",
        'productCode': ['SHVD15245'],
        'quantity': ['10'],
        'amount': ["200"],
        'productName': ['Apple'],
      }  };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      // Mocking the uploadDataToMongoDB function to resolve successfully
    //   jest.mock('../controllers/invoiceController.js', () => ({
    //     uploadDataToMongoDB: jest.fn(),
    //   }));

  
      await uploadDataInvoice(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Successfully uploaded invoice data.' });
    });
  });
  
  
  describe('getData Tests', () => {
    it('should fetch and return invoice data', async () => {
      const expectedData = [ { 
        'invoiceID': "IV167626",
        'issuedDate': "10/08/2023",
        'dueDate': "10/09/2023",
        'supplierID': "SDUV1122",
        'totalBeforeGST': "199",
        'totalAfterGST': "208",
        'GST': "9",
        'productCode': ['SHVD15245'],
        'quantity': ['10'],
        'amount': ["200"],
        'productName': ['Apple'],
      }  ];
  
      // Mock soaModel.find to return the expected data
      Invoice.find.mockResolvedValue(expectedData);
  
      const req = {};
      const res = { json: jest.fn() };
  
      await getData(req, res);

      expect(res.json).toHaveBeenCalledWith(expectedData);
    });
  
    });

