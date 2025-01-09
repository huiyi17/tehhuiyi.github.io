import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditPopUp from '../../src/components/editPopUp/EditPopUp'; // Adjust the import path as needed

describe('EditPopUp', () => {


 // TEST 1
  it('renders without errors', () => {
    render(<EditPopUp closeEditPopUp={() => {}} onSubmit={() => {}} />);
  });

  // TEST 2
  test('displays default product value in input', () => {
    const defaultProduct = 'Default Product';
    render(<EditPopUp defaultProduct={defaultProduct} />);
  
    // Use getByDisplayValue to find the input element by its displayed value
    const productInput = screen.getByDisplayValue(defaultProduct);
    expect(productInput).toBeInTheDocument();
  });

  // TEST 3
  it('displays error message for missing fields when Submit button is clicked', () => {
    render(<EditPopUp closeEditPopUp={() => {}} onSubmit={() => {}} isAddMode={true} />);

    // Click the Submit button without filling in any fields
    fireEvent.click(screen.getByText('Submit'));

    expect(screen.getByText('Please include: product, quantity, amount')).toBeInTheDocument();
  });

  //   it('calls onSubmit when the Submit button is clicked with valid input', () => {
//   const onSubmitMock = jest.fn();
//   render(
//     <EditPopUp closeEditPopUp={() => {}} onSubmit={onSubmitMock} isAddMode={true} />
//   );

//   // Fill in form fields
//   fireEvent.change(screen.getByLabelText('PRODUCT:'), { target: { value: 'New Product' } });
//   fireEvent.change(screen.getByLabelText('QUANTITY:'), { target: { value: '5' } });
//   fireEvent.change(screen.getByLabelText('AMOUNT:'), { target: { value: '50' } });


//   // Click the Submit button
//   fireEvent.click(screen.getByText('Submit'));

//   expect(onSubmitMock).toHaveBeenCalledTimes(1);
//   expect(onSubmitMock).toHaveBeenCalledWith({
//     product: 'New Product',
//     quantity: '5',
//     amount: '50',
//   });
// });
  
});
