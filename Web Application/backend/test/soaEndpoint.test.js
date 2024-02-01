const request = require('supertest');
const app = require('../app'); 
const path = require('path');
const fs = require('fs');

// Test suite for the SOA controller endpoints
describe('SOA Controller Endpoints', () => {
  // Test for the scanData endpoint
  test('POST /scanData - Upload and scan data', async () => {
    const filePath = path.join(__dirname, '../fileTests/soa.pdf'); 
    const response = await request(app)
      .post('/soa/scanData')
      .attach('file', filePath); 
  
    expect(response.status).toBe(200);
  });

  // Test for the getSOAData endpoint
  test('GET /getSOAData - Get all SOA data', async () => {
    const response = await request(app).get('/soa/getSOAData');

    expect(response.status).toBe(200);
    
  });

  // Test for the exportToCSV endpoint
  test('GET /exportToCSV - Export SOA data to CSV', async () => {
    const response = await request(app).get('/soa/exportToCSV');
  
    expect(response.status).toBe(200);
  
    // Ensure the response is fully processed before asserting
    await new Promise((resolve) => {
      response.res.on('finish', resolve);
    });
  });
  test('GET /exportToExcel - Export SOA data to Excel', async () => {
    const response = await request(app).get('/soa/exportToExcel');

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toMatch('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // Add assertions to check other response headers or content
  });

  test('GET /getSOAData/:id - Get specific SOA data by ID', async () => {
    // Assuming you have a valid ID from your database
    const validId = 'valid-id'; // Replace with a valid ID
    const response = await request(app).get(`/soa/getSOAData/${validId}`);

    console.log('Response Status:', response.status);
    console.log('Response Body:', response.body);


    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    
  });

  test('POST /uploadDataSOA - Upload SOA data', async () => {
    const testData = {
      // Define your test data here
    };

    const response = await request(app)
      .post('/soa/uploadDataSOA')
      .send(testData);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Successfully uploaded invoice onto MongoDB');
    // Add assertions to check the response or saved data in the database
  });
});
  
