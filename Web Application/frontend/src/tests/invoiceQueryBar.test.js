import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InvoiceQueryBar from '../../src/components/invoiceQueryBar/InvoiceQueryBar';

describe('InvoiceQueryBar', () => {

    it('renders without errors', () => {
        render(
          <InvoiceQueryBar
            trigger={true}
            setTrigger={() => {}}
            issuedStartDate={null}
            setIssuedStartDate={() => {}}
            issuedEndDate={null}
            setIssuedEndDate={() => {}}
            dueStartDate={null}
            setDueStartDate={() => {}}
            dueEndDate={null}
            setDueEndDate={() => {}}
            minAmount={null}
            setMinAmount={() => {}}
            maxAmount={null}
            setMaxAmount={() => {}}
            invoice={null}
            setInvoice={() => {}}
            supplierName={null}
            setSupplierName={() => {}}
            handleApplyFilters={() => {}}
          />
        );
      });

  it('Max Amount Changing', () => {

    const setInvoiceMock = jest.fn();
    const setTriggerMock = jest.fn();
    const setMinAmountMock = jest.fn();
    const setMaxAmountMock = jest.fn();

    render(
      <InvoiceQueryBar
        trigger={true}
        setTrigger={setTriggerMock}
        setInvoice={setInvoiceMock}
        setMinAmount={setMinAmountMock}
        minAmount={null}
        setMaxAmount={setMaxAmountMock}
        maxAmount={null}
        invoice={null}
      />
    );

    const maxAmountInput = screen.getByPlaceholderText('Max Amount');
    fireEvent.change(maxAmountInput, { target: { value: '100' } });

    expect(setMaxAmountMock).toHaveBeenCalledWith(100);
});

it('Min Amount Changing', () => {

    const setInvoiceMock = jest.fn();
    const setTriggerMock = jest.fn();
    const setMinAmountMock = jest.fn();
    const setMaxAmountMock = jest.fn();

    render(
      <InvoiceQueryBar
        trigger={true}
        setTrigger={setTriggerMock}
        setInvoice={setInvoiceMock}
        setMinAmount={setMinAmountMock}
        minAmount={null}
        setMaxAmount={setMaxAmountMock}
        maxAmount={null}
        invoice={null}
      />
    );

    const minAmountInput = screen.getByPlaceholderText('Min Amount');
    fireEvent.change(minAmountInput, { target: { value: '10' } });

    expect(setMinAmountMock).toHaveBeenCalledWith(10);
});

  it('applies filters when the apply button is clicked', () => {

    const handleApplyFiltersMock = jest.fn();
    const setInvoiceMock = jest.fn();
    const setTriggerMock = jest.fn();
    const setMinAmountMock = jest.fn();
    const setMaxAmountMock = jest.fn();

    render(
      <InvoiceQueryBar
        trigger={true}
        setTrigger={setTriggerMock}
        setInvoice={setInvoiceMock}
        setMinAmount={setMinAmountMock}
        minAmount={null}
        setMaxAmount={setMaxAmountMock}
        maxAmount={null}
        invoice={null}
        handleApplyFilters={handleApplyFiltersMock}
      />
    );
    const applyButton = screen.getByRole('button', { name: 'APPLY' });
    fireEvent.click(applyButton);

    expect(handleApplyFiltersMock).toHaveBeenCalled();
  });

});
