const webdriver = require('selenium-webdriver');
const { Builder, By, Key, until } = webdriver;
const chrome = require('selenium-webdriver/chrome');

  // Config to disable CORS
const options = new chrome.Options();
options.addArguments('--disable-web-security');  // Disable CORS restrictions

  // Initialize the WebDriver (Chrome in this case)
const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();


(async function register() {
  try {
    // Open the website
    await driver.get('http://www.localhost:3000/registerpage');

    // Maximize the browser window
    await driver.manage().window().maximize();

    console.log("Setting up register account.")
    // Wait for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Find the multifield form and input a query
    const nameField = await driver.findElement(By.name('fullName'));
    await nameField.sendKeys('automated_test');

    const companyField = await driver.findElement(By.name('company'));
    await companyField.sendKeys('SUTD ESC');

    const emailField = await driver.findElement(By.name('email'));
    await emailField.sendKeys('automatedTest@test.com');

    const passwordField = await driver.findElement(By.name('password'));
    await passwordField.sendKeys('test1234');

    const confirmPasswordField = await driver.findElement(By.name('confirmPassword'));
    // await confirmPasswordField.sendKeys('test1234', Key.ENTER);
    await confirmPasswordField.sendKeys('test1234');

    console.log("Submitting register account...")

    const registerButton = await driver.findElement(By.name('registerSubmitButton'));
    registerButton.click();

    // Wait for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Attempt login with credentials
    console.log("Attempt login with wrong password...");
    await driver.get('http://www.localhost:3000/signinpage');
    const emailLoginField = await driver.findElement(By.name('email'));
    await emailLoginField.sendKeys('automatedTest@test.com');

    //purposely inputting wrong password, should not be able to login
    const passwordLoginField = await driver.findElement(By.name('password'));
    await passwordLoginField.sendKeys('wrongpassword');

    const loginButton = await driver.findElement(By.name('loginSubmitButton'));
    await loginButton.click();
    const errorMessage = await driver.wait(until.elementLocated(By.name('error')), 10000);
    const errorP = await errorMessage.getText();
    console.log('Error Message:', errorP);
    if (errorP == "Invalid email or password. Please try again."){
      console.log("Wrong credentials test passed.");
    }  

    // Wait for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    //correct credentials, should be able to login
    console.log("Attempting login with correct credentials...");
    await passwordLoginField.clear();
    await passwordLoginField.sendKeys('test1234');
    await loginButton.click();

    try{
    // Wait for the first search result to appear and get its title
    const welcomeHeader = await driver.wait(until.elementLocated(By.name('header')), 10000);
    const title = await welcomeHeader.getText();
    console.log('Test regist/login passed. Title:', title);
    }
    catch (error){
      console.log("Test failed: " , error.message);
    }
  } 
  catch(error){
    console.log("Problem in the middle portion of code: ", error.message)
  }
  finally {
    // Wait for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    // Close the browser
    await driver.quit();
  }
})();
