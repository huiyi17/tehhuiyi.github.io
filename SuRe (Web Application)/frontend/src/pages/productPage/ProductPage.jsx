import React, { useEffect, useState } from "react";
import SecondNavBar from '../../components/secondNavBar/SecondNavBar'
import { AiFillPlusCircle } from "react-icons/ai"
import { Swiper, SwiperSlide } from 'swiper/react';
import {Scrollbar} from 'swiper/modules';

import 'swiper/css/bundle';
import AddProduct from '../../components/addProduct/AddProduct';

const ProductPage = () => {
  useEffect(() => {
    // Fetch SOA data from the backend when the component mounts
    fetchProdData();
  }, []);

  const fetchProdData = async () => {
    try {
      // Make an API call to your backend to fetch SOA data
      const response = await fetch("http://localhost:8000/product/getProdData", {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json();
      // Update the state with the fetched data
      // TODO: escape this error of empty array cannot be mapped when no data is fetched. 
      setProdData(data);

      console.log("SOA data fetched successfully!");

      console.log(response);
    } catch (error) {
      console.error("Error fetching SOA data:", error);
    }
  };
  const [prodData, setProdData] = useState([]);
  console.log(prodData);

    const productslider = {
        marginLeft: "150px",
        marginRight: "150px",

        marginTop: "40px",
    }

    const productheader = {
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",

        marginLeft: "40%", //not a permeanant solution. texts of different sizes may enter.
        marginRight: "15%",
    }

    const productcompany = {
        color: "#418EFF",
        fontFamily: "Inter",
        fontSize: "25px",
        fontStyle: "normal",
        fontWeight: "700",
        lineHeight: "normal",
    }

    let productInfo = prodData;
    console.log(productInfo);

      const productSlide = (product, index) => {

        const productstyle = {
          width: "120px",
          height: "450px",
          marginRight: "30px",
          marginLeft: "30px",
          textAlign: "center",
    
          backgroundColor: "rgba(65, 142, 255, 0.10)",
          borderRadius: "12px",
          border: "none",
          scrollSnapAlign: "start",
          transition: "all 0.2s",
          boxShadow: "-2px 4px 30px 0px rgba(0, 0, 0, 0.25)",
          

          borderRadius: "12px",
          background: "linear-gradient(180deg, rgba(243, 243, 243, 0.70) 0%, rgba(218, 213, 219, 0.00) 100%)",
          shadow: ""
         };

         const h1product = {
            color: "#535353",
            fontFamily: "Inter",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: "normal",
        }

        const pproduct = {
            color: "#000",
            fontFamily: "Inter",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight:"normal",
        }

        const imgproduct = {

            margin: "30px",
        }
        
    
        return(
    
            <SwiperSlide key = {index} style = {productstyle}>
              <div>
                <img style={imgproduct} src={product.image} alt="Error"></img>
                <h1 style={h1product}>Name: {product.productName}</h1>
                <p style={pproduct}>Price: {product.price}</p>
                <p style={pproduct}>Product Code: {product.productCode}</p>
              <p style={pproduct}>Quantity: {product.quantity}</p>
              <p style={pproduct}>Description: {product.description}</p>
                {/* <img src={product.barcode} alt="Error"></img> */}
              </div>
            </SwiperSlide>
        )
      }

      const pluscirclestyle = {
        background: "transparent",
        border: "none",
        marginLeft: "300px",
    }

    const productpopupstyle = {
        zIndex: "2",
      }

    const [addPopUp, setAddPopUp] = useState(false);

  return (
    <div>
        <SecondNavBar />

        <div style = {productheader}>
            <h1 style={productcompany}>Textile Centre Fabric</h1>

            <button style={pluscirclestyle} onClick={ () => setAddPopUp(true)}>
            < AiFillPlusCircle color="#418EFF" size="50px"/>
            </button>

            <div style={productpopupstyle}>
            <AddProduct trigger={addPopUp} setTrigger={setAddPopUp}>
            </AddProduct>
          </div>

        </div>

        <div style={productslider}>
          <Swiper
          modules={[Scrollbar]}
          spaceBetween={50}
          slidesPerView={4}
          scrollbar={{draggable: true }}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}>
          
          {productInfo.map(productSlide)}

          </Swiper>
        </div>

    </div>
  )
}

export default ProductPage