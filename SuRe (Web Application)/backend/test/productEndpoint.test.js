const request = require('supertest');
const app = require('../app'); 

describe('Product Controller Endpoints', () => {
  test('POST /uploadDataProd - Upload and handle product data', async () => {
    const data = {
            'image': 'product1.jpg',
            'productName': 'Apple',
            'supplierID': 'supplier123',
            'price': 2.5,
            'productCode': 'APL123',
            'quantity': 50,
            'description': 'Fresh and delicious apples.',
    };

    const response = await request(app)
      .post('/product/uploadDataProd')
      .send(data);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'File uploaded and data extracted successfully!' });
  });

  test('GET /getProdData - Get all product data', async () => {
    const response = await request(app).get('/product/getProdData');

    expect(response.status).toBe(200);
    
  });

  test('GET /getProdData/:id - Get specific product data by ID', async () => {
    // Replace 'validProductId' with an actual valid MongoDB ID
    const validProductId = '64cb495a9218dc2484055ee3';

    const response = await request(app).get(`/product/getProdData/${validProductId}`);

    expect(response.status).toBe(200);
    
  });

  test('GET /getProdData/:id - Invalid ID format', async () => {
    const invalidProductId = 'invalidProductId';

    const response = await request(app).get(`/product/getProdData/${invalidProductId}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid id format.' });
  });
});
