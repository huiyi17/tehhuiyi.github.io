// import React, { useEffect, useState } from 'react';
// import { SecondNavBar } from '../../components/secondNavBar/SecondNavBar';
// // import './detailedSoaPage.css';
// import { Table } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { IoChevronBack } from 'react-icons/io5';
// import { LiaWalletSolid } from 'react-icons/lia';
// import { topPart, soaTitle, supplierName, dueDate, tableContainer, scrollable, 
//           customTable, td, th, bottomPart, paymentButton, paymentButtonImg,
//           rightBottom, totalAmount, goBackStyle, goBackButtonStyle} from './DetailedSoaPageStyle';
// import { useParams } from 'react-router-dom';

// const DetailedSoaPage = () => {
//   const {id}  = useParams();
  
//   // useEffect(() => {
//   //   fetchSOADataById(id);
//   //   console.log(id);
//   // }, [id]);
//     useEffect(() => {
//       if (id) {
//           fetchSOADataById(id);
//           console.log("here")
//       } else {
//         console.log("Invalid ID. Cannot make the fetch request.");
//       }
//   }, []);

//   const [specificSoaData, setSpecificSoaData] = useState([]);
//   const [soaTitle, setSoaTitle] = useState("");
//   const [totalAmount, setTotalAmount] = useState("");


//   const fetchSOADataById = async (id) => {
//     try {
//       // Make an API call to fetch specific data for the given _id
//       console.log('WELPX3');
//       const response = await fetch(`http://localhost:8000/soa/getSOAData/${id}`,{
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       const data = await response.json();
//       // Update the state with the fetched data
//       setSpecificSoaData(data);
//       console.log(id);
//       console.log(specificSoaData);
//       // Update the SOA title and total amount with the specific data
//       setSoaTitle(`SOA #${data._id}`);
//       console.log("WELP");
//       setTotalAmount(`Total Amount: ${data.totalAmount}`);
//       renderTable();

//     } catch (error) {
//       console.error('Error fetching specific SOA data:', error);
//     }
//   };

//   const renderTable = async()=>{
//     // Extract the data from the JSON object
//     const _id = specificSoaData._id;
//     const invoiceID = specificSoaData.invoiceID;
//     const amount = specificSoaData.amount;

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
//           <Link to="/soapage">
//             <IoChevronBack size={50} color={"#3A3A3A"}/>
//             <button style={goBackButtonStyle}>GO BACK</button>
//           </Link>
//         </div>

//         <div className="soa-detail">
//             <h1 style={{soaTitle}}>{soaTitle}</h1>
//             <p style={{supplierName}}>{specificSoaData.supplierID}</p>
//             <p style={{dueDate}}>Due Date: {specificSoaData.issuedDate}</p>
//         </div>
//       </div>
      
//       {/* table */}
//       <div style={tableContainer}>
//         <div style={scrollable}>
//         <Table style={customTable} id="invoiceTable">
//               <thead className="sticky-top">
//                 <tr>
//                   <th style={th}>SOA ID</th>
//                   <th style={th}>Supplier</th>
//                   <th style={th}>Amount</th>
//                 </tr>
//               </thead>
//               {/* <tbody>
//                 {(console.log(specificSoaData))}
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

// export default DetailedSoaPage

import React, { useEffect, useState } from 'react';
import { SecondNavBar } from '../../components/secondNavBar/SecondNavBar';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { LiaWalletSolid } from 'react-icons/lia';
import { topPart, soaTitle, supplierName, dueDate, tableContainer, scrollable, 
          customTable, td, th, bottomPart, paymentButton, paymentButtonImg,
          rightBottom, totalAmount, goBackStyle, goBackButtonStyle, goBackLinkStyle} from './DetailedSoaPageStyle';
import { useParams } from 'react-router-dom';

import backgroundImage from '../../asserts/SOABackground.png';

const DetailedSoaPage = () => {
  const {id}  = useParams();

    useEffect(() => {
      if (id) {
          fetchSOADataById(id);
          console.log("here")
      } else {
        console.log("Invalid ID. Cannot make the fetch request.");
      }
  }, [id]);


  const [specificSoaData, setSpecificSoaData] = useState([]);
  const [soaTitle, setSoaTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");


  const fetchSOADataById = async (id) => {
    try {
      // Make an API call to fetch specific data for the given _id
      console.log('WELPX3');
      const response = await fetch(`http://localhost:8000/soa/getSOAData/${id}`,{
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      // Update the state with the fetched data
      setSpecificSoaData(data);
      console.log(specificSoaData);
      // Update the SOA title and total amount with the specific data
      setSoaTitle(`SOA #${data._id}`);
      console.log("WELP");
      setTotalAmount(`Total Amount: ${data.totalAmount}`);
      console.log("WELP");

    } catch (error) {
      console.error('Error fetching specific SOA data:', error);
    }
  };



  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`, // Set the background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh', 
      }}
    >
      <div className="second-navbar">
          <SecondNavBar />
      </div>

      <div style={topPart}>
        <Link style={goBackLinkStyle} to="/soapage">
          <div style={goBackStyle}>
            <IoChevronBack size={50} color={"#3A3A3A"}/>
            <button style={goBackButtonStyle}>GO BACK</button>
          </div>
        </Link>

        <div className="soa-detail">
            <h1 style={{soaTitle}}>{soaTitle}</h1>
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
              mockData.soaProductDetails.map((item, id) => 
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
                  <th style={th}>SOA ID</th>
                  <th style={th}>SUPPLIER</th>
                  <th style={th}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {(console.log(specificSoaData))}
            {(
                Object.keys(specificSoaData).map((item) => (
                  <tr key={item}>
                    <td style={td}>
                        {specificSoaData[item]}                     
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
          <button style={paymentButton}>
            <Link to="/uploadpage">
              <LiaWalletSolid
                size ={30} 
                style={paymentButtonImg}
                data-testid="payment-button"/>
            </Link>
          </button>
        </div>
      </div>

    </div>
  )
}

export default DetailedSoaPage