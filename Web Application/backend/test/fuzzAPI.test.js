const request = require('supertest');
const app = require('../app'); 
const mongoose = require('mongoose');
const {url, iteration} = require('../config/configuration');

function generateRandomInvalidRoute() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const routeLength = Math.floor(Math.random() * 10) + 1; // Generate a route length between 1 and 10 characters
  
    let route = '/invalid';
  
    for (let i = 0; i < routeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      route += characters[randomIndex];
    }
  
    return route;
  }
  
const invalidRoutes = [];
for (let i = 0; i < iteration; i++) {
const invalidRoute = generateRandomInvalidRoute();

invalidRoutes.push(invalidRoute);
}

beforeAll(async () => {
    //connection to mongoDB database

    await mongoose
      .connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log("Successfully connect to MongoDB.");
      })
      .catch(err => {
        console.error("Connection error", err);
        process.exit();
      });
});

describe('API fuzzing test', () => {
  test('API endpoint checker', async () => {
    for (let i = 0; i < invalidRoutes.length * 5; i++) {
      try {
        const word = invalidRoutes[Math.floor(Math.random() * naughty.length)];
        const endpoint = '/api/' + word;
        const res = await request(app).get(endpoint);
        
        expect(res.statusCode).toBeOneOf([404, 400]);

      } catch (error) {
        expect(error).toBeTruthy(); // Ensure there's an error
      }
    }
  });
});


afterAll(async () => {
    await mongoose.connection.close();
    console.log('connection closed');
  });