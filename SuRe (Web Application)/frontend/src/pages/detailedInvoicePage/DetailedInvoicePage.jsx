// import React, { useEffect, useState } from 'react';
// import { SecondNavBar } from '../../components/secondNavBar/SecondNavBar';
// // import './detailedInvoicePage.css';
// import { Table } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { IoChevronBack } from 'react-icons/io5';
// import { LiaWalletSolid } from 'react-icons/lia';
// import { topPart, InvoiceTitle, supplierName, dueDate, tableContainer, scrollable, 
//           customTable, td, th, bottomPart, paymentButton, paymentButtonImg,
//           rightBottom, totalAmount, goBackStyle, goBackButtonStyle} from './DetailedInvoicePageStyle';
// import { useParams } from 'react-router-dom';

// const DetailedInvoicePage = () => {
//   const {id}  = useParams();
  
//   // useEffect(() => {
//   //   fetchInvoiceDataById(id);
//   //   console.log(id);
//   // }, [id]);
//     useEffect(() => {
//       if (id) {
//           fetchInvoiceDataById(id);
//           console.log("here")
//       } else {
//         console.log("Invalid ID. Cannot make the fetch request.");
//       }
//   }, []);

//   const [specificInvoiceData, setSpecificInvoiceData] = useState([]);
//   const [InvoiceTitle, setInvoiceTitle] = useState("");
//   const [totalAmount, setTotalAmount] = useState("");


//   const fetchInvoiceDataById = async (id) => {
//     try {
//       // Make an API call to fetch specific data for the given _id
//       console.log('WELPX3');
//       const response = await fetch(`http://localhost:8000/Invoice/getInvoiceData/${id}`,{
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       const data = await response.json();
//       // Update the state with the fetched data
//       setSpecificInvoiceData(data);
//       console.log(id);
//       console.log(specificInvoiceData);
//       // Update the Invoice title and total amount with the specific data
//       setInvoiceTitle(`Invoice #${data._id}`);
//       console.log("WELP");
//       setTotalAmount(`Total Amount: ${data.totalAmount}`);
//       renderTable();

//     } catch (error) {
//       console.error('Error fetching specific Invoice data:', error);
//     }
//   };

//   const renderTable = async()=>{
//     // Extract the data from the JSON object
//     const _id = specificInvoiceData._id;
//     const invoiceID = specificInvoiceData.invoiceID;
//     const amount = specificInvoiceData.amount;

//     // Get the table element to populate the data
//     const table = document.getElementById('invoiceTable');

//     // Generate the table rows dynamically
//     for (let i = 0; i < invoiceID.length; i++) {
//       const row = table.insertRow();
//       const cell1 = row.insertCell(0);
//       const cell2 = row.insertCell(1);
//       const cell3 = row.insertCell(2);

//       cell1.innerHTML = _id;
//       cell2.innerHTML = invoiceID[i];
//       cell3.innerHTML = amount[i];
//     }
//   }


//   return (
//     <div>
//       <div className="second-navbar">
//           <SecondNavBar />
//       </div>

//       <div style={topPart}>
//         <div style={goBackStyle}>
//           <Link to="/Invoicepage">
//             <IoChevronBack size={50} color={"#3A3A3A"}/>
//             <button style={goBackButtonStyle}>GO BACK</button>
//           </Link>
//         </div>

//         <div className="Invoice-detail">
//             <h1 style={{InvoiceTitle}}>{InvoiceTitle}</h1>
//             <p style={{supplierName}}>{specificInvoiceData.supplierID}</p>
//             <p style={{dueDate}}>Due Date: {specificInvoiceData.issuedDate}</p>
//         </div>
//       </div>
      
//       {/* table */}
//       <div style={tableContainer}>
//         <div style={scrollable}>
//         <Table style={customTable} id="invoiceTable">
//               <thead className="sticky-top">
//                 <tr>
//                   <th style={th}>Invoice ID</th>
//                   <th style={th}>Supplier</th>
//                   <th style={th}>Amount</th>
//                 </tr>
//               </thead>
//               {/* <tbody>
//                 {(console.log(specificInvoiceData))}
//             {(
//                 invoiceID.map((id, index) => (
//                   <tr key={index}>
//                     <td>{_id}</td>
//                     <td>{id}</td>
//                     <td>{amount[index]}</td>
//                   </tr>
//                 ))
//               )}
//            </tbody> */}
//           </Table>

//         </div>
//       </div>

//       <div style={bottomPart}>
//         <div style={rightBottom}>
//           {/* sum of all amounts */}
//           <p style={{totalAmount}}>{totalAmount}</p>
//           {/* if clicked go to compare doc page */}
//           <button style={paymentButton}>
//             <Link to="/comparedocumentpage">
//               <LiaWalletSolid size ={30} style={paymentButtonImg}/>
//             </Link>
//           </button>
//         </div>
//       </div>

//     </div>
//   )
// }

// export default DetailedInvoicePage

import React, { useEffect, useState } from 'react';
import { SecondNavBar } from '../../components/secondNavBar/SecondNavBar';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { topPart, InvoiceTitle, supplierName, dueDate, tableContainer, scrollable, 
          customTable, td, th, bottomPart,
          rightBottom, totalAmount, goBackStyle, goBackButtonStyle, goBackLinkStyle} from './DetailedInvoicePageStyle';
import { useParams } from 'react-router-dom';

import backgroundImage from '../../asserts/InvoiceBackground.png';

const DetailedInvoicePage = () => {
  const {id}  = useParams();

    useEffect(() => {
      if (id) {
          fetchInvoiceDataById(id);
          console.log("here")
      } else {
        console.log("Invalid ID. Cannot make the fetch request.");
      }
  }, [id]);


  const [specificInvoiceData, setSpecificInvoiceData] = useState([]);
  const [InvoiceTitle, setInvoiceTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");


  const fetchInvoiceDataById = async (id) => {
    try {
      // Make an API call to fetch specific data for the given _id
      console.log('WELPX3');
      const response = await fetch(`http://localhost:8000/Invoice/getInvoiceData/${id}`,{
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      // Update the state with the fetched data
      setSpecificInvoiceData(data);
      console.log(specificInvoiceData);
      // Update the Invoice title and total amount with the specific data
      setInvoiceTitle(`Invoice #${data._id}`);
      console.log("WELP");
      setTotalAmount(`Total Amount: ${data.totalAmount}`);
      console.log("WELP");

    } catch (error) {
      console.error('Error fetching specific Invoice data:', error);
    }
  };



  return (
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

      <div style={topPart}>
        <Link style={goBackLinkStyle} to="/Invoicepage">
          <div style={goBackStyle}>
            <IoChevronBack size={50} color={"#3A3A3A"}/>
            <button style={goBackButtonStyle}>GO BACK</button>
          </div>
        </Link>

        <div className="Invoice-detail">
            <h1 style={{InvoiceTitle}}>{InvoiceTitle}</h1>
            {/* <p style={{supplierName}}>Bakers Room</p>
            <p style={{dueDate}}>Due Date: 13/07/23</p> */}
        </div>
      </div>

      {/* table */}
      <div style={tableContainer}>
        <div style={scrollable}>
          {/* <Table style={customTable}>
            <thead className="sticky-top">
              <tr>
                <th style={th}>Product</th>
                <th style={th}>Quantity</th>
                <th style={th}>Amount</th>
              </tr>
            </thead>
            <tbody>
            {
              mockData.InvoiceProductDetails.map((item, id) => 
              <tr key={id}>
                <td style={td}>{item.product}</td>
                <td style={td}>{item.quantity}</td>
                <td style={td}>{item.amount}</td>
              </tr>      
              )  
            }
            </tbody>
          </Table> */}

        <Table style={customTable}>
              <thead className="sticky-top">
                <tr>
                  <th style={th}>Invoice ID</th>
                  <th style={th}>Supplier</th>
                  <th style={th}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {(console.log(specificInvoiceData))}
            {(
                Object.keys(specificInvoiceData).map((item) => (
                  <tr key={item}>
                    <td style={td}>
                        {specificInvoiceData[item]}                     
                    </td>
                    <td style={td}>
                        {item.supplierID}
                    </td>
                    <td style={td}>
                        {item.issuedDate}
                    </td>
                    <td style={td}>
                        {item.invoiceID}
                    </td>
                  </tr>
                ))
              )}
           </tbody>
          </Table>
        </div>
      </div>

      <div style={bottomPart}>
        <div style={rightBottom}>
          {/* sum of all amounts */}
          <p style={{totalAmount}}>{totalAmount}</p>
          {/* if clicked go to compare doc page */}
          {/* <button style={paymentButton}>
            <Link to="/comparedocumentpage">
              <LiaWalletSolid size ={30} style={paymentButtonImg}/>
            </Link>
          </button> */}
        </div>
      </div>

    </div>
  )
}

export default DetailedInvoicePage