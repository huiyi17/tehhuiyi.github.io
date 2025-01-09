const request = require('supertest');
const app = require('../app'); // Replace with the path to your Express app file

describe('Payment Controller Endpoints', () => {
  // Test for the scanDataPayment endpoint
  describe('POST /scanDataPayment - Upload and scan payment data', () => {
    it('should upload and scan payment data', async () => {
    try{
      const filePath = '../fileTests/payment.jpg'; 
      const response = await request(app)
        .post('/payment/scanDataPayment')
        .attach('file', filePath);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();

    } catch (error) {
        console.error('Error in test:', error);
        throw error; // Rethrow the error to fail the test
      }
      
    });
  });

  // Test for the sendWhatsApp endpoint
  describe('POST /sendWhatsApp - Send WhatsApp notification', () => {
    it('should send a WhatsApp notification', async () => {
      const response = await request(app).post('/payment/sendWhatsApp');

      expect(response.status).toBe(200);
      
    });
  });
});
