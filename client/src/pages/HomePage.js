import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";

import styled from "styled-components";
import axios from "axios";

import { UserContext } from "../App";

import BannerImage from "../components/BannerImage";
import CategoryCarousel from "../components/CategoryCarousel";

const HomePage = () => {
  const { state } = useContext(UserContext);
  // console.log(state);

  const [allProducts, setAllProducts] = useState([]);

  const fetchAllProducts = async () => {
    try {
      let { data } = await axios.get("/product/allproducts");
      // console.log(data)
      if (data.status) {
        setAllProducts(data.response);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // console.log(allProducts);

  const categories = [
    {
      name: "Men's Fashion",
      url: "https://m.media-amazon.com/images/I/61336XX35+L._UX466_.jpg",
    },
    {
      name: "Women's Fashion",
      url: "https://m.media-amazon.com/images/S/aplus-seller-content-images-us-east-1/ATVPDKIKX0DER/A18XF08L807B4F/c072f9b3-76c1-467c-8814-231c0c3f06c7._CR0,0,300,300_PT0_SX300__.jpg",
    },
    {
      name: "Kid",
      url: "https://i.pinimg.com/236x/3a/e0/3f/3ae03f2ebc6ad2ae22ce28f40d55b2eb--jcrew-kids-kids-clothing.jpg",
    },
    {
      name: "Jewellery",
      url: "https://m.media-amazon.com/images/S/aplus-media/vc/bd24f0bb-1f63-44ae-a8fe-42939fd33d1a.__CR0,303,2000,1237_PT0_SX970_V1___.jpg",
    },
    {
      name: "Home Decor",
      url: "https://m.media-amazon.com/images/I/61q73U+W3SL._SX425_.jpg",
    },
    {
      name: "Electronics",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwVJR78doMSPBqkiUaAB06W94RFxK5nn7bgsGz6FchevNtnAenNGFbrr5Qrm4WaLbb3Ts&usqp=CAU",
    },
  ];

  const [menProduct, setMenProduct] = useState(null);
  const [womenProduct, setWomenProduct] = useState(null);
  const [kidProduct, setKidProduct] = useState(null);
  const [jewelleryProduct, setJewelleryProduct] = useState(null);
  const [homeDecorProduct, setHomeDecorProduct] = useState(null);
  const [electronicsProduct, setElectronicsProduct] = useState(null);

  const fetchMenProduct = async () => {
    try {
      let { data } = await axios.get(`/product/category/${categories[0].name}`);
      // console.log(data.response)
      if (data.status) {
        setMenProduct(data.response);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  const fetchWomenProduct = async () => {
    try {
      let { data } = await axios.get(`/product/category/${categories[1].name}`);
      // console.log(data.response)
      if (data.status) {
        setWomenProduct(data.response);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  const fetchKidProduct = async () => {
    try {
      let { data } = await axios.get(`/product/category/${categories[2].name}`);
      // console.log(data.response)
      if (data.status) {
        setKidProduct(data.response);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  const fetchJewelleryProduct = async () => {
    try {
      let { data } = await axios.get(`/product/category/${categories[3].name}`);
      // console.log(data.response)
      if (data.status) {
        setJewelleryProduct(data.response);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  const fetchHomeDecorProduct = async () => {
    try {
      let { data } = await axios.get(`/product/category/${categories[4].name}`);
      // console.log(data.response)
      if (data.status) {
        setHomeDecorProduct(data.response);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  const fetchElectronicsProduct = async () => {
    try {
      let { data } = await axios.get(`/product/category/${categories[5].name}`);
      // console.log(data.response)
      if (data.status) {
        setElectronicsProduct(data.response);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchMenProduct();
    fetchWomenProduct();
    fetchKidProduct();
    fetchJewelleryProduct();
    fetchHomeDecorProduct();
    fetchElectronicsProduct();
  }, []);
  // console.log(menProduct);
  // console.log(womenProduct);
  // console.log(kidProduct);
  // console.log(jewelleryProduct);
  // console.log(homeDecorProduct);
  // console.log(electronicsProduct);

  // let list = {
  //   name: [],
  //   image: []
  // }
  // if (allProducts) {
  //   allProducts.map((item) => {
  //     if (!list.name.includes(item.category)) {
  //       list.name.push(item.category);
  //       list.image.push(item.image);
  //       // list.push({name: item.category, image: item.image});
  //     }
  //   });
  // }
  // console.log(list);

  return (
    <>
      <Container>
        <Categories>
          {categories.map((item) => (
            <div className="category">
              <div className="image">
                <NavLink to={`/category/${item.name}`}>
                  <img src={item.url} alt="pic" />
                </NavLink>
              </div>
              <p>{item.name}</p>
            </div>
          ))}
        </Categories>

        <BannerImage />

        <MultiCarousel>
          <div>
            <NavLink
              to={`/category/${categories[0].name}`}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <div className="title">{categories[0].name}</div>
            </NavLink>
            {menProduct && <CategoryCarousel product={menProduct} />}
          </div>

          <div>
            <NavLink
              to={`/category/${categories[1].name}`}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <div className="title">{categories[1].name}</div>
            </NavLink>

            {womenProduct && <CategoryCarousel product={womenProduct} />}
          </div>

          <div>
            <NavLink
              to={`/category/${categories[3].name}`}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <div className="title">{categories[3].name}</div>
            </NavLink>

            {jewelleryProduct && (
              <CategoryCarousel product={jewelleryProduct} />
            )}
          </div>

          <div>
            <NavLink
              to={`/category/${categories[4].name}`}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <div className="title">{categories[4].name}</div>
            </NavLink>

            {homeDecorProduct && (
              <CategoryCarousel product={homeDecorProduct} />
            )}
          </div>

          <div>
            <NavLink
              to={`/category/${categories[5].name}`}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <div className="title">{categories[5].name}</div>
            </NavLink>

            {electronicsProduct && (
              <CategoryCarousel product={electronicsProduct} />
            )}
          </div>

          <div>
            <NavLink
              to={`/category/${categories[2].name}`}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <div className="title">{categories[2].name}</div>
            </NavLink>
            {kidProduct && <CategoryCarousel product={kidProduct} />}
          </div>
        </MultiCarousel>

        <MiniBanner>
          <img src="https://i.pinimg.com/originals/88/01/d9/8801d9948d54c7ce01bd20108fd64741.png" alt="sale"/>
        </MiniBanner>
      </Container>
    </>
  );
};

const Container = styled.div`
  height: auto;
  width: 100%;
  ${"" /* background: lightgrey; */}
`;

const Categories = styled.div`
  height: 15vh;
  width: 100%;
  display: flex;
  border-bottom: 1px solid lightgrey;
  .category {
    height: 100%;
    width: 8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-right: 1px solid lightgrey;
    .image {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: right;
      overflow: hidden;
      padding-top: 3px;
      img {
        width: 100%;
        height: 95%;
        object-fit: cover;
      }
    }
    p {
      font-size: 12px;
    }
  }
`;

const MultiCarousel = styled.div`
  height: auto;
  width: 100%;
  padding: 0 0.5rem 1rem 0.5rem;
  .title {
    margin: 1rem 0.5rem;
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

const MiniBanner = styled.div`
  height: 40vh;
  width: 100%;
  overflow: hidden;
  img{
    max-height: 100%;
    width: 101%;
  }
`;

export default HomePage;
