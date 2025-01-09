import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../../src/pages/registerPage/RegisterPage';

describe('RegisterPage', () => {

  const mockNavigate = jest.fn();

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate, 
  }));

  // TEST 1
  it('renders without errors', () => {
    render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>)
  });

  // TEST 2
  it('displays error messages for invalid form submission', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    const submitButton = screen.getByText('Create Account');
    fireEvent.click(submitButton);

    const emptyInputError = screen.queryAllByText(/This is a required field/i);
    expect(emptyInputError.length).toBeGreaterThan(0);
  });

  // TEST 3
  it('displays success message after successful form submission', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    const fullNameInput = screen.getByPlaceholderText('Enter Your Full Name');
    const companyNameInput = screen.getByPlaceholderText('Enter Your Company');
    const emailInput = screen.getByPlaceholderText('Enter Your Email Address');
    const passwordInput = screen.getByPlaceholderText('Enter Your Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Your Password');
    const submitButton = screen.getByText('Create Account');

    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(companyNameInput, { target: { value: 'ACME Corp' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Account registered!')).toBeInTheDocument();
  });

  // TEST 4
  it('displays password mismatch error when passwords do not match', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Enter Your Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Your Password');
    const submitButton = screen.getByText('Create Account');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'mismatched123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Passwords mismatch.')).toBeInTheDocument();
  });

});
