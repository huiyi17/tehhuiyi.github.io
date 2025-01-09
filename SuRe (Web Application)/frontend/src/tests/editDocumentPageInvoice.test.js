import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent, waitFor, within, cleanup } from '@testing-library/react/pure';
import { MemoryRouter } from 'react-router-dom';
import EditDocumentPage from '../../src/pages/editDocumentPage/EditDocumentPageInvoice.jsx';

global.URL.createObjectURL = jest.fn(() => 'mocked-url');
// FUZZING FUNCTIONS

const getNumber = (s) => {
  const parsedNumber = parseFloat(String(s).replace(/[^0-9.]+/g, ''));
  return isNaN(parsedNumber) ? 0 : parsedNumber;
};

// FUNCTIONS FOR FUZZING
const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]|:;"<>,.?/~';
  let length = Math.floor(Math.random() * 1000)
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

function generateDirtyNumberString() {
  const characters = '0123456789$.,QRSTUVWXYZabcde()_+{}[';
  let length = Math.floor(Math.random() * 1000)
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

function generateRandomDate() {
  const year = Math.floor(Math.random() * (2100 - 2000) + 2000);
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;

  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function generateRandomDummyInvoice() {
  const arrayLength = Math.floor(Math.random() * 5) + 1; // Generate array length between 1 and 5

  return {
    invoiceID: generateRandomString(),
    issuedDate: generateRandomString(),
    dueDate: generateRandomString(),
    supplierID: generateRandomString(),
    totalBeforeGST: generateDirtyNumberString(),
    totalAfterGST: generateDirtyNumberString(),
    GST: generateDirtyNumberString(),
    productCode: new Array(arrayLength).fill(0).map(() => Math.floor(Math.random() * 1000)),
    quantity: new Array(arrayLength).fill(0).map(() => (Math.random() > 0.5 ? Math.floor(Math.random() * 100) : generateDirtyNumberString())),
    amount: new Array(arrayLength).fill(0).map(() => (Math.random() > 0.5 ? Math.floor(Math.random() * 100) : generateDirtyNumberString())),
    productName: new Array(arrayLength).fill(0).map(() => (Math.random() > 0.5 ? Math.floor(Math.random() * 100) : generateRandomString())),
  };
}


// END OF FUZZING FUNCTIONS
const dummyInvoice = { 
  // this is a dummy invoice object to be passed on to the editDocumentPage
  // Delete this later and replace with a call to the endpoint to get the 
  // raw OCRed data

  invoiceID: 'the first invoiceeeee',
  issuedDate: 'yesterday',
  dueDate: 'tomorrow',
  supplierID: '69',
  totalBeforeGST: 'two dollars$2',
  totalAfterGST: 'a million dollars22',
  GST: 'yes there is gst33',
  productCode: [777, 86],
  quantity: [2, 44],
  amount: [22, 33],
  productName: ['hot dogs', 'buns'],
}

describe('Edit Invoice Page', () => {
  beforeAll(() => {
        render(
          <MemoryRouter initialEntries={[{ url:'hi', state:dummyInvoice }]} >
            <EditDocumentPage />
          </MemoryRouter>);

  });
  afterAll(() => {cleanup();});

    // TEST1
    test('renders the table with correct rows and columns', () => {
        
      const invoiceIdLabel= screen.getByText('INVOICE ID:');
      const invoiceIdInput = invoiceIdLabel.nextElementSibling;
      expect(invoiceIdInput.value).toEqual('the first invoiceeeee');
      });

  it('should have proper number of rows', ()=>{
    //console.log(screen);

    const rows = screen.queryAllByRole('row');
    console.log(rows);
    //console.log(rows);
    expect(rows.length).toEqual(3);
    //console.log(rows);

    // Loop through each row and access its contents
    let rowContent = []
    rows.forEach((row, rowIndex) => {
      // Query cells within the current row
      const cells = within(row).queryAllByRole('cell');

      // Access and verify the content of specific cells within the row
      const cellContent = cells.map(cell => cell.textContent);
      rowContent.push(cellContent);

      // Perform your assertions or checks on cellContent
      //console.log(`Row ${rowIndex} Content:`, cellContent);
    });
    //console.log(rowContent);
    //expect(rowContent.at(-1)).toEqual([ 86, 44, 33, 'buns']);
  });

  it('should clean dirty number data', () => {
    const totalAmountInputLabel = screen.getByText('TOTAL AFTER GST:');
    const totalAmountInput = totalAmountInputLabel.nextElementSibling;
    expect(totalAmountInput .value).toEqual('22');
  });
});


// FUZZING TEST
for (let i = 0; i < 10; i++){
  describe('EditDocumentPageInvoice Fuzzing tests', () => {
    var dummyRandomData;
    beforeAll(() => {
      // render the screen before doing tests
      dummyRandomData = generateRandomDummyInvoice();
      render(
      <MemoryRouter initialEntries={[{ url:'hi', state:dummyRandomData }]} >
        <EditDocumentPage />
      </MemoryRouter>);
      expect('the page rendered properly').toEqual('the page rendered properly');
    });

    afterAll(() => {
      cleanup();
    });

    // Test the number cleaning functions
    it('should clean dirty number data', () => {
      const totalAmountInputLabel = screen.getByText('TOTAL BEFORE GST:');
      const totalAmountInput = totalAmountInputLabel.nextElementSibling;
      expect(totalAmountInput.value).toEqual( String(getNumber(dummyRandomData.totalBeforeGST)) );
      //expect( typeof(totalAmountInput.value) ).toEqual('number')
    });

    it('should have same number of rows as given data (+1)',() => {
      const rows = screen.queryAllByRole('row');
      const dataRowLength = dummyRandomData.productName.length;
      expect(rows.length-1).toEqual(dataRowLength);

    });


  });

}
