import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SecondNavBar } from '../../src/components/secondNavBar/SecondNavBar'; 

describe('SecondNavBar Component', () => {
  // TEST 1
  test('renders the correct links with default background color', () => {
    render(
      <MemoryRouter initialEntries={['/homepage']}>
        <SecondNavBar />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('HOME');
    const uploadLink = screen.getByText('UPLOAD');
    const invoiceLink = screen.getByText('INVOICE');
    const soaLink = screen.getByText('STATEMENT OF ACCOUNT');
    const productLink = screen.getByText('PRODUCT');

    expect(homeLink).toHaveStyle('background-color: #EEFFE8');
    expect(uploadLink).toHaveStyle('background-color: transparent');
    expect(invoiceLink).toHaveStyle('background-color: transparent');
    expect(soaLink).toHaveStyle('background-color: transparent');
    expect(productLink).toHaveStyle('background-color: transparent');
  });

  // TEST 2
  test('applies background color when the link is active (current page)', () => {
    render(
      <MemoryRouter initialEntries={['/uploadpage']}>
        <SecondNavBar />
      </MemoryRouter>
    );

    const uploadLink = screen.getByText('UPLOAD');

    expect(uploadLink).toHaveStyle('background-color: #E8F4FF');
  });

  // TEST 3
  test('does not apply background color to other links when one link is active', () => {
    render(
      <MemoryRouter initialEntries={['/invoicepage']}>
        <SecondNavBar />
      </MemoryRouter>
    );

    const uploadLink = screen.getByText('UPLOAD');
    const invoiceLink = screen.getByText('INVOICE');

    expect(uploadLink).toHaveStyle('background-color: transparent');
    expect(invoiceLink).toHaveStyle('background-color: #FFE8E8');
  });
});
