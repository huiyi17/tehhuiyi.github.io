const { handleUploadProd, getProdDataFromMongoDB, getProdDataUsingId} = require('../controllers/productController');
const productModel = require('../models/productModel'); 

jest.mock('../models/productModel');

describe('handleUploadProd - Boundary Tests (Valid Data)', () => {
    it('should upload valid data to MongoDB', async () => {
      const req = { body: { 
            'image': 'product1.jpg',
            'productName': 'Apple',
            'supplierID': 'supplier123',
            'price': 2.5,
            'productCode': 'APL123',
            'quantity': 50,
            'description': 'Fresh and delicious apples.',
          } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await handleUploadProd(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'File uploaded and data extracted successfully!' });
    });
  });

  describe('handleUploadProd - Negative Tests (Invalid Data)', () => {
    it('should return error when data is missing', async () => {
      const req = { body: undefined }; // Missing data
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await handleUploadProd(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No valid data provided for upload.' });
    });
  });

  describe('handleUploadProd - Boundary Tests (Empty Data)', () => {
    it('should return success for empty data', async () => {
      const req = { body: {} }; // Empty data
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await handleUploadProd(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'File uploaded and data extracted successfully!' });
    });
  });

  describe('handleUploadProd - Boundary Tests (Successful Upload)', () => {
    it('should return success for a successful data upload', async () => {
      const req = { body: { 
        'image': 'product1.jpg',
        'productName': 'Apple',
        'supplierID': 'supplier123',
        'price': 2.5,
        'productCode': 'APL123',
        'quantity': 50,
        'description': 'Fresh and delicious apples.',
      }  };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      // Mocking the uploadDataToMongoDBProd function to resolve successfully
      jest.mock('../controllers/productController.js', () => ({
        uploadDataToMongoDBProd: jest.fn(),
      }));
  
      await handleUploadProd(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'File uploaded and data extracted successfully!' });
    });
  });
  
  
  describe('getProdDataFromMongoDB Tests', () => {
    it('should fetch and return product data', async () => {
      const expectedData = [ { 
        'image': 'product1.jpg',
        'productName': 'Apple',
        'supplierID': 'supplier123',
        'price': 2.5,
        'productCode': 'APL123',
        'quantity': 50,
        'description': 'Fresh and delicious apples.',
      }  ];
  
      // Mock productModel.find to return the expected data
      productModel.find.mockResolvedValue(expectedData);
  
      const req = {};
      const res = { json: jest.fn() };
  
      await getProdDataFromMongoDB(req, res);
  
      expect(res.json).toHaveBeenCalledWith(expectedData);
    });
  
    });

describe('getProdDataUsingId Tests', () => {
    afterEach(() => {
    jest.clearAllMocks();
    });

    it('should fetch specific product data by id', async () => {
        const mockData = {
            _id: '123456789012345678901234', 
            productName: 'Sample Product',
            price: 10.99,
          };
      
          const req = { params: { id: '123456789012345678901234' } };
          const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      
          jest.spyOn(productModel, 'findById').mockResolvedValueOnce(mockData);
      
          await getProdDataUsingId(req, res);
      
          expect(productModel.findById).toHaveBeenCalledWith('123456789012345678901234');
          expect(res.status).toHaveBeenCalledWith(200);
          // expect(res.json).toHaveBeenCalledWith(mockData);
        });
        
    it('should handle error when fetching specific product data fails', async () => {
        const expectedError = new Error('Mocked error');

        const req = { params: { id: '123456789012345678901234' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
        jest.spyOn(productModel, 'findById').mockRejectedValue(expectedError);
    
        await getProdDataUsingId(req, res);
    
        expect(productModel.findById).toHaveBeenCalledWith('123456789012345678901234');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching specific products data.' });
      });

    it('should handle invalid id format', async () => {
    const req = { params: { id: 'invalidId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getProdDataUsingId(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid id format.' });
    });

    it('should handle missing id parameter', async () => {
    const req = { params: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getProdDataUsingId(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching specific products data.' });
    });
});