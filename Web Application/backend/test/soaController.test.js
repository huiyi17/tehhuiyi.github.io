const { uploadDataSOA, getSOAData, getSOADataUsingId} = require('../controllers/soaController');
const soaModel = require('../models/soaModel'); 

jest.mock('../models/soaModel');

describe('uploadDataSOA - Boundary Tests (Valid Data)', () => {
    it('should upload valid data to MongoDB', async () => {
      const req = { body: { 
            'invoiceID': ["IV167626"],
            'issuedDate': ["10/08/2023"],
            'dueDate': ["10/09/2023"],
            'amount': ["200"],
            'supplierID': 'SHVD15245',
            'totalAmount': '1000',
          } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await uploadDataSOA(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Successfully uploaded soa data.' });
    });
  });

  describe('uploadDataSOA - Negative Tests (Invalid Data)', () => {
    it('should return error when data is missing', async () => {
      const req = { body: undefined }; // Missing data
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await uploadDataSOA(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No data provided for upload.' });
    });
  });

  describe('uploadDataSOA - Boundary Tests (Empty Data)', () => {
    it('should return success for empty data', async () => {
      const req = { body: {} }; // Empty data
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await uploadDataSOA(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Successfully uploaded soa data.' });
    });
  });

  describe('uploadDataSOA - Boundary Tests (Successful Upload)', () => {
    it('should return success for a successful data upload', async () => {
      const req = { body: { 
        'invoiceID': ["IV167626"],
        'issuedDate': ["10/08/2023"],
        'dueDate': ["10/09/2023"],
        'amount': ["200"],
        'supplierID': 'SHVD15245',
        'totalAmount': '1000',
      }  };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      // Mocking the uploadDataToMongoDB function to resolve successfully
      jest.mock('../controllers/soaController.js', () => ({
        uploadDataToMongoDB: jest.fn(),
      }));
  
      await uploadDataSOA(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Successfully uploaded soa data.' });
    });
  });
  
  
  describe('getSOAData Tests', () => {
    it('should fetch and return soa data', async () => {
      const expectedData = [ { 
        'invoiceID': ["IV167626"],
        'issuedDate': ["10/08/2023"],
        'dueDate': ["10/09/2023"],
        'amount': ["200"],
        'supplierID': 'SHVD15245',
        'totalAmount': '1000',
      }  ];
  
      // Mock soaModel.find to return the expected data
      soaModel.find.mockResolvedValue(expectedData);
  
      const req = {};
      const res = { json: jest.fn() };
  
      await getSOAData(req, res);
  
      expect(res.json).toHaveBeenCalledWith(expectedData);
    });
  
    });

describe('getSOADataUsingId Tests', () => {
    afterEach(() => {
    jest.clearAllMocks();
    });

    it('should fetch specific soa data by id', async () => {
        const mockData = {
            _id: '64d0e47013cacaeaefc1e790', 
            invoiceID: ['IV167626'],
            amount: ['200'],
          };
      
          const req = { params: { id: '64d0e47013cacaeaefc1e790' } };
          const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      
          jest.spyOn(soaModel, 'findById').mockResolvedValueOnce(mockData);
      
          await getSOADataUsingId(req, res);
      
          expect(soaModel.findById).toHaveBeenCalledWith('64d0e47013cacaeaefc1e790');
          expect(res.status).toHaveBeenCalledWith(200);
          // expect(res.json).toHaveBeenCalledWith(mockData);
        });
        
    it('should handle error when fetching specific soa data fails', async () => {
        const expectedError = new Error('Mocked error');

        const req = { params: { id: '64d0e47013cacaeaefc1e790' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
        jest.spyOn(soaModel, 'findById').mockRejectedValue(expectedError);
    
        await getSOADataUsingId(req, res);
    
        expect(soaModel.findById).toHaveBeenCalledWith('64d0e47013cacaeaefc1e790');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching specific SOA data.' });
      });

    it('should handle missing id parameter', async () => {
    const req = { params: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getSOADataUsingId(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching specific SOA data.' });
    });
});