import React from 'react'
import { useEffect,useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SecondNavBar from '../../components/secondNavBar/SecondNavBar';
import GridLoader from "react-spinners/GridLoader";
import { MdUploadFile , MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";

import backgroundImage from '../../asserts/UploadBackground.png';

import {
  fileupload,
  fileinfo,
  uploading,
  alluploads,
  uploadconfirm,
  documentTypeStyle,
  documentTypeTextStyle,
  documentTypeSOATextStyle,
  uploadsubmitbutton,
  uploadcancelbutton,
  documentTypeH1TextStyle,
  labelStyle,
  loadingStyle,
  selectedButtonStyle,
  unselectedButtonStyle,
  unselectedSOAButtonStyle,
  selectedSOAButtonStyle,

} from "./UploadPageStyle"

const UploadPage = () => {

  // LOADING FUNCTIONALITY
  const [loading, setLoading] = useState(false)

  //API CALL HERE: Replace SetTimeOut to fetching of data
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);

  }, []);

  //START VALIDATION
  const [error, setError] = useState({
    upload: false
  });

  // END OF VALIDATION

  const [image, setImage] = useState(null)
  const [fileName, setFileName] = useState ("No File Selected")
  const [selectedType, setSelectedType] = useState("INVOICE");


  const navigate = useNavigate(); // used to redirect after waiting on promise

  const handleDocumentTypeClick = (type) => {
    setSelectedType(type);
  };

   // // // // // // // /
  // START OF BACKEND //
 /// // // // // // ///

  const [isScanning, setIsScanning] = useState(false)
  const [formData, setFormData] = useState(new FormData());

  const dummyInvoice = { 
    // this is a dummy invoice object to be passed on to the editDocumentPage
    // Delete this later and replace with a call to the endpoint to get the 
    // raw OCRed data

    invoiceID: 'the first invoiceeeee',
    issuedDate: 'yesterday',
    dueDate: 'tomorrow',
    supplierID: '69',
    totalBeforeGST: 'two dollars',
    totalAfterGST: 'a million dollars',
    GST: 'yes there is gst',
    productCode: [777, 86],
    quantity: [2, 44],
    amount: [22, 33],
    productName: ['hot dogs', 'buns'],
  }
  
  const [ocrData, setOcrData] = useState({});


  const handleFileUploadInvoice = async () => {
    
    // const formData = new FormData();
    // formData.append("pdfFile", image);
    //console.log("isInvoiceActive:", isInvoiceActive);
    console.log("image:", image);
    console.log('Invoice is clicked')
    //navigate('/invoice/editdocumentpage', {state: dummyInvoice})
    
    let response = await axios // wait for the data to be scanned
      .post("http://localhost:8000/invoice/scanData", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    console.log(response);
    console.log('set ocrData');
    setOcrData(response.data);
    console.log(ocrData);
    navigate('/invoice/editdocumentpage', {state: response.data, url:formData.get('file')})


  };

  const handleFileUploadSOA = async () => {
    
    console.log("image:", image);
    console.log('SOA is clicked')
    //navigate('/invoice/editdocumentpage', {state: dummyInvoice})
    
    let response = await axios // wait for the data to be scanned
      .post("http://localhost:8000/soa/scanData", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    console.log(response);
    console.log('set ocrData');
    setOcrData(response.data);
    console.log(ocrData);
    navigate('/soa/editdocumentpage', {state: response.data, url:image})

  };
    const handleFileUploadReceipt = async () => {
      
    // const formData = new FormData();
    // formData.append("pdfFile", image);
    //console.log("isInvoiceActive:", isInvoiceActive);
    console.log("image:", image);
    console.log('Payment is clicked');

    let response = await axios // wait for the data to be scanned
      .post("http://localhost:8000/payment/scanDataPayment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    console.log(response);

};

const sendWhatsAppNotification = async () => {
  try {
    // client.on('qr', (qr) => {
    //   // Set the QR code string to the state variable
    //   setQrCode(qr);
    // });
    const response = await axios.post("http://localhost:8000/payment/sendWhatsApp", {
      // Include any necessary data for the notification
    });
    console.log('WhatsApp notification sent:', response.data);
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
  }
};

// const sendNotification = async () => {
//   const phoneNumber = '+6583023966'; // Replace with the recipient's phone number including country code (e.g., +1234567890)
// try {
//     client.messages
//         .create({
//             body: 'Payment received!',
//             from: 'whatsapp:+14155238886',
//             to: phoneNumber
//         })
//         .then(message => console.log(message.sid))
//         .done();
// } catch (error) {
//     console.error('Error sending WhatsApp notification:', error);
// }
// };

    const handleConditionalButtonClick = async () =>{
      if (image === null) {
        // handle when the used doesnt select an image to scan
        toast('Please select an image first', {autoclose: 1000, closeOnClick: true});
      }
      else if(isScanning){
        toast('Scanning is in progress', {autoclose: 1000, closeOnClick: true});
      }
      else if(selectedType == "INVOICE"){
        setIsScanning(true)
        await toast.promise(
          handleFileUploadInvoice(),
          {
            pending:'Scanning data...',
            succerss:'redirecting to edit page...',
            error:'Scanning failed :('}
        );
        
        console.log(1);
      }
      else if(selectedType == "STATEMENT"){
        setIsScanning(true)
        await toast.promise(
          handleFileUploadSOA(),
          {
            pending:'Scanning data...',
            succerss:'redirecting to edit page...',
            error:'Scanning failed :('}
        );
        console.log(2);
      }
      else if(selectedType == "PAYMENT"){
        await handleFileUploadReceipt();
        await sendWhatsAppNotification();
        console.log(3);
      }
      else{
        // this.handleFileUploadCreditNote();
        console.log(4);
      }
  }

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

      <div>
        <SecondNavBar />
        <ToastContainer />
      </div>

      <div className="alluploads" style = {alluploads}>

        <div name="outerDiv" style={documentTypeStyle}>
          <h1 style={documentTypeTextStyle}>DOCUMENT TYPE:</h1>

          <button
          data-testid="btn-invoice"
          name="invoice"
          style={selectedType === "INVOICE" ? selectedButtonStyle : unselectedButtonStyle}
          onClick={() => handleDocumentTypeClick("INVOICE")}
          >
            INVOICE
          </button>

          <button
          data-testid="btn-invoice"
          name="soa"
            style={selectedType === "STATEMENT" ? selectedSOAButtonStyle : unselectedSOAButtonStyle}
            onClick={() => handleDocumentTypeClick("STATEMENT")}
          >
            STATEMENT OF{'\n'}ACCOUNT
          </button>

          <button
          data-testid="btn-invoice"
          name="payment"
            style={selectedType === "PAYMENT" ? selectedButtonStyle : unselectedButtonStyle}
            onClick={() => handleDocumentTypeClick("PAYMENT")}
          >
            PAYMENT
          </button>

          <button
            data-testid="btn-invoice"
            style={selectedType === "CREDIT NOTE" ? selectedButtonStyle : unselectedButtonStyle}
            onClick={() => handleDocumentTypeClick("CREDIT NOTE")}
          >
            CREDIT NOTE
          </button>
          
        </div>

        <div style={uploading}>

          <form style = {fileupload} 
          onClick={() => document.querySelector(".input-field").click()}>
            <input type="file" accept="png/*" className ="input-field" hidden
            onChange={({ target: {files}}) => {
            files[0] && setFileName(files[0].name)
            if (files) {
              setImage(URL.createObjectURL(files[0]))
              let newFormData = new FormData();
              newFormData.append('file', files[0]);
              setFormData(newFormData);
            }}}></input>

             {image ? (
                <img src={image} alt={"Error"} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <MdUploadFile color="#535353" size={130} />
                  {error.upload && !image && <label style={labelStyle}>No image uploaded</label>}
                </div>
              )}
          </form>

          <section style={fileinfo}>
            <AiFillFileImage color="#535353"/>
            <span>
              {fileName}
              <MdDelete color="#535353" 
              onClick = {() => {
                setFileName('No File Selected')
                setImage(null)
                setFormData(new FormData())
              }}/>
            </span>
          </section>
        </div>


      </div>

      <div style={uploadconfirm}>
        {/*<Link to="/editdocumentpage">*/}
        {/*<Link to={{
          pathname:"/editdocumentpage",
          state: {attr:'hello from upload page'}
          }}
        >*/}
          <button name="submitButton" style={uploadcancelbutton} onClick={() => handleConditionalButtonClick()}>Submit</button>
    {/*<Link to="/invoice/editdocumentpage" state = {ocrData}>
        </Link>*/}
          <button style={uploadcancelbutton} 
                onClick = {() => {
                setFileName('No File Selected')
                setImage(null)
              }}>Cancel</button>
      </div>
      
      </div>
      )}
    </>
  );
};

export default UploadPage
