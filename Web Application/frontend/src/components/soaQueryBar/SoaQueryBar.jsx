import React, { useState } from 'react';
import { TiArrowBackOutline } from 'react-icons/ti';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './soaQueryBar.css'

import {
  queryPopUp,
  queryPopUpInner,
  goBackStyle,
  goBackIconStyle,
  searchFilterStyle,
  searchFilterTextStyle,
  inputBoxStyle,
  inputSpanStyle,
  allUserInputStyle,
  userInputStyle,
  userLongerInputStyle,
  resetButtonStyle,
  applyButtonStyle,
  queryButtonStyle,
} from "./SoaQueryBarStyle";

const SoaQueryBar = ({
  trigger,
  setTrigger,

  dueStartDate,
  setDueStartDate,
  dueEndDate,
  setDueEndDate,

  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,

  soa,
  setSoa,

  supplierName,
  setSupplierName,

  handleApplyFilters,
}) => {
  
    const handleClose = () => {

    setDueStartDate(null);
    setDueEndDate(null);
    setMinAmount(null);
    setMaxAmount(null);
    setSoa(null);
    setSupplierName(null)

    setTrigger(false);
  };

  const [originalMinAmount, setOriginalMinAmount] = useState(null);
  const [originalMaxAmount, setOriginalMaxAmount] = useState(null);
  const [originalSoa, setOriginalSoa] = useState(null);
  const [originalSupplierName, setOriginalSupplierName] = useState(null);

  const handleApplyButtonClick = () => {

    setOriginalMinAmount(minAmount);
    setOriginalMaxAmount(maxAmount);
    setOriginalSoa(soa);
    setOriginalSupplierName(supplierName);

    handleApplyFilters({

      dueStartDate,
      dueEndDate,
      minAmount,
      maxAmount,
      soa,
      supplierName,

    });

    setTrigger(false);
  };

  const handleResetFilters = () => {
    setDueStartDate(null);
    setDueEndDate(null);
    setMinAmount(null);
    setMaxAmount(null);
    setSoa(null);
    setMinAmount(null);
    setMaxAmount(null);
    setSoa(null);
    setSupplierName(null);

    handleApplyFilters({
      dueStartDate: null,
      dueEndDate: null,
      minAmount: null,
      maxAmount:null,
      soa:null,
      supplierName: null,
    });

  };

  return trigger ? (
    <div style={queryPopUp}>
      <div style={queryPopUpInner}>
        <button style={goBackStyle} onClick={handleClose}>
          <TiArrowBackOutline style={goBackIconStyle} />
        </button>

        <div style={searchFilterStyle}>
          <h1 style={searchFilterTextStyle}>SEARCH FILTER</h1>

          <div style={inputBoxStyle}>
            <span style={inputSpanStyle}>DUE DATE</span>

            <div style={allUserInputStyle}>
                <DatePicker
                    selected={dueStartDate}
                    onChange={(date) => setDueStartDate(date)}
                    placeholderText="Start Date"
                    dateFormat="yyyy-MM-dd"
                    className="customDatePickerInputSoa"
                />

                <DatePicker
                    selected={dueEndDate}
                    onChange={(date) => setDueEndDate(date)}
                    placeholderText="End Date"
                    dateFormat="yyyy-MM-dd"
                    className="customDatePickerInputSoa"
                />
            </div>
          </div>

          <div style={inputBoxStyle}>
                <span style={inputSpanStyle}>AMOUNT</span>

                <div style={allUserInputStyle}>
                <input 
                placeholder="Min Amount" 
                style={userInputStyle}
                value={minAmount !== null ? minAmount.toString() : ''}
                onChange={(e) => setMinAmount(e.target.value !== '' ? parseFloat(e.target.value) : null)}
                />

                <input 
                placeholder="Max Amount" 
                style={userInputStyle}
                value={maxAmount !== null ? maxAmount.toString() : ''}
                onChange={(e) => setMaxAmount(e.target.value !== '' ? parseFloat(e.target.value) : null)}
                />
                </div>
          </div>

          <div style={inputBoxStyle}>
            <span style={inputSpanStyle}>SOA NUMBER</span>
            
            <div style={allUserInputStyle}>
            <input
            placeholder="SOA Number" 
            style={userLongerInputStyle}
            value={soa !== null ? soa.toString() : ''}
            onChange={(e) => setSoa(e.target.value !== '' ? parseFloat(e.target.value) : null)}
            />
            </div>
          </div>

          <div style={inputBoxStyle}>
            <span style={inputSpanStyle}>Supplier Name</span>
            
            <div style={allUserInputStyle}>
            <input
            placeholder="Supplier Name" 
            style={userLongerInputStyle}
            value={supplierName !== null ? supplierName : ''}
            onChange={(e) => setSupplierName(e.target.value)}
            />
            </div>
          </div>

          <div style={queryButtonStyle}>
            <button style={resetButtonStyle} onClick={handleResetFilters}>RESET</button>
            <button style={applyButtonStyle} onClick={handleApplyButtonClick}>
              APPLY
            </button>
          </div>

        </div>

      </div>
    </div>
  ) : null;
};

export default SoaQueryBar;