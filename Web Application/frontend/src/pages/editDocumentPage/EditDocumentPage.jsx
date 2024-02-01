import React from 'react'
import SecondNavBar from '../../components/secondNavBar/SecondNavBar';
import EditPopUp from '../../components/editPopUp/EditPopUp';
import ScanSuccessfully from '../../components/scanSuccessfully/ScanSuccessfully';

import { useState, useEffect } from 'react'
import { useTable } from 'react-table'
import { Link, useLocation } from 'react-router-dom'

import { IoChevronBack } from 'react-icons/io5'
import { LuEdit3 } from 'react-icons/lu'
import { MdDelete } from 'react-icons/md'
import { VscDiffAdded } from "react-icons/vsc"

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

  const [invoiceId, setInvoiceId] = useState(""); // State for invoice ID
  const [supplier, setSupplier] = useState(""); // State for supplier
  const [totalAmount, setTotalAmount] = useState(""); 
  const [dueDate, setDueDate] = useState(""); 

  let [uploadcontent, setUploadContent] = useState([

    { 
      "Product": stateData.amount,
      "Quantity": "1",
      "Amount": "$1",
    },
    { 
      "Product": "Product0",
      "Quantity": "1",
      "Amount": "$1",
    },
    { 
      "Product": "Product1",
      "Quantity": "1",
      "Amount": "$1",
    },
    { 
      "Product": "Product2",
      "Quantity": "1",
      "Amount": "$1",
    },
    { 
      "Product": "Product3",
      "Quantity": "1",
      "Amount": "$1",
    },
    { 
      "Product": "Product4",
      "Quantity": "1",
      "Amount": "$1",
    },
    { 
      "Product": "Product5",
      "Quantity": "1",
      "Amount": "$1",
    },
    { 
      "Product": "Product6",
      "Quantity": "1",
      "Amount": "$1",
    },
    { 
      "Product": "Product7",
      "Quantity": "1",
      "Amount": "$1",
    },
    { 
      "Product": "Product8",
      "Quantity": "1",
      "Amount": "$1",
    },
    { 
      "Product": "Product9",
      "Quantity": "1",
      "Amount": "$1",
    }
  ])
  

  // DATA is uploadcontent. Memory update only when uploadcontent changes.
  const data = React.useMemo(() => uploadcontent, [uploadcontent]);

  // COLUMNS is every column in uploadcontent.
  const columns = React.useMemo(() => [
    {
      Header: "PRODUCT",
      accessor: "Product"
    },
    {
      Header: "QTY",
      accessor: "Quantity"
    },
    {
      Header: "$$",
      accessor: "Amount"
    },
    {
      Header: "Price b4 gst",
      accessor: "Price"
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
        Product: newRowData.product,
        Quantity: newRowData.quantity,
        Amount: newRowData.amount,
      };
      setUploadContent((prevContent) => [...prevContent, newRow]);
    } else {
      // Edit mode: Update the existing row
      const updatedRow = {
        Product: newRowData.product,
        Quantity: newRowData.quantity,
        Amount: newRowData.amount,
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
const [scanSuccessfully, setScanSuccessfully] = useState(false)


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

          <div style={editDocumentContainer}>

            <div style={imageStyle}>
              <img src="not-found.png" />
            </div>

            <div style={scanContentStyle}>

            <div style={topScanStyle}>
              <div style={indiInputStyle}>
                <p style ={editDocumentIndiPStyle}>INVOICE ID:</p>
                <input
                  type="text"
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  style ={editDocumentInvoiceInputStyle}
                />
              </div>

              <div style={indiInputStyle}>
                <p style ={editDocumentIndiPStyle}>SUPPLIER:</p>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  style ={editDocumentSuppInputStyle}
                />
              </div>

              <div style={indiInputStyle}>
                <p style ={editDocumentIndiPStyle}>AMOUNT:</p>
                <input
                  type="text"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  style ={editDocumentAmtInputStyle}
                />
              </div>

              <div style={indiInputStyle}>
                <p style ={editDocumentIndiPStyle}>DUE DATE:</p>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style ={editDocumentDueInputStyle}
                />
              </div>

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
                <button 
                style={submitStyle}
                onClick={ () => { setScanSuccessfully(true);}}>Submit</button>

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
                    defaultProduct={
                      editRow !== null ? uploadcontent[editRow].Product : ''
                    }
                    defaultQuantity={
                      editRow !== null ? uploadcontent[editRow].Quantity : ''
                    }
                    defaultAmount={
                      editRow !== null ? uploadcontent[editRow].Amount : ''
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
