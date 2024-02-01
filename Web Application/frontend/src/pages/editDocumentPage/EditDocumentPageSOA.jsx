import React from 'react'
import SecondNavBar from '../../components/secondNavBar/SecondNavBar';
import EditPopUp from '../../components/editPopUp/EditPopUpSOA';
import ScanSuccessfully from '../../components/scanSuccessfully/ScanSuccessfully';

import { useState, useEffect } from 'react'
import { useTable } from 'react-table'
import { Link, useLocation } from 'react-router-dom'

import { IoChevronBack } from 'react-icons/io5'
import { LuEdit3 } from 'react-icons/lu'
import { MdDelete } from 'react-icons/md'
import { VscDiffAdded } from "react-icons/vsc"
import axios from 'axios';
import {
  goBackStyle,
  goBackButtonStyle,
  imageStyle,
  editDocumentContainer,
  topScanStyle,
  scanContentStyle,
  allEditDocumentContentStyle,
  tableStyle,
  tableHeadStyle,
  tableRowStyle,
  tableContainerStyle,
  submitStyle,
  cancelStyle,
  editDocumentButtonStyle,
  editActionColumnButtonStyle,
  deleteActionColumnButtonStyle,
  actionHeaderStyle,
  plusButtonHeaderStyle,
  indiInputStyle,
  editDocumentIndiPStyle,
  editDocumentInvoiceInputStyle,
  editDocumentSuppInputStyle,
  editDocumentAmtInputStyle,
  editDocumentDueInputStyle,
  goBackLinkStyle,

} from './EditDocumentPageStyle';

const EditDocumentPage = () => {
  const location = useLocation(); // get the OCR data from the upload page
  const stateData = location.state;
  // URL object doesnt exist in test environment so 
  // add this to the test file somewhere outside of the tests
  // global.URL.createObjectURL = jest.fn(() => 'mocked-url');
  // const [image, setImage] = useState(url.createObjectURL(location.url));
  const [image, setImage] = useState(location.url);

  // Function to clean numerical fields
  const getNumber = (s) => {
    const parsedNumber = parseFloat(String(s).replace(/[^0-9.]+/g, ''));
    return isNaN(parsedNumber) ? 0 : parsedNumber;
  };

  // Form Data
  const [supplierID, setSupplierID] = useState(stateData.supplierID);
  const [totalAmount, setTotalAmount] = useState( getNumber(stateData.totalAmount) );
  // Array Data
  const [invoiceID, setInvoiceID] = useState(stateData.invoiceID);
  const [issuedDate, setIssuedDate] = useState(stateData.issuedDate);
  const [dueDate, setDueDate] = useState(stateData.dueDate);
  const [amount, setAmount] = useState(stateData.amount);

  const handleSubmit = async () => {
    try {
  const dataToSend = {
    invoiceID,
    issuedDate,
    dueDate,
    supplierID,
    amount, 
    uploadcontent
    // ... other fields
     // This should be the data you want to upload
  };
  
      // Make a POST request to the backend API's uploadData endpoint
      const response = await axios.post('http://localhost:8000/soa/uploadDataSOA', dataToSend);
      setScanSuccessfully(true);

      // Handle the response as needed
      //console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };


  // Now to initialise the table data
  // What we need to do is create an array of objects
  // each object contains a mapping of each header, to the 
  // value in the `stateData` object at that index
  const tableLength = stateData.invoiceID.length; // get the length from any array; shld be the same
  var tableObjects = []; // declare an array of objects
  for (let i = 0; i < tableLength; i++) {
    let obj = {};
    obj.invoiceID = stateData.invoiceID[i];
    obj.issuedDate =stateData.issuedDate[i];
    obj.dueDate= stateData.dueDate[i];
    obj.amount =  getNumber(stateData.amount[i]);
    tableObjects.push(obj);
  }

  // END of initialising table data
  // add quick check to make sure that the table data wont be empty
  if (tableObjects.length === 0) {
    let obj = {};
    obj.invoiceID= '';
    obj.issuedDate= '';
    obj.dueDate= '';
    obj.amount = '';
    tableObjects.push(obj);
  }

  let [uploadcontent, setUploadContent] = useState(tableObjects)
  
  

  // DATA is uploadcontent. Memory update only when uploadcontent changes.
  const data = React.useMemo(() => uploadcontent, [uploadcontent]);

  // COLUMNS is every column in uploadcontent.
  const columns = React.useMemo(() => [
    {
      Header: "INVOICE ID",
      accessor: "invoiceID"
    },
    {
      Header: "ISSUED DATE",
      accessor: "issuedDate"
    },
    {
      Header: "DUE DATE",
      accessor: "dueDate"
    },
    {
      Header: "AMOUNT",
      accessor: "amount"
    }
  ], []
  )

  const [editPopUpOpen, setEditPopUpOpen] = useState(false);

  const handleDeleteRow = (targetIndex) => {
    setUploadContent((rows) => rows.filter((_, idx) => idx !== targetIndex));
  };

  const handleAddRow = (newRowData) => {
    if (editRow === null) {
      // Add mode: Add a new row
      const newRow = {
        invoiceID: newRowData.invoiceID,
        issuedDate: newRowData.issuedDate,
        dueDate: newRowData.dueDate,
        amount:  getNumber(newRowData.amount),
      };
      setUploadContent((prevContent) => [...prevContent, newRow]);
    } else {
      // Edit mode: Update the existing row
      const updatedRow = {
        invoiceID: newRowData.invoiceID,
        issuedDate: newRowData.issuedDate,
        dueDate: newRowData.dueDate,
        amount:  getNumber(newRowData.amount),
      };
      const updatedContent = [...uploadcontent];
      updatedContent[editRow] = updatedRow;
      setUploadContent(updatedContent);
      setEditRow(null); // Reset editRow after updating the row
    }
    setEditPopUpOpen(false); // Close the popup after submitting
  };

  const [editRow, setEditRow] = useState(null)

  const handleEditRow = (idx) => {
    setEditRow(idx);
    setEditPopUpOpen(true);
  }

  useEffect(() => {
    //console.log("editPopUpOpen updated:", editPopUpOpen);
  }, [editPopUpOpen]);

  const actionsColumn = {
    Header: () => (
      <div style={actionHeaderStyle}>
        <span>ACTIONS</span>

      </div>
    ),
    accessor: "actions",  // This can be any unique key not present in your data
    Cell: ({ row }) => (
      <div>
        <button name="edit" style={editActionColumnButtonStyle} onClick = {() => handleEditRow(row.index)}> 
          <LuEdit3 size={20}/>
        </button>
        <button name="delete" style={deleteActionColumnButtonStyle} onClick = {() => handleDeleteRow(row.index)}>
          <MdDelete size={20}/>
        </button>
      </div>
    ),
  };

  const updatedColumns = React.useMemo(() => [...columns, actionsColumn], [
    columns,
  ]);

  // headerGroups: consist of all headers (Uploaded)
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: updatedColumns, data });

  // SUBMIT SUCCESSFULLY BUTTON
  const [scanSuccessfully, setScanSuccessfully] = useState(false);

  return (
    <div>
        <SecondNavBar />
        
        <div style={allEditDocumentContentStyle}>

          <Link style={goBackLinkStyle} to="/uploadpage">
            <div style={goBackStyle}>
              <IoChevronBack size={50} color={"#3A3A3A"}/>
              <button style={goBackButtonStyle}>GO BACK</button>
            </div>
          </Link>

          <div name="locator" style={editDocumentContainer}>

            <div style={imageStyle}>
              <img src={image} />
            </div>

            <div style={scanContentStyle}>

            <div name='textFields' style={topScanStyle}>
              <div style={indiInputStyle}>
                <p style ={editDocumentIndiPStyle}>SUPPLIER ID:</p>
                <input
                  name='supplierField'
                  type="text"
                  value={supplierID}
                  onChange={(e) => setSupplierID(e.target.value)}
                  style ={editDocumentInvoiceInputStyle}
                />
              </div>

              <div style={indiInputStyle}>
                <p style ={editDocumentIndiPStyle}>TOTAL AMOUNT:</p>
                <input
                  name='amountField'
                  type="text"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  style ={editDocumentSuppInputStyle}
                />
              </div>

            </div>



              <div name='tableDiv' style={tableContainerStyle}>
                <table style={tableStyle} {...getTableProps()}>
                  <thead style = {tableHeadStyle}>
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps()}>
                            {column.render("Header")}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>

                  {/*The mapping is iterating through rows and preparing every row*/}
                  <tbody {...getTableBodyProps()}> 
                    {rows.map((row) => {
                      prepareRow(row)
                      return(
                        <tr style = {tableRowStyle} {...row.getRowProps()}>


                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                          ))}
                          
                        </tr>
                      )
                    })}
                  </tbody>

                  </table>
              </div>

              <div style={editDocumentButtonStyle}>
                <button style ={cancelStyle}>Cancel</button>
                <button style={submitStyle} onClick={handleSubmit}>Submit</button>

                <div>
                  <ScanSuccessfully trigger={scanSuccessfully} setTrigger={setScanSuccessfully}/>
                </div>

                <button
                  onClick={() => {
                    setEditRow(null); // Make sure to reset editRow when adding a new row
                    setEditPopUpOpen(true);
                  }}
                  style={plusButtonHeaderStyle}
                >
                  <VscDiffAdded size={30} />
                </button>
                {editPopUpOpen && (
                  <EditPopUp
                    closeEditPopUp={() => {
                      setEditRow(null); // Reset editRow when the popup is closed
                      setEditPopUpOpen(false);
                    }}
                    onSubmit={handleAddRow}
                    defaultInvoiceID={
                      editRow !== null ? uploadcontent[editRow].invoiceID: ''
                    }
                    defaultIssuedDate={
                      editRow !== null ? uploadcontent[editRow].issuedDate: ''
                    }
                    defaultDueDate={
                      editRow !== null ? uploadcontent[editRow].dueDate: ''
                    }
                    defaultAmount={
                      editRow !== null ? uploadcontent[editRow].amount : ''
                    }
                    isAddMode={editRow === null}
                  />
                )}
              </div>

            </div>

          </div>
        </div>

    </div>
    
  )
}


export default EditDocumentPage
