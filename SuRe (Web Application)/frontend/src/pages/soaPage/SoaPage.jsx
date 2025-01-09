import React, { useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { Link } from "react-router-dom";
import axios from "axios";

import { SecondNavBar } from "../../components/secondNavBar/SecondNavBar";
import { GlobalFilter } from "../../components/globalFilter/GlobalFilter";
import SoaQueryBar from "../../components/soaQueryBar/SoaQueryBar";

import mockData from "../../data/mock_data.json";
import { FaShareSquare } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";

import GridLoader from "react-spinners/GridLoader";
import backgroundImage from "../../asserts/SOABackground.png";

import {
  searchBar,
  tableContainer,
  scrollable,
  customTable,
  td,
  th,
  soaIDLink,
  supplierLink,
  dueDateLink,
  amountLink,
  exportButton,
  bottomPart,
  popupButton,
  popupButtonp,
  dropdownContainer,
  exportButtonIcon,
  filterStyle,
  filterIconStyle,
  filterTextStyle,
  searchFilterStyle,
  loadingStyle,
} from "./SoaPageStyle";

const SoaPage = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Fetch SOA data from the backend when the component mounts
    fetchSOAData();
  }, []);

  const fetchSOAData = async () => {
    try {
      // Make an API call to your backend to fetch SOA data
      const response = await fetch("http://localhost:8000/soa/getSOAData", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      // Update the state with the fetched data
      // TODO: escape this error of empty array cannot be mapped when no data is fetched.
      setSoaData(data);

      console.log("SOA data fetched successfully!");

      console.log(response);
    } catch (error) {
      console.error("Error fetching SOA data:", error);
    }
  };
  const [soaData, setSoaData] = useState([]);
  console.log(soaData);

  const handleExportToCSV = () => {
    // Make a GET request to the backend endpoint for exporting data to CSV
    axios
      .get("http://localhost:8000/soa/exportToCSV")
      // Make a GET request to the backend endpoint for exporting data to Excel
      .then((response) => {
        console.log("data exported to excel fetched successfully");
        console.log(response.data.message);
        // Optionally, you can display a success message to the user
      })
      .catch((error) => {
        console.error("Error exporting data to Excel:", error);
        // Display an error message to the user if needed
      });
  };

  const handleExportToExcel = () => {
    // Make a GET request to the backend endpoint for exporting data to Excel
    axios
      .get("http://localhost:8000/soa/exportToExcel")
      .then((response) => {
        console.log("data exported to excel fetched successfully");
        console.log(response.data.message);
        // Optionally, you can display a success message to the user
      })
      .catch((error) => {
        console.error("Error exporting data to Excel:", error);
        // Display an error message to the user if needed
      });
  };

  const columns = React.useMemo(
    () => [
      // first argument that returns the value we want to memoize
      // each object represents a single column
      {
        Header: "SOA ID",
        accessor: "soaID", // key to access the data row
        Cell: (
          { row } // how the content of the cell should be rendered
        ) => (
          <Link to={`/detailedsoapage`} style={soaIDLink}>
            {row.original.soaID}
          </Link>
        ),
      },
      {
        Header: "SUPPLIER",
        accessor: "supplier",
        Cell: ({ row }) => (
          <Link to={`/detailedsoapage`} style={supplierLink}>
            {row.original.supplier}
          </Link>
        ),
      },
      {
        Header: "DUE DATE",
        accessor: "dueDate",
        Cell: ({ row }) => (
          <Link to={`/detailedsoapage`} style={dueDateLink}>
            {row.original.dueDate}
          </Link>
        ),
      },
      {
        Header: "AMOUNT",
        accessor: "amount",
        Cell: ({ row }) => (
          <Link to={`/detailedsoapage`} style={amountLink}>
            {row.original.amount}
          </Link>
        ),
      },
    ],
    [] // empty dependency array: value ill be memoized and not recalculated
  );
  const [soaQueryBar, setSoaQueryBar] = useState(false);

  // dueDate states
  const [dueStartDate, setDueStartDate] = useState(null);
  const [dueEndDate, setDueEndDate] = useState(null);

  // // amount states
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);

  // invoice states
  const [soa, setSoa] = useState(null);

  // supplierName states
  const [supplierName, setSupplierName] = useState("");

  // function: handle table filtering
  const handleApplyFilters = ({
    dueStartDate,
    dueEndDate,

    minAmount,
    maxAmount,

    soa,

    supplierName,
  }) => {
    let filteredData = mockData.soaDetails;

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

    // FILTERING: "Soa" filtering
    if (soa !== null) {
      const soaValue = parseFloat(soa);

      filteredData = filteredData.filter((row) => {
        const number = parseFloat(row.soaID);
        return number === soaValue;
      });
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
  const [filteredData, setFilteredData] = useState(mockData.soaDetails);

  const tableInstance = useTable(
    { columns, data: filteredData },
    useGlobalFilter,
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = tableInstance;

  const { globalFilter } = state;

  // bottom-part buttons
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleDropdownItemClick = (option) => {
    console.log("Selected option:", option);

    // Perform actions based on the selected option (e.g., export Excel, CSV, or generate tax report)
    // ...

    setIsDropdownVisible(false); // Close the dropdown after selecting an option
  };

  return (
    <>
      {loading ? (
        <div style={loadingStyle}>
          <GridLoader color={"#3A3A3A"} loading={loading} size={20} />
        </div>
      ) : (
        <div
          style={{
            backgroundImage: `url(${backgroundImage})`, // Set the background image
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
          }}
        >
          <div className="second-navbar">
            <SecondNavBar />
          </div>

          <div style={searchFilterStyle}>
            <div style={searchBar}>
              <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            </div>

            <button style={filterStyle} onClick={() => setSoaQueryBar(true)} data-testid="filter-button">
              <span style={filterTextStyle}>Filter</span>
              <HiOutlineFilter style={filterIconStyle} />
            </button>

            <div data-testid="soa-querybar">
              <SoaQueryBar
                trigger={soaQueryBar}
                setTrigger={setSoaQueryBar}
                dueStartDate={dueStartDate}
                setDueStartDate={setDueStartDate}
                dueEndDate={dueEndDate}
                setDueEndDate={setDueEndDate}
                minAmount={minAmount}
                setMinAmount={setMinAmount}
                maxAmount={maxAmount}
                setMaxAmount={setMaxAmount}
                soa={soa}
                setSoa={setSoa}
                supplierName={supplierName}
                setSupplierName={setSupplierName}
                handleApplyFilters={handleApplyFilters}
              />
            </div>
          </div>

    
          <div style={tableContainer} data-testid="table-container">
            <div style={scrollable}>
              <table name="table" style={customTable} {...getTableProps()}>
                <thead className="sticky-top">
                  <tr>
                    <th style={th}>SOA ID</th>
                    <th style={th}>SUPPLIER</th>
                    <th style={th}>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {soaData.length > 0 ? ( // Check if data has been fetched
                    soaData.map((item) => (
                      <tr key={item._id}>
                        <td style={td}>
                          <Link
                            to={`/detailedsoapage/${item._id}`}
                            className="soaID-link"
                          >
                            {item._id}
                          </Link>
                        </td>
                        <td style={td}>
                          <Link
                            to={`/detailedsoapage/${item._id}`}
                            className="supplier-link"
                          >
                            {item.supplierID}
                          </Link>
                        </td>
                        <td style={td}>
                          <Link
                            to={`/detailedsoapage/${item._id}`}
                            className="amount-link"
                          >
                            {item.totalAmount}
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
            <button
              style={exportButton}
              onClick={() => setIsDropdownVisible((prevState) => !prevState)}
            >
              <FaShareSquare size={30} style={exportButtonIcon} data-testid="export-button"/>
            </button>

            <div style={dropdownContainer}>
              {/* Render the dropdown menu */}
              {isDropdownVisible && (
                <div style={popupButton}>
                  <p style={popupButtonp} onClick={handleExportToExcel}>
                    Export Excel
                  </p>
                  <p style={popupButtonp} onClick={handleExportToCSV}>
                    Export CSV
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SoaPage;
