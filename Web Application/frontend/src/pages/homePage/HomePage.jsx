import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Scrollbar} from 'swiper/modules';
import axios from 'axios'
import 'swiper/css/bundle';

import backgroundImage from '../../asserts/HomePageBackground.png';
import GridLoader from "react-spinners/GridLoader";

import { SecondNavBar } from '../../components/secondNavBar/SecondNavBar';
import { useLocation } from 'react-router-dom';


import {
  firstrow,
  profileinfo,
  welcomeStyle,
  nameStyle,
  companyStyle,
  gridheader,
  slider,
  slideCompany,
  slidecontent,
  slideCompanyInfo,
  loadingStyle,

} from "./HomePageStyle"



const HomePage = () => {

  // LOADING FUNCTIONALITY
  const [loading, setLoading] = useState(false)

  //API CALL HERE: Replace SetTimeOut to fetching of data
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);

  }, []);

  const location = useLocation();

  // GETTING NAME + COMPANY FROM DATABASE
  const userEmail = location.state?.email || '';
  const [userInfo, setUserInfo] = useState({userEmail: '', userName: '', userCompany: '' });

  // const [slideInfo, setSlideInfo] = useState([]);
  // const [invoiceID, setInvoiceID] = useState('');
  // const [supplierID, setSupplierID] = useState('');
  
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      setLoading(true);
      axios
        .get('http://localhost:8000/users/getUserInfo', {
          params: {
            email: userEmail,
          },
        })
        .then((response) => {
          console.log(response.data);
          setUserInfo(response.data);
          localStorage.setItem('userInfo', JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        })
        .finally(() => {
          console.log('Fetching user info completed.');
          setLoading(false);
        });
    }
  }, [userEmail]);

  // useEffect(() => {
  //   axios
  //     .get('http://localhost:8000/homepage/getSlideInfo', {
  //       params:{
  //       invoiceID: invoiceID,
  //       supplierID: supplierID,}
  //     })
  //     .then((response) => {
  //       console.log('Slide info fetched:', response.data);
  //       setSlideInfo(response.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching slide info:', error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // },  [invoiceID, supplierID]);


  console.log("user info name",userInfo.name);

  // Requires fetching from Database
  let slideInfo = [
    { company: "OATSIDE", 
      name: "Tan Min Yi", 
      contact: "+65 9876 5432", 
      address: "Blk 123 Ang Mo Kio Ave 2 #12-34 S(567890)" },

    { company: "MUJI", 
      name: "Renee Ki Meiee", 
      contact: "+65 8667 5643", 
      address: "Blk 12 Seng Kang Street #01-39 S(125640)" },

    { company: "COTTON ON", 
      name: "Swee Heng Sean", 
      contact: "+65 9007 2345", 
      address: "12 Toa Payoh Road #03-67 S(987654)" },

    { company: "POPULAR",
      name: "Rebecca Chan",
      contact: "+65 8456 3401",
      address: "blk 67 Paya Lebar SingPost"}
  ]

  const renderSlide = (slide, index) => {

    const slidestyle = {
      width: "200px",
      height: "230px",
      marginRight: "20px",

      backgroundColor: "rgba(238, 255, 232, 0.60)",
      borderRadius: "12px",
      border: "none",
      scrollSnapAlign: "start",
      transition: "all 0.2s",
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.3)",
     };

    return(

        <SwiperSlide key = {index} style = {slidestyle}>
          <div style={slidecontent}>
            <h4 style={slideCompany} >{slide.company}</h4>
            <p style={slideCompanyInfo}>Name: {slide.name}</p>
            <p style={slideCompanyInfo}>Contact: {slide.contact}</p>
            <p style={slideCompanyInfo}>Address: {slide.address}</p>
          </div>
        </SwiperSlide>
      
    )
  }

  return (
    <>
    {loading ? (
      <div style={loadingStyle}>
        <GridLoader 
        color={"#3A3A3A"} 
        loading={loading} 
        size={20}
        data-testid="spinner" />
      </div>
    ) : (
      <div
      style={{
        backgroundImage: `url(${backgroundImage})`, // Set the background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh', 
      }}
    >

      <div>
        <SecondNavBar />
      </div>

      <div style={firstrow}>        

        <div style={profileinfo}>
          <h1 name='header' style={welcomeStyle} >WELCOME,</h1>
          <h2 style={nameStyle} >{userInfo.userName.toUpperCase()} !</h2>
          <h2 style={companyStyle}> {userInfo.userCompany}</h2>
        
        </div>

      </div>

        <div>
          <h3 style={gridheader}>Companies Involved:</h3>
        </div>

        <div style={slider}>
          <Swiper
          modules={[Scrollbar]}
          spaceBetween={50}
          slidesPerView={3}
          scrollbar={{draggable: true }}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
          >
          
          {slideInfo.map(renderSlide)}

          </Swiper>
        </div>

        </div>
      )}
    </>
  );
};

export default HomePage