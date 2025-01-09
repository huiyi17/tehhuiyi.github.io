const app = require("../app.js"); 
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require('mongoose')
const url = 'mongodb+srv://reenee1601:QNbeHPQLj8pwP7UC@cluster0.i4ee9cb.mongodb.net/project_data?retryWrites=true&w=majority';


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

// test upload
/// test normal upload
test('scanData on a normal file', async () => {
  const res = await request.post("/invoice/scanData")
            .attach('file', 'test/censored.jpg'); // send the censored file for scanning
  expect(res.status).toEqual(200);
}, 30000); // increase timeout to 30s
/// test empty upload
//
test('scanData on a empty input', async () => {
  const res = await request.post("/invoice/scanData")
            .attach('file', undefined); // send the censored file for scanning
  expect(res.status).toEqual(500);
}, 30000); // increase timeout to 30s


// test uploadData endpoints
/// upload a normal fully filled data
//
test('uploadData fully filled according to schema', async () => {
  const res = await request.post("/invoice/uploadDataInvoice")
                  .send({
        invoiceID: '111111',
        issuedDate: 'today',
        dueDate: 'tomorrow',
        supplierID: '2',
        totalBeforeGST: '200',
        totalAfterGST: '216',
        GST: '16',
        productCode: ['1', '2'],
        quantity: ['500', '211'],
        amount: ['33', '22'],
        productName: ['fish', 'chese'],
                  })
  expect(res.status).toEqual(200);
});
/// upload an empty object

test('uploadData with undefined object', async () => {
  const res = await request.post("/invoice/uploadDataInvoice")
                  .send(undefined);
  expect(res.status).toEqual(500);
});

// get data from mongo
test('invoice getData endpoint test', async() => {
  const res = await request.get("/invoice/getData");
  //console.log(res);
  expect(res.status).toEqual(200);


});

  
  
// close the mongoose connection
afterAll(async () => {
    await mongoose.connection.close();
    //await request.post('/close-mongoose-connection');
    console.log('connection closed');
});
