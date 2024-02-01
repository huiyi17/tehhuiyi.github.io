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

(async function uploadSOA() {
    try {
      // Open the website
      await driver.get('http://www.localhost:3000/uploadpage');
  
      // Maximize the browser window
      await driver.manage().window().maximize();
  
      // Find the soa input and click
      console.log("Finding SOA Input")
      let outerDiv = await driver.wait(until.elementLocated(By.className('alluploads')));
      let innerDiv = await outerDiv.findElement(By.name('outerDiv'));
      const SOAType = await innerDiv.findElement(By.name('soa'));

      console.log("or me?")
      await SOAType.click();

      console.log("me?")
  
      // Setting soa image
      const SOAFilePath = "C:/Users/ruanx/Desktop/SUTD_y1/Term5/Elements Of Software/website/myapp/myapp/public/images/soa1.pdf";
      const SOAInput = await driver.findElement(By.className('input-field'));
      await SOAInput.sendKeys(SOAFilePath);
  
      const uploadButton = await driver.findElement(By.name('submitButton'));
      await uploadButton.click();

      console.log("or me me?")
  
  
      // Check if any OCR missed scan
      outerDiv = await driver.wait(until.elementLocated(By.name('locator')));
      innerDiv = await outerDiv.findElement(By.name('textFields'));
  
      //invoice
      const supplierField = await innerDiv.findElement(By.name('supplierField'));
      let supplierInputValue = await supplierField.getAttribute('value');
  
      const amountField = await innerDiv.findElement(By.name('amountField'));
      let amountInputValue = await amountField.getAttribute('value');
  
      // Run through all fields
      const dictToCheck = {'supplier': supplierInputValue,'amount':amountInputValue}
      const entries = Object.entries(dictToCheck);
      entries.forEach(async ([key, value]) => {
        if(value === ""){
          switch (key) {
            case 'supplier':
              console.log("Fixing supplier field...")
              await supplierField.clear();
              await supplierField.sendKeys("8157048692");
            case 'amount':
              console.log("Fixing amount field...")
              await amountField.clear();
              await amountField.sendKeys("4,020.09");
          }
        }
      });
  
      //delete one row
      console.log("Deleted one field...")
      const deleteLastRow = await driver.findElement(By.xpath('(//div[@name="tableDiv"]//table//tbody/tr)[last()]//td[5]//button[@name="delete"]'));
      await deleteLastRow.click();
  
      // Wait for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
  
      //edit one row
      const editRow = await driver.findElement(By.xpath('//div[@name="tableDiv"]//table//tbody/tr//td[5]//button[@name="edit"]'));
      await editRow.click();
      //soa row edit
      const invoiceField = await driver.findElement(By.xpath('//div//div//div//form//div//div//input[@name="invoiceID"]'));
      let invoiceInputValue = await invoiceField.getAttribute('value');
  
      const issuedDateField = await driver.findElement(By.xpath('//div//div//div//form//div//div//input[@name="issuedDate"]'));
      let issuedDateInputValue = await issuedDateField.getAttribute('value');
  
      const dueDateField = await driver.findElement(By.xpath('//div//div//div//form//div//div//input[@name="dueDate"]'));
      let dueDateInputValue = await dueDateField.getAttribute('value');
  
      const rowAmountField = await driver.findElement(By.xpath('//div//div//div//form//div//div//input[@name="amount"]'));
      let rowAmountInputValue = await rowAmountField.getAttribute('value');
  
      
      // Run through all fields
      const innerDictToCheck = {'invoice': invoiceInputValue,'issuedDate':issuedDateInputValue,
      'dueDate':dueDateInputValue, "amount":rowAmountInputValue}
      const innerEntries = Object.entries(innerDictToCheck);
      innerEntries.forEach(async ([key, value]) => {
        if(value === ""){
          switch (key) {
            case 'invoice':
              console.log("Fixing invoice field...")
              await invoiceField.clear();
              await invoiceField.sendKeys("8157048692");
            case 'issuedDate':
              console.log("Fixing issuedDate field...")
              await issuedDateField.clear();
              await issuedDateField.sendKeys(new Date().getDate() + '.' + new Date().getMonth() + '.' + new Date().getFullYear());
            case 'dueDate':
              console.log("Fixing dueDate field...")
              await dueDateField.clear();
              await  dueDateField.sendKeys(new Date().getDate() + '.' + new Date().getMonth() + '.' + new Date().getFullYear());
            case 'supplier':
              console.log("Fixing supplier field...")
              await rowAmountField.clear();
              await rowAmountField.sendKeys("83884864");
          }
        }
      });
  
      console.log("Edited field. Proceeding to  submit...");
      const submit = await driver.findElement(By.xpath('//button[@name="editAddButton"]'));
      await submit.click();
  
      //remember to uncomment this
      // const submitButton = await driver.findElement(By.name('submitButton'));
      // await submitButton.click();

      const successMsg = await driver.findElement(By.xpath('//p[@name="success"]'));
      if(successMsg){
        console.log("Test successful.");
      }
      else{
        console.log("check again");
      }
  
    }
    catch(error){
      console.log("Oop: ", error.message);
  
    } finally {
      // Close the browser
      await driver.quit();
    }
  })();
