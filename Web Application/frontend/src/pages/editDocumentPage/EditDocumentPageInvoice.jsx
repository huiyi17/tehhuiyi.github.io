import React from 'react'
import SecondNavBar from '../../components/secondNavBar/SecondNavBar';
import EditPopUp from '../../components/editPopUp/EditPopUpInvoice';
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
  const [image, setImage] = useState(location.url);

  // Function to clean numerical fields
  /*const getNumber = (s) => {
    if (typeof s === 'string') {
      return parseFloat(s.replace(/[^0-9.]+/g, ''));
    }
    return NaN; // Or a default value if appropriate
  };*/
  //const getNumber = (s) => { return parseFloat( String(s).replace( /[^0-9.]+/g , '') ); }

  const getNumber = (s) => {
    const parsedNumber = parseFloat(String(s).replace(/[^0-9.]+/g, ''));
    return isNaN(parsedNumber) ? 0 : parsedNumber;
  };


  // Form Data
  const [invoiceID, setInvoiceID] = useState(stateData.invoiceID);
  const [issuedDate, setIssuedDate] = useState(stateData.issuedDate);
  const [dueDate, setDueDate] = useState(stateData.dueDate);
  const [supplierID, setSupplierID] = useState(stateData.supplierID);
  const [totalBeforeGST, setTotalBeforeGST] = useState( getNumber(stateData.totalBeforeGST) );
  const [totalAfterGST, setTotalAfterGST] = useState( getNumber(stateData.totalAfterGST) );
  const [GST, setGST] = useState( getNumber(stateData.GST) );
  // Array Data
  const [productCode, setProductCode] = useState(stateData.productCode);
  const [quantity, setQuantity] = useState(stateData.quantity);
  const [amount, setAmount] = useState(stateData.amount);
  const [productName, setProductName] = useState(stateData.productName);



  // Now to initialise the table data
  // What we need to do is create an array of objects
  // each object contains a mapping of each header, to the 
  // value in the `stateData` object at that index
  const tableLength = stateData.productCode.length; // get the length from any array; shld be the same
  var tableObjects = []; // declare an array of objects
  for (let i = 0; i < tableLength; i++) {
    let obj = {};
    obj.productCode = stateData.productCode[i];
    //obj.quantity = stateData.quantity[i];
    //obj.amount = stateData.amount[i];
    obj.quantity =  getNumber(stateData.quantity[i]);
    obj.amount =  getNumber(stateData.amount[i]);
    obj.productName = stateData.productName[i];
    tableObjects.push(obj);
  }

  // END of initialising table data
  // add quick check to make sure that the table data wont be empty
  if (tableObjects.length === 0) {
    let obj = {};
    obj.productCode = '';
    obj.quantity = '';
    obj.amount = '';
    obj.productName = '';
    tableObjects.push(obj);
  }

  let [uploadcontent, setUploadContent] = useState(tableObjects)
  
  const handleSubmit = async () => {
    try {
  const dataToSend = {
    invoiceID,
    issuedDate,
    dueDate,
    supplierID,
    totalBeforeGST,
    totalAfterGST,
    GST,
    productCode,
    quantity,
    amount, 
    productName,
    uploadcontent
    // ... other fields
     // This should be the data you want to upload
  };
  
      // Make a POST request to the backend API's uploadData endpoint
      const response = await axios.post('http://localhost:8000/invoice/uploadDataInvoice', dataToSend);

      // Handle the response as needed
      console.log(response.data.message);
      setScanSuccessfully(true);
    } catch (error) {
      console.error(error);
    }
  };
  // DATA is uploadcontent. Memory update only when uploadcontent changes.
  const data = React.useMemo(() => uploadcontent, [uploadcontent]);

  // COLUMNS is every column in uploadcontent.
  const columns = React.useMemo(() => [
    {
      Header: "PRODUCT CODE",
      accessor: "productCode"
    },
    {
      Header: "QTY",
      accessor: "quantity"
    },
    {
      Header: "$$",
      accessor: "amount"
    },
    {
      Header: "PRODUCT NAME",
      accessor: "productName"
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
          productCode: newRowData.productCode,
          quantity: newRowData.quantity ? getNumber(newRowData.quantity) : '',
          amount: newRowData.amount ? getNumber(newRowData.amount) : '',
          productName: newRowData.productName
        };
        setUploadContent((prevContent) => [...prevContent, newRow]);
      } else {
      // Edit mode: Update the existing row
      const updatedRow = {
        productCode: newRowData.productCode,
        quantity:  getNumber(newRowData.quantity),
        amount:  getNumber(newRowData.amount),
        productName: newRowData.productName
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
    console.log("editPopUpOpen updated:", editPopUpOpen);
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
        <button style={editActionColumnButtonStyle} onClick = {() => handleEditRow(row.index)}> 
          <LuEdit3 size={20}/>
        </button>
        <button style={deleteActionColumnButtonStyle} onClick = {() => handleDeleteRow(row.index)}>
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
                <p style ={editDocumentIndiPStyle}>INVOICE ID:</p>
                <input
                name='invoiceField'
                  type="text"
                  value={invoiceID}
                  onChange={(e) => setInvoiceID(e.target.value)}
                  style ={editDocumentInvoiceInputStyle}
                />
              </div>

              <div style={indiInputStyle}>
                <p style ={editDocumentIndiPStyle}>ISSUED DATE:</p>
                <input
                name='issuedDateField'
                  type="text"
                  value={issuedDate}
                  onChange={(e) => setIssuedDate(e.target.value)}
                  style ={editDocumentSuppInputStyle}
                />
              </div>

              <div style={indiInputStyle}>
                <p style ={editDocumentIndiPStyle}>DUE DATE:</p>
                <input
                name='dueDateField'
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style ={editDocumentAmtInputStyle}
                />
              </div>

              <div style={indiInputStyle}>
                <p style ={editDocumentIndiPStyle}>SUPPLIER ID:</p>
                <input
                name='supplierField'
                  type="text"
                  value={supplierID}
                  onChange={(e) => setSupplierID(e.target.value)}
                  style ={editDocumentDueInputStyle}
                />
              </div>

              <div style={indiInputStyle}>
                <p style ={editDocumentIndiPStyle}>TOTAL BEFORE GST:</p>
                <input
                
                  type="text"
                  name='beforeGSTField'
                  value={totalBeforeGST}
                  onChange={(e) => setTotalBeforeGST(e.target.value)}
                  style ={editDocumentDueInputStyle}
                />
              </div>

              <div style={indiInputStyle}>
                <p style ={editDocumentIndiPStyle}>GST:</p>
                <input
                name='GSTField'
                  type="text"
                  value={GST}
                  onChange={(e) => setGST(e.target.value)}
                  style ={editDocumentDueInputStyle}
                />
              </div>

              <div style={indiInputStyle}>
                <p style ={editDocumentIndiPStyle}>TOTAL AFTER GST:</p>
                <input
                name='afterGSTField'
                  type="text"
                  value={totalAfterGST}
                  onChange={(e) => setTotalAfterGST(e.target.value)}
                  style ={editDocumentDueInputStyle}
                />
              </div>

              <div style={tableContainerStyle}>
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
                <button name='submitButton' style={submitStyle} onClick={handleSubmit}>Submit</button>
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
                    defaultProductCode={
                      editRow !== null ? uploadcontent[editRow].productCode : ''
                    }
                    defaultQuantity={
                      editRow !== null ? uploadcontent[editRow].quantity : ''
                    }
                    defaultAmount={
                      editRow !== null ? uploadcontent[editRow].amount : ''
                    }
                    defaultProductName={
                      editRow !== null ? uploadcontent[editRow].productName : ''
                    }
                    isAddMode={editRow === null}
                  />
                )}
              </div>

            </div>

          </div>
        </div>

    </div>
    </div>
  )
}

export default EditDocumentPage
