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


(async function uploadInvoice() {
  try {
    // Open the website
    await driver.get('http://www.localhost:3000/uploadpage');

    // Maximize the browser window
    await driver.manage().window().maximize();

    // Find the invoice input and click
    console.log("Finding Invoice Input")
    let outerDiv = await driver.wait(until.elementLocated(By.className('alluploads')));
    let innerDiv = await outerDiv.findElement(By.name('outerDiv'));
    const invoiceType = await innerDiv.findElement(By.name('invoice'));
    await invoiceType.click();

    // Setting invoice image
    const invoiceFilePath = "C:/Users/ruanx/Desktop/SUTD_y1/Term5/Elements Of Software/website/myapp/myapp/public/images/invoice.jpg";
    const invoiceInput = await driver.findElement(By.className('input-field'));
    await invoiceInput.sendKeys(invoiceFilePath);

    const uploadButton = await driver.findElement(By.name('submitButton'));
    await uploadButton.click();
    
    // const inputField = await driver.findElement(By.id('inputFieldId')); // Replace with the appropriate locator

    // Check if any OCR missed scan
    outerDiv = await driver.wait(until.elementLocated(By.name('locator')));
    innerDiv = await outerDiv.findElement(By.name('textFields'));

    //invoice
    const invoiceField = await innerDiv.findElement(By.name('invoiceField'));
    let invoiceInputValue = await invoiceField.getAttribute('value');

    const issuedDateField = await innerDiv.findElement(By.name('issuedDateField'));
    let issuedDateInputValue = await issuedDateField.getAttribute('value');

    const dueDateField = await innerDiv.findElement(By.name('dueDateField'));
    let dueDateInputValue = await dueDateField.getAttribute('value');

    const supplierField = await innerDiv.findElement(By.name('supplierField'));
    let supplierInputValue = await supplierField.getAttribute('value');

    const beforeGSTField = await innerDiv.findElement(By.name('beforeGSTField'));
    let beforeGSTInputValue = await beforeGSTField.getAttribute('value');

    const GSTField = await innerDiv.findElement(By.name('GSTField'));
    let GSTInputValue = await GSTField.getAttribute('value');
    
    const afterGSTField = await innerDiv.findElement(By.name('afterGSTField'));
    let afterGSTInputValue = await afterGSTField.getAttribute('value');

    // Run through all fields
    const dictToCheck = {'invoice': invoiceInputValue,'issuedDate':issuedDateInputValue,'dueDate':dueDateInputValue,
    "supplier":supplierInputValue,'beforeGST':beforeGSTInputValue,'GST':GSTInputValue,'afterGST':afterGSTInputValue}
    const entries = Object.entries(dictToCheck);
    entries.forEach(async ([key, value]) => {
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
            await supplierField.clear();
            await supplierField.sendKeys("83884864");
          case 'beforeGST':
            console.log("Fixing beforeGST field...")
            await beforeGSTField.clear();
            await beforeGSTField.sendKeys("96.12");
          case 'GST':
            console.log("Fixing GST field...")
            await GSTField.clear();
            await GSTField.sendKeys("7");
          case 'afterGST':
            console.log("Fixing afterGST field...")
            await afterGSTField.clear();
            await afterGSTField.sendKeys("104.03");
        }
      }
    });

    invoiceInputValue = await invoiceField.getAttribute('value');
    console.log("No more empty fields. Proceeding to  submit...");

    //remember to uncomment this
    const submitButton = await driver.findElement(By.name('submitButton'));
    await submitButton.click();

    // Wait for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Go to invoice page to check
    await driver.get('http://www.localhost:3000/invoicepage');
    // Wait for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Locate the table element
    row = await driver.findElement(By.xpath('(//div[@name="table"]//table[@name="innerTable"]//tbody/tr)[last()]//td[1]')).getText();

    if(row === invoiceInputValue){
      console.log("Test successful");
    }
    else{
      console.log("check again!");
    }

  }
  catch(error){
    console.log("Oop: ", error.message);

  } finally {
    // Close the browser
    await driver.quit();
  }
})();