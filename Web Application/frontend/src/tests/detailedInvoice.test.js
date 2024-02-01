import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DetailedInvoicePage from '../../src/pages/detailedInvoicePage/DetailedInvoicePage';

describe('DetailedInvoice Page', () => {

    // TEST1 : render details
    test('renders the page title, supplier name, and due date', () => {
        render(
            <MemoryRouter>
            <DetailedInvoicePage />
            </MemoryRouter>
        );
    
        // Assert that the page title, supplier name, and due date are rendered
        const pageTitle = screen.getByTestId('invoiceTitle');
        const supplierName = screen.getByTestId('supplierName');
        const issuedDate = screen.getByTestId('issuedDate');
        const dueDate = screen.getByTestId('dueDate');
    
        expect(pageTitle).toBeInTheDocument();
        expect(supplierName).toBeInTheDocument();
        expect(issuedDate).toBeInTheDocument();
        expect(dueDate).toBeInTheDocument();
    });
  
    // TEST 2: render table
    test('renders the table with correct rows and columns', () => {
        render(
            <MemoryRouter>
            <DetailedInvoicePage />
            </MemoryRouter>
        );
    
        // Assert that the table is rendered
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
    
        // Assert that the table headers are rendered
        const productHeader = screen.getByText('Product');
        const quantityHeader = screen.getByText('Quantity');
        const amountHeader = screen.getByText('Amount');
    
        expect(productHeader).toBeInTheDocument();
        expect(quantityHeader).toBeInTheDocument();
        expect(amountHeader).toBeInTheDocument();
    });
  
    // TEST 3: go back button
    test('renders the "GO BACK" link', () => {
        render(
          <MemoryRouter initialEntries={['/detailedinvoicepage']}>
            <DetailedInvoicePage />
          </MemoryRouter>
        );
    
        // Check if the "GO BACK" link is present
        const goBackLink = screen.getByText('GO BACK');
        expect(goBackLink).toBeInTheDocument();
      });
});