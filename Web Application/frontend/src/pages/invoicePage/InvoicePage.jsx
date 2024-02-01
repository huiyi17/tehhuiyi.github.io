import React, { useState, useEffect } from "react";
import {  useTable, useSortBy, useGlobalFilter } from "react-table";
// import "./invoicePage.css";
import { SecondNavBar } from "../../components/secondNavBar/SecondNavBar";
import { Link } from "react-router-dom";
import mockData from "../../data/mock_data.json";
import { GlobalFilter } from "../../components/globalFilter/GlobalFilter";
import { FaShareSquare } from 'react-icons/fa';import GridLoader from "react-spinners/GridLoader";
import { HiOutlineFilter } from 'react-icons/hi';
import  InvoiceQueryBar  from "../../components/invoiceQueryBar/InvoiceQueryBar";
import backgroundImage from '../../asserts/InvoiceBackground.png';

import { searchBar, tableContainer, scrollable, customTable, 
  td, th, invoiceIDLink, supplierLink, issuedDateLink, dueDateLink, amountLink,
  exportButton, bottomPart, dropdownContainer, popupButton, popupButtonp, filterStyle, 
  filterIconStyle, filterTextStyle, searchFilterStyle, loadingStyle } from './InvoicePageStyle';

  const InvoicePage = () => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      setLoading(true);
      
      setTimeout(() => {
        setLoading(false);
      }, 1000);
  
      fetchInvoiceData();
    }, []);
  
    const fetchInvoiceData = async () => {
      try {
        const response = await fetch("http://localhost:8000/Invoice/getData", {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json();
        setInvoiceData(data);
  
        console.log("Invoice data fetched successfully!");
  
        console.log(response);
      } catch (error) {
        console.error("Error fetching Invoice data:", error);
      }
    };
    
    const [InvoiceData, setInvoiceData] = useState([]);
    console.log(InvoiceData);
   

    const columns = React.useMemo(
      () => [
        {
          Header: "INVOICE ID",
          accessor: "invoiceID",
          Cell: ({ row }) => (
            <Link to={`/detailedinvoicepage`} style={invoiceIDLink} data-testid="invoice-id-link">
              {row.original.invoiceID}
            </Link>
          ),
        },
        {
          Header: "SUPPLIER",
          accessor: "supplier",
          Cell: ({ row }) => (
            <Link to={`/detailedinvoicepage`} style={supplierLink}>
              {row.original.supplier}
            </Link>
          ),
        },
        {
          Header: "ISSUED DATE",
          accessor: "issuedDate",
          Cell: ({ row }) => (
            <Link to={`/detailedinvoicepage`} style={issuedDateLink}>
              {row.original.issuedDate}
            </Link>
          ),
        },
        {
          Header: "DUE DATE",
          accessor: "dueDate",
          Cell: ({ row }) => (
            <Link to={`/detailedinvoicepage`} style={dueDateLink}>
              {row.original.dueDate}
            </Link>
          ),
        },
        {
          Header: "AMOUNT",
          accessor: "amount",
          Cell: ({ row }) => (
            <Link to={`/detailedinvoicepage`} style={amountLink}>
              {row.original.amount}
            </Link>
          ),
        },
      ],
      []
    );
  
    const [queryBar, setQueryBar] = useState(false);
  
    const [issuedStartDate, setIssuedStartDate] = useState(null);
    const [issuedEndDate, setIssuedEndDate] = useState(null);
  
    const [dueStartDate, setDueStartDate] = useState(null);
    const [dueEndDate, setDueEndDate] = useState(null);
  
    const [minAmount, setMinAmount] = useState(null);
    const [maxAmount, setMaxAmount] = useState(null);
  
    const [invoice, setInvoice] = useState(null);
  
    const [supplierName, setSupplierName] = useState("");
  
    const handleApplyFilters = ({
      issuedStartDate,
      issuedEndDate,
      dueStartDate,
      dueEndDate,
      minAmount,
      maxAmount,
      invoice,
      supplierName,
    }) => {
      let filteredData = mockData.invoiceDetails;

      // FILTERING: "Issued Date" filtering
      if (issuedStartDate && issuedEndDate) {
        filteredData = filteredData.filter((row) => {
          const issuedDate = new Date(row.issuedDate);
          return issuedDate >= issuedStartDate && issuedDate <= issuedEndDate;
        });
      }
    
      // FILTERING: "Due Date" filtering
      if (dueStartDate && dueEndDate) {
        filteredData = filteredData.filter((row) => {
          const dueDate = new Date(row.dueDate);
          return dueDate >= dueStartDate && dueDate <= dueEndDate;
        });
      }
    
      // FILTERING: "Amount" filtering
      if (minAmount !== null && maxAmount !== null) {
        const minAmountValue = parseFloat(minAmount);
        const maxAmountValue = parseFloat(maxAmount);
    
        filteredData = filteredData.filter((row) => {
          const amount = parseFloat(row.amount);
          return amount >= minAmountValue && amount <= maxAmountValue;
        });
      }
    
      // FILTERING: "Invoice" filtering
      if (invoice  !== null) {
        const invoiceValue = parseFloat(invoice);
    
        filteredData = filteredData.filter((row) => {
          const number = parseFloat(row.invoiceID);
          return number === invoiceValue
        })
      }
    
      // FILTERING: "Supplier Name" filtering
      if (supplierName !== null) {
        filteredData = filteredData.filter((row) => {
          return row.supplier === supplierName;
        });
      }
    
      // Update the state with filtered data
      setFilteredData(filteredData);
    };
    
      // Create a state to hold filtered data
      const [filteredData, setFilteredData] = useState(mockData.invoiceDetails);
      const tableInstance = useTable(
        { columns, data: filteredData },
        useGlobalFilter,
        useSortBy
      );
    
      const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, setGlobalFilter } =
        tableInstance;
      
      const { globalFilter } = state;
    
      // bottom-part buttons  
      const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
      const handleDropdownItemClick = (option) => {
        console.log("Selected option:", option);
        setIsDropdownVisible(false);
    };
  
  
return (
  <>
    {loading ? (
      <div style={loadingStyle}>
        <GridLoader 
        color={"#3A3A3A"} 
        loading={loading} 
        size={20} />
      </div>
    ) : (
      <div
    style={{
      backgroundImage: `url(${backgroundImage})`, // Set the background image
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh', 
    }}>
    <div className="second-navbar">
      <SecondNavBar />
    </div>
    <div style={searchFilterStyle}>
      <div style={searchBar}>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
      </div>

      <button style={filterStyle} onClick={ () => setQueryBar(true)}
        data-testid="filter-button">
        <span style={filterTextStyle}>Filter</span>
        <HiOutlineFilter style={filterIconStyle}/>
      </button>

      <div>
        <InvoiceQueryBar
          trigger={queryBar}
          setTrigger={setQueryBar}

          issuedStartDate={issuedStartDate}
          setIssuedStartDate={setIssuedStartDate}
          issuedEndDate={issuedEndDate}
          setIssuedEndDate={setIssuedEndDate}

          dueStartDate={dueStartDate}
          setDueStartDate={setDueStartDate}
          dueEndDate={dueEndDate}
          setDueEndDate={setDueEndDate}

          minAmount={minAmount}
          setMinAmount={setMinAmount}
          maxAmount={maxAmount}
          setMaxAmount={setMaxAmount}

          invoice={invoice}
          setInvoice={setInvoice}

          supplierName={supplierName}
          setSupplierName={setSupplierName}

          handleApplyFilters={handleApplyFilters}
        />
      </div>
    </div>


      {/* table */}
      <div name='table' style={tableContainer}>
        <div name='intermediate' style={scrollable}>
          <table name='innerTable' style={customTable} {...getTableProps()}>
            <thead className="sticky-top">
              <tr>
                <th style={th}>INVOICE ID</th>
                <th style={th}>SUPPLIER</th>
                <th style={th}>TOTAL</th>
              </tr>
            </thead>
            <tbody name='body'>
              {InvoiceData.length > 0 ? (
                InvoiceData.map((item) => (
                  <tr key={item._id}>
                    <td name="final" style={td}>
                      <Link to={`/detailedInvoicepage/${item._id}`} className="InvoiceID-link">
                        {item.invoiceID}
                      </Link>
                    </td>
                    <td style={td}>
                      <Link to={`/detailedInvoicepage/${item._id}`} className="supplier-link">
                        {item.supplierID}
                      </Link>
                    </td>
                    <td style={td}>
                      <Link to={`/detailedInvoicepage/${item._id}`} className="amount-link">
                        {item.totalAfterGST}
                      </Link>
                    </td>
                    {/* ... Table cell JSX code ... */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>Loading data...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={bottomPart}>
        {/* "Export" button */}
        <button style={exportButton} onClick={() => setIsDropdownVisible((prevState) => !prevState)}>
          <FaShareSquare size={30} data-testid="export-button"/>
        </button>

        <div style={dropdownContainer}>
          {/* Render the dropdown menu */}
          {isDropdownVisible && (
            <div style={popupButton}>
              <p style={popupButtonp} onClick={() => handleDropdownItemClick("Export Excel")}>Export Excel</p>
              <p style={popupButtonp} onClick={() => handleDropdownItemClick("Export CSV")}>Export CSV</p>
            </div>
          )}
        </div>
      </div>
    </div>
      )}
    </>
  );
};


export default InvoicePage;