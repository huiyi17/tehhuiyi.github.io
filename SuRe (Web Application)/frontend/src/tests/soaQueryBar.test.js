import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SoaQueryBar from '../../src/components/soaQueryBar/SoaQueryBar'; 

describe('SoaQueryBar', () => {

  it('resets filters when the reset button is clicked', () => {
    const handleApplyFiltersMock = jest.fn();
    const setTriggerMock = jest.fn();
    const setDueStartDateMock = jest.fn();
    const setDueEndDateMock = jest.fn();
    const setMinAmountMock = jest.fn();
    const setMaxAmountMock = jest.fn();
    const setSoaMock = jest.fn();
    const setSupplierNameMock = jest.fn();

    render(
      <SoaQueryBar
        trigger={true}
        setTrigger={setTriggerMock}
        setDueStartDate={setDueStartDateMock}
        setDueEndDate={setDueEndDateMock}
        setMinAmount={setMinAmountMock}
        setMaxAmount={setMaxAmountMock}
        setSoa={setSoaMock}
        setSupplierName={setSupplierNameMock}
        dueStartDate={new Date()}
        dueEndDate={new Date()}
        minAmount={10}
        maxAmount={100}
        soa={123}
        supplierName="Supplier"
        handleApplyFilters={handleApplyFiltersMock}
      />
    );

    const resetButton = screen.getByRole('button', { name: 'RESET' });
    fireEvent.click(resetButton);

    expect(setDueStartDateMock).toHaveBeenCalledWith(null);
    expect(setDueEndDateMock).toHaveBeenCalledWith(null);
    expect(setMinAmountMock).toHaveBeenCalledWith(null);
    expect(setMaxAmountMock).toHaveBeenCalledWith(null);
    expect(setSoaMock).toHaveBeenCalledWith(null);
    expect(setSupplierNameMock).toHaveBeenCalledWith(null);

    expect(handleApplyFiltersMock).toHaveBeenCalledWith({
      dueStartDate: null,
      dueEndDate: null,
      minAmount: null,
      maxAmount: null,
      soa: null,
      supplierName: null,
    });
  });

});