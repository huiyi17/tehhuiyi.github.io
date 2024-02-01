import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlobalFilter } from '../../src/components/globalFilter/GlobalFilter'; 

describe('GlobalFilter Component', () => {
  // TEST 1
  test('updates the filter value when typing in the input', () => {
    const setFilter = jest.fn(); // Mock the setFilter function
    render(<GlobalFilter filter="initial value" setFilter={setFilter} />);

    // Find the input field
    const inputElement = screen.getByPlaceholderText('Search...');

    // Simulate typing in the input field
    fireEvent.change(inputElement, { target: { value: 'updated value' } });

    // The setFilter function should be called with the updated value
    expect(setFilter).toHaveBeenCalledWith('updated value');
  });

  // TEST 2
  test('displays the provided filter value in the input', () => {
    const setFilter = jest.fn(); // Mock the setFilter function
    render(<GlobalFilter filter="sample filter" setFilter={setFilter} />);
    
    // Find the input field
    const inputElement = screen.getByPlaceholderText('Search...');

    // The input field should display the provided filter value
    expect(inputElement.value).toBe('sample filter');
  });

  // TEST 3
  test('allows typing in the input box', () => {
    let filterValue = ''; // State to hold the filter value
    const setFilter = (value) => {
      filterValue = value; // Update the filterValue with the provided value
    };
    render(<GlobalFilter filter={filterValue} setFilter={setFilter} />);

    // Find the input field
    const inputElement = screen.getByPlaceholderText('Search...');

    // Simulate typing in the input field
    fireEvent.change(inputElement, { target: { value: 'user input' } });

    // The input field's value should be updated
    expect(filterValue).toBe('user input');
  });
});
