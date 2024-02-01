import React from 'react';
import { cleanup, render, screen, fireEvent, within } from '@testing-library/react/pure';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

import SigninPage from '../../src/pages/signInPage/Signinpage';
import EditDocumentPage from '../../src/pages/editDocumentPage/EditDocumentPageSOA';

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

function generateRandomDummySOA() {
  const arrayLength = Math.floor(Math.random() * 5) + 1; // Generate array length between 1 and 5

  return {
    supplierID: generateRandomString(),
    totalAmount: generateDirtyNumberString(),
    invoiceID: new Array(arrayLength).fill(0).map(() => Math.floor(Math.random() * 1000)),
    issuedDate: new Array(arrayLength).fill(0).map(() => (Math.random() > 0.5 ? 'tomorrow' : generateRandomDate())),
    dueDate: new Array(arrayLength).fill(0).map(() => (Math.random() > 0.5 ? 'yesterday' : 'next week')),
    amount: new Array(arrayLength).fill(0).map(() => (Math.random() > 0.5 ? Math.floor(Math.random() * 100) : generateDirtyNumberString())),
  };
}
// END OF FUNCTIONS FOR FUZZING

global.URL.createObjectURL = jest.fn(() => 'mocked-url');

const dummySOA= { 
    supplierID: '69',
    totalAmount: 'artstranesteia234238497',
    invoiceID: [777, 86],
    issuedDate: ['tomorrow', 2024],
    dueDate: ['yesterday', 'next week'],
    amount: [22, 33],
  }

describe('EditDocumentPageSOA renders dummy data correctly', () =>{
  // render the screen
  beforeAll(() => {
    // render the screen before doing tests
    render(
    <MemoryRouter initialEntries={[{ url:'hi', state:dummySOA }]} >
      <EditDocumentPage />
    </MemoryRouter>);
  });

  afterAll(() => {
    cleanup();
  });


  it('should render properly given the dummy data', () => {

    expect(true).toBe(true);
    const supplierIdInputLabel = screen.getByText('SUPPLIER ID:');
    const supplierIdInput = supplierIdInputLabel.nextElementSibling;
    expect(supplierIdInput.value).toEqual('69');
    const secondCellInFirstRow = screen.getByRole('cell', { name: /tomorrow/i });
    expect(secondCellInFirstRow).toBeInTheDocument();
    //console.log(screen.getByRole('cell', { row: 0, column: 1 }))

    });

  it('should have proper number of rows', ()=>{
    //console.log(screen);

    const rows = screen.queryAllByRole('row');
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
    expect(rowContent.at(-1)).toEqual([ '86', '2024', 'next week', '33', '' ]);
  });

  it('should clean dirty number data', () => {
    const totalAmountInputLabel = screen.getByText('TOTAL AMOUNT:');
    const totalAmountInput = totalAmountInputLabel.nextElementSibling;
    expect(totalAmountInput .value).toEqual('234238497');
  });

});

for (let i = 0; i < 10; i++){
  describe('EditDocumentPageSOA Fuzzing tests', () => {
    var dummyRandomData;
    beforeAll(() => {
      // render the screen before doing tests
      dummyRandomData = generateRandomDummySOA();
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
      const totalAmountInputLabel = screen.getByText('TOTAL AMOUNT:');
      const totalAmountInput = totalAmountInputLabel.nextElementSibling;
      expect(totalAmountInput.value).toEqual( String(getNumber(dummyRandomData.totalAmount)) );
      //expect( typeof(totalAmountInput.value) ).toEqual('number')
    });

    it('should have same number of rows as given data (+1)',() => {
      const rows = screen.queryAllByRole('row');
      const dataRowLength = dummyRandomData.invoiceID.length;
      expect(rows.length-1).toEqual(dataRowLength);

    });


  });

}
