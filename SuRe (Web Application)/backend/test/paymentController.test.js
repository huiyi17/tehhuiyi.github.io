
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


const { scanDataPayment, sendWhatsApp } = require("../controllers/paymentController");

const utils = require("../utils/utils");

const accountSid = 'ACb10e36162bf1e9c551cdf7a8ce779d97';
const authToken = '0a0d792f5d5809e00ec4f1ceccc3fadf';
const client = require('twilio')(accountSid, authToken);

const tablesDict = { // list of table headers you want to extract
    headers: ['PayerName', 'Comment', 'Reference'],
    mapping: {
    'From': 'PayerName', 'Your Comments' : 'Comment','Reference No.': 'Reference'}
};

// Mock necessary dependencies
jest.mock("fs", () => ({
  unlink: jest.fn((path, callback) => callback(null)),
}));


jest.mock("../utils/utils", () => ({
  performOcrPayment: jest.fn().mockResolvedValue({}),
}));

jest.mock("../models/paymentModel", () => ({
  create: jest.fn(),
  find: jest.fn(),
}));

// Mock Twilio client
jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn(() => Promise.resolve({ sid: 'message_sid' })),
  },
}));

// Mocked data for positive case (Query returns some payments)
const mockPaymentData = [
  {
    _id: "payment_id_1",
    "PayerName": "xiaobai 274-24649-9",
    "Comment": "PayNow Transfer",
    "Reference": "IMB1261721398300000000C9194077 02910",
  },
];

// Mocked data for negative case (Query returns an empty result)
const mockEmptyPaymentData = [];

jest.mock("../models/paymentModel", () => ({
  create: jest.fn(), // Mocked function for MongoDB create method
  find: jest.fn(() => Promise.resolve(mockPaymentData)), // Positive case query mock
}));

// Alternatively, for the negative case, you can use:
jest.mock("../models/paymentModel", () => ({
  create: jest.fn(),
  find: jest.fn(() => Promise.resolve(mockEmptyPaymentData)), // Negative case query mock
}));

// Positive mock invoice data
const mockPositivePaymentData = {
    "PayerName": "xiaobai 274-24649-9",
    "Comment": "PayNow Transfer",
    "Reference": "IMB1261721398300000000C9194077 02910",
  // Add more properties as needed
};

// Negative mock invoice data (empty invoice)
const mockNegativePaymentData = {}; // An empty object

// Negative mock invoice data (missing required fields)
const mockIncompletePaymentData = {
    "PayerName": "xiaobai 274-24649-9",
  // Missing 'Comment', 'Reference', etc.
  // Add more properties as needed
};

describe("Payment Controller Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks(); // Reset the mock functions before each test
  });


  test("ScanDataPayment should perform OCR successfully and return data", async () => {
    //const req = { file: { path: "/mocked/path/to/file.txt" } };
    const req = { file: { path: "test/payment.jpg" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock successful OCR data
    jest.spyOn(utils, "performOcrPayment").mockResolvedValue({
        "PayerName": "xiaobai 274-24649-9",
        "Comment": "PayNow Transfer",
        "Reference": "IMB1261721398300000000C9194077 02910",
      // Add more properties as needed
    });

    await scanDataPayment(req, res);

    const mockPositivePaymentData = {
        "PayerName": "xiaobai 274-24649-9",
        "Comment": "PayNow Transfer",
        "Reference": "IMB1261721398300000000C9194077 02910",
      // Add more properties as needed
    };

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPositivePaymentData);
  });

  test("scanDataPayment should handle missing file and return 500 status", async () => {
    const req = { file: undefined }; // No file attached in the request
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await scanDataPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error performing OCR Payment on file undefined",
    });
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("scanDataPayment should handle OCR failure and return 500 status", async () => {
    // Mocking an error thrown by performOcrPayment
    jest
      .spyOn(require("../utils/utils"), "performOcrPayment")
      .mockRejectedValue(new Error("OCR Payment Error"));

    const req = { file: { path: "/mocked/path/to/file.txt" } };
    
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await scanDataPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error performing OCR Payment on file undefined", // Update with the actual filename
    });
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("scanDataPayment should return 200 status and data for successful OCR payment", async () => {
    //const req = { file: { path: "/mocked/path/to/file.txt" } };
    const req = { file: { path: "test/payment.jpg" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const mockedOcrPaymentData = {
        "PayerName": "xiaobai 274-24649-9",
        "Comment": "PayNow Transfer",
        "Reference": "IMB1261721398300000000C9194077 02910",
    };

    jest.spyOn(utils, "performOcrPayment").mockResolvedValue(mockedOcrPaymentData);

    await scanDataPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockedOcrPaymentData);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("scanDataPayment should return 200 status and empty data for successful OCR Payment but no extracted data", async () => {
    //const req = { file: { path: "/mocked/path/to/file.txt" } };
    const req = { file: { path: "test/payment.jpg" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    jest.spyOn(utils, "performOcrPayment").mockResolvedValue({}); // Mocked empty OCR Payment data

    await scanDataPayment(req, res);

    //expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toEqual(200);
    expect(res.json).toHaveBeenCalledWith({}); // Empty OCR Payment data
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("scanDataPayment should return 200 status and data for successful OCR payment and the data uploaded to mongodb successfully", async () => {
    //const req = { file: { path: "/mocked/path/to/file.txt" } };
    const req = { file: { path: "test/payment.jpg" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const mockedOcrPaymentData = {
        "PayerName": "xiaobai 274-24649-9",
        "Comment": "PayNow Transfer",
        "Reference": "IMB1261721398300000000C9194077 02910",
    };

    jest.spyOn(utils, "performOcrPayment").mockResolvedValue(mockedOcrPaymentData);

    await scanDataPayment(req, res);
    await paymentModel.create(res.json);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockedOcrPaymentData);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("sendWhatsApp should send a WhatsApp message successfully", async () => {
    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await sendWhatsApp(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'WhatsApp message sent successfully.' });
  });

  test("sendWhatsApp should handle an error and return 500 status", async () => {
    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock Twilio client to throw an error
    jest.mock('twilio', () => () => ({
      messages: {
        create: jest.fn(() => Promise.reject(new Error('Twilio error'))),
      },
    }));

    await sendWhatsApp(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error sending WhatsApp notification: Twilio error' });
  });


});

afterAll(async () => {
    await mongoose.connection.close();
    //await request.post('/close-mongoose-connection');
    console.log('connection closed');
});
