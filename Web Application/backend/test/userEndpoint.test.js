const app = require("../app.js"); 
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require('mongoose');
const config = require('../config/configuration.js');
const userModel = require('../models/userModel.js');


beforeAll(async () => {
    //connection to mongoDB database

    await mongoose
      .connect(config.url,{
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

// Generate random email 
function generateRandomEmail() {
  const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'example.com', 'customdomain.org'];
  const invalidLocalParts = ['user', 'invalid', '123456', 'test'];
  const allCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789_.'; // Include underscores and periods

  const isInvalid = Math.random() < 0.3; // 30% chance of generating an invalid email

  let randomEmail;

  if (isInvalid) {
    const invalidLocalPart = invalidLocalParts[Math.floor(Math.random() * invalidLocalParts.length)];
    randomEmail = `${invalidLocalPart}@${validDomains[Math.floor(Math.random() * validDomains.length)]}`;
  } else {
    const randomDomain = validDomains[Math.floor(Math.random() * validDomains.length)];
    const randomLocalPartLength = Math.floor(Math.random() * 10) + 1; // Random local part length between 1 and 10
    let randomLocalPart = '';
    for (let i = 0; i < randomLocalPartLength; i++) {
      const randomChar = allCharacters[Math.floor(Math.random() * allCharacters.length)];
      randomLocalPart += randomChar;
    }
    randomEmail = `${randomLocalPart}@${randomDomain}`;
  }

  return randomEmail;
}

// Generate random password
function generateRandomPassword() {
  const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.'; // Include underscores and periods
  const invalidChars = '!@#$%^&*()_-+=<>?/'; // List of characters that can make a password invalid

  const isInvalid = Math.random() < 0.3; // 30% chance of generating an invalid password

  let randomPassword;

  if (isInvalid) {
    const invalidLength = Math.random() < 0.5 ? Math.floor(Math.random() * 7) : Math.floor(Math.random() * 20) + 9; // 50% chance of generating too short password, 50% chance of generating too long password
    const invalidPassword = Array.from({ length: invalidLength }, () => invalidChars[Math.floor(Math.random() * invalidChars.length)]).join('');
    randomPassword = `invalid_${invalidPassword}`; // Prefix with "invalid_" and add invalid characters
  } else {
    const validPasswordLength = Math.floor(Math.random() * 5) + 8; // Random password length between 8 and 12
    let password = '';
    for (let i = 0; i < validPasswordLength; i++) {
      const randomChar = validChars[Math.floor(Math.random() * validChars.length)];
      password += randomChar;
    }
    randomPassword = password;
  }

  return randomPassword;
}

// Generate random name
function generateRandomName() {
  const maxNameLength = 50; // Maximum allowed name length

  const nameLength = Math.floor(Math.random() * (maxNameLength - 1)) + 1; // Random name length between 1 and maxNameLength - 1

  const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '; // Include space

  let name = '';
  for (let i = 0; i < nameLength; i++) {
    const randomChar = validChars[Math.floor(Math.random() * validChars.length)];
    name += randomChar;
  }

  return name;
}

// Generate random company name
function generateRandomCompanyName() {
  const maxCompanyNameLength = 100; // Maximum allowed company name length

  const companyNameLength = Math.floor(Math.random() * (maxCompanyNameLength - 1)) + 1; // Random company name length between 1 and maxCompanyNameLength - 1

  const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '; // Include space

  let companyName = '';
  for (let i = 0; i < companyNameLength; i++) {
    const randomChar = validChars[Math.floor(Math.random() * validChars.length)];
    companyName += randomChar;
  }

  return companyName;
}



// Fuzzing test
// Fuzzing Test random email (valid and invalid) 
test('Fuzzing testing on random generated email, name, password and company name for register', async () => {


  for (let i = 0; i < config.iteration; i++) {
    const randomEmail = generateRandomEmail();
    const randomPassword = generateRandomPassword();
    const randomName = generateRandomName();
    const randomCompany = generateRandomCompanyName();

    const res = await request.post("/users/register").send({
      email: randomEmail,
      password: randomPassword,
      company: randomCompany,
      name: randomName
    });

    if (res.status === 201) {
      // Successful response
      expect(res.status).toEqual(201);
      expect(res.body.message).toEqual('User Created Successfully');
      console.log(`Iteration ${i + 1}: SUCCESS - User Created Successfully`);
      expect(res.body.user).toBeDefined();

      // Validate data in the database
      const userInDb = await userModel.findOne({ email: randomEmail });
      expect(userInDb).toBeTruthy();
      expect(userInDb.email).toEqual(randomEmail);
      expect(userInDb.name).toEqual(randomName);
      expect(userInDb.company).toEqual(randomCompany);

    } else {
      // Error response
      expect(res.status).toEqual(400);
      console.log(`Iteration ${i + 1}: ERROR - ${res.body.message}`);
    }
  }
}, 50000);

// Fuzzing for signin
test('Fuzzing signin', async () => {
  for (let i = 0; i < config.iteration; i++) {

    const res = await request.post("/users/signin").send({
        email:generateRandomEmail(),
        password:generateRandomPassword()
    });
    if (res.status === 200) {
      // Successful response
      expect(res.status).toEqual(200);
      expect(res.body.message).toEqual('User Signin Successfully');
      console.log(`Iteration ${i + 1}: SUCCESS - User Signin Successfully`);
      expect(Boolean(res.body.token)).toEqual(true);
  }
    else {
      // Error response
      expect(res.status).toEqual(400);
      console.log(`Iteration ${i + 1}: ERROR - ${res.body.message}`);
  }
}
    
}, 50000);

// Test user creatoion; make a user whos email is the current datetime
var myemail
test('Make new user', async () => {
    myemail = new Date().getTime() + '@test.com.sg'
    const res = await request.post("/users/register").send({
        email:myemail,
        password:"password",
        company:"ichigo",
        name:"ruby"
    });
    console.log(res);
    expect(res.status).toEqual(201);

});

// Test signing up with duplicate email: use the same email used as above
test('Make new user with duplicate email', async () => {
    const res = await request.post("/users/register").send({
        email:myemail,
        password:"password",
        company:"ichigo",
        name:"ruby"
    });
    expect(res.status).toEqual(400); 

}); 

/// Test signin
// Signin successful
test('Successful signin', async () => {
    const res = await request.post("/users/signin").send({
        email:myemail,
        password:"password"
    });
    expect(res.status).toEqual(200);
    expect(Boolean(res.body.token)).toEqual(true); // check that a random token is generated
});

// email does not exist
test('No such email found', async() => {
    const res = await request.post("/users/signin").send({
        email:"ThisEmailDoesNotExist@test.com",
        password:"password"
    });
    expect(res.status).toEqual(400);
});
    
// password does not match
test('Password does not match', async() => {
    const res = await request.post("/users/signin").send({
        email:myemail,
        password:"passwordddddd"
    });
    expect(res.status).toEqual(400);
});

/*boundary cases for very long emails, very short 
and long passwords, and very long names. 
The negative test cases test for empty email, password, and name fields.*/

// Test very long email
test('Very long email', async () => {
    const longEmail = "a".repeat(300) + "@test.com";
    const res = await request.post("/users/register").send({
      email: longEmail,
      password: "password",
      company: "ichigo",
      name: "ruby"
    });
    expect(res.status).toEqual(400);
  });


  // Test very short password
test('Very short password', async () => {
    const res = await request.post("/users/register").send({
      email: "test@test.com",
      password: "a", // Short password
      company: "ichigo",
      name: "ruby"
    });
    expect(res.status).toEqual(400);
  });

// Test very long name
test('Very long name', async () => {
    const longName = "a".repeat(60); // Create a name with more than 50 characters
    const res = await request.post("/users/register").send({
      email: "vai@example.com",
      password: "password",
      company: "ichigo",
      name: longName,
    });
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Name is too long. Please use a shorter name.');
  });

// Test empty email field
test('Empty email field', async () => {
    const res = await request.post("/users/register").send({
      email: "",
      password: "password",
      company: "ichigo",
      name: "ruby"
    });
    expect(res.status).toEqual(400);
  });


// Test empty password field
test('Empty password field', async () => {
    const res = await request.post("/users/register").send({
      email: "test@test.com",
      password: "",
      company: "ichigo",
      name: "ruby"
    });
    expect(res.status).toEqual(400);
  });
  
// Test empty name field
test('Empty name field', async () => {
const res = await request.post("/users/register").send({
    email: "test@test.com",
    password: "password",
    company: "ichigo",
    name: ""
});
expect(res.status).toEqual(400);
});

  
// close the mongoose connection
afterAll(async () => {
    await mongoose.connection.close();
    //await request.post('/close-mongoose-connection');
    console.log('connection closed');
});
