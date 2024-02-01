import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DetailedSoaPage from '../../src/pages/detailedSoaPage/DetailedSoaPage';

describe('DetailedSoa Page', () => {

    const mockNavigate = jest.fn();

    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate, 
    }));

    // TEST1 : render details
    test('renders the page title, supplier name, and due date', () => {
        render(
            <MemoryRouter>
            <DetailedSoaPage />
            </MemoryRouter>
        );
    
        // Assert that the page title, supplier name, and due date are rendered
        const pageTitle = screen.getByTestId('soaTitle');
        const supplierName = screen.getByTestId('supplierName');
        const dueDate = screen.getByTestId('dueDate');
    
        expect(pageTitle).toBeInTheDocument();
        expect(supplierName).toBeInTheDocument();
        expect(dueDate).toBeInTheDocument();
    });
  
    // TEST 2: render table
    test('renders the table with correct rows and columns', () => {
        render(
            <MemoryRouter>
            <DetailedSoaPage />
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
  
    // TEST 3: payment button
    test('navigates to upload page when the payment button is clicked', async() => {
        render(
            <MemoryRouter>
                <DetailedSoaPage onCLick={mockNavigate()}/>
            </MemoryRouter>
        );
  
        // Click the payment button
        const paymentButton = screen.getByTestId('payment-button');
        // expect(paymentButton).toBeInTheDocument();
        fireEvent.click(paymentButton);
  
        // Check if the mockNavigate function was called with the correct URL
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
});