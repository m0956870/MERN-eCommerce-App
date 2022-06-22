import React, { useState, useEffect, useContext } from "react";
import { useParams, NavLink } from "react-router-dom";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
} from "@material-ui/core";

import styled from "styled-components";
import axios from "axios";

import { Avatar } from "@material-ui/core";

import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline, IoIosCall } from "react-icons/io";
import { MdLocationOn, MdEmail } from "react-icons/md";

import Product from "../../components/Product";

import { UserContext } from "../../App";

const SellerProfile = () => {
  let params = useParams();
  //   console.log(params._id);

  const { state } = useContext(UserContext);
  // console.log(state);

  const [seller, setSeller] = useState([]);
  const [myProducts, setMyProducts] = useState([]);

  const [alert, setAlert] = useState(false);
  const [alertDiv, setAlertDiv] = useState({
    class: "",
    message: "",
  });

  let fetchProfile = async () => {
    try {
      let { data } = await axios.get(`/user/find/${params._id}`);
      //   console.log(data.response)
      if (data.status) {
        setSeller(data.response[0]);
      }
    } catch (error) {
     // console.log(error);
    }
  };

  const fetchMyProducts = async () => {
    try {
      let { data } = await axios.get(`/product/allproducts/${params._id}`);
      //   console.log(data.response);

      if (data.status) {
        setMyProducts(data.response);
        setFilteredProducts(data.response);

        data.response.map((item) => {
          if (!subCategoryList.includes(item.subCategory)) {
            subCategoryList.push(item.subCategory);
          }
          // console.log(subCategoryList);
        });
      }
      setSubCategory(subCategoryList);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // console.log(seller);
  // console.log(myProducts);

  // FILTERS
  const [usedFilter, setUsedFilter] = useState(false);

  const [subCategory, setSubCategory] = useState(null);
  let subCategoryList = [];

  const [filteredProducts, setFilteredProducts] = useState(null);

  const [sortByValue, setSortByValue] = useState("");

  const [dualRangeValue, setDualRangeValue] = React.useState([10, 50]);

  // console.log(filteredProducts);

  const checkboxAllFunc = () => {
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach((el) => (el.checked = false));
    // setSubCategory([]) // second option but rerender subCategory

    fetchMyProducts();
    setUsedFilter(false);
  };

  const checkboxFunc = (e) => {
    // console.log(e.target.value);
    // console.log(e.target.checked);

    if (!usedFilter) {
      setFilteredProducts([]);
    }

    setUsedFilter(true);

    if (e.target.checked) {
      let newList = myProducts.map((item) => {
        if (item.subCategory === e.target.value) {
          // console.log(item)
          setFilteredProducts((filteredProducts) => [
            ...filteredProducts,
            item,
          ]);
        }
      });
      // console.log(newList);
    } else {
      let newList = filteredProducts.filter(
        (item) => item.subCategory !== e.target.value
      );
      // console.log(newList);
      setFilteredProducts(newList);
    }
  };

  const sortByHandleInput = async (e) => {
    // console.log(e.target.value);
    setSortByValue(e.target.value);

    if (e.target.value === 10) {
      // console.log("ten");

      try {
        let { data } = await axios.get(`/product/allproducts/${params._id}`);
        // console.log(data.response)
        if (data.status) {
          setMyProducts(data.response);
          setFilteredProducts(data.response);
        }
      } catch (error) {
        // console.log(error);
      }
    } else if (e.target.value === 20) {
      // console.log("twenty");

      try {
        let { data } = await axios.get(
          `/product/allproducts/newest/${params._id}`
        );
        // console.log(data.response)
        if (data.status) {
          setMyProducts(data.response);
          setFilteredProducts(data.response);
        }
      } catch (error) {
        // console.log(error);
      }
    } else if (e.target.value === 50) {
      // console.log("fifty");

      let lowToHigh = myProducts.sort((a, b) => a.price - b.price);
      // console.log(lowToHigh)

      setMyProducts(lowToHigh);
      setFilteredProducts(lowToHigh);
    } else if (e.target.value === 60) {
      // console.log("sixty");

      let highToLow = myProducts.sort((a, b) => b.price - a.price);
      // console.log(highToLow)

      setMyProducts(highToLow);
      setFilteredProducts(highToLow);
    } else {
      // console.log(e.target.value);
    }
  };

  const handleChangeDual = (event, newValue) => {
    setDualRangeValue(newValue);
    // console.log(newValue);
    // console.log(newValue[0])
    // console.log(newValue[1])

    if (myProducts) {
      let newList = myProducts.filter(
        (item) => item.price > newValue[0] && item.price < newValue[1]
      );
      // console.log(newList);
      setFilteredProducts(newList);
    }
  };

  const dualHandle0 = (e) => {
    // console.log(e.target.value);
    setDualRangeValue([e.target.value, dualRangeValue[1]]);

    if (myProducts) {
      let newList = myProducts.filter(
        (item) => item.price > e.target.value && item.price < dualRangeValue[1]
      );
      // console.log(newList);
      setFilteredProducts(newList);
    }
  };

  const dualHandle1 = (e) => {
    // console.log(e.target.value);
    setDualRangeValue([dualRangeValue[0], e.target.value]);

    if (myProducts) {
      let newList = myProducts.filter(
        (item) => item.price > dualRangeValue[0] && item.price < e.target.value
      );
      // console.log(newList);
      setFilteredProducts(newList);
    }
  };

  return (
    <Container>
      {alert && (
        <div id="alert">
          <div className={alertDiv.class}>
            {alertDiv.class === "success" ? (
              <IoMdCheckmarkCircleOutline
                style={{ marginRight: "0.5rem", fontSize: "1.5rem" }}
              />
            ) : (
              <BiErrorCircle
                style={{ marginRight: "0.5rem", fontSize: "1.5rem" }}
              />
            )}
            {alertDiv.message}
          </div>
        </div>
      )}

      {!seller && "No data available"}
      {seller && (
        <>
          <Profile>
            <div className="cover-image">
              <img
                src="https://static.vecteezy.com/system/resources/previews/003/805/189/original/paper-art-online-shopping-on-smart-phone-buy-sell-on-mobile-technology-marketing-illustration-for-cover-page-design-on-website-free-vector.jpg"
                alt="cover"
              />
            </div>
            <div className="profile">
              <div className="profile-pic">
                <Avatar alt="Profile Pic" src={seller.profilePic} />
              </div>
              <div className="details">
                <p className="name">{seller.name}</p>
                <p className="email">
                  <MdEmail /> {seller.email}
                </p>
                <p className="address">
                  <MdLocationOn />
                  {!seller.address && "Not avalilabe"}
                  {seller.address && seller.address.address}
                  {seller.address && ", "}
                  {seller.address && seller.address.city}
                  {seller.address && ", "}
                  {seller.address && seller.address.state}
                  <br />
                  {seller.address && seller.address.country}
                  {seller.address && ", "}
                  {seller.address && seller.address.zip}
                </p>
                <p className="phone">
                  <IoIosCall />
                  {seller.phone ? seller.phone : "Not Available"}
                </p>
              </div>
              <div className="contact">
                <div className="icons">
                  <div className="icon">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0tbWDOV1GMSZDtBFEiAKjxTWpbJicWWZTzA&usqp=CAU"
                      alt="fb"
                    />
                  </div>
                  <div className="icon">
                    <img
                      src="https://prod-cdn-03.storenvy.com/product_photos/94711105/file_fec9f9cd7d_original.png"
                      alt="insta"
                    />
                  </div>
                  <div className="icon">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMUZpSqWDzo2aBAFN3lDM1FCsQyY302dBkcg&usqp=CAU"
                      alt="twitter"
                    />
                  </div>
                  <div className="icon">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/124/124034.png"
                      alt="whatsapp"
                    />
                  </div>
                </div>
                <div className="button">
                  <Button>Contact Me</Button>
                </div>
              </div>
            </div>
          </Profile>

          <Products>
            <div className="left">
              <SubCategory>
                <div className="all" onClick={() => checkboxAllFunc()}>
                  All Products
                </div>

                {subCategory &&
                  subCategory.map((item) => (
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="catgory"
                        value={item}
                        onClick={(e) => checkboxFunc(e)}
                        // checked={checked}
                      />
                      <span className="sub-category"> {item}</span>
                    </div>
                  ))}
              </SubCategory>

              <SortBy>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Sort By:
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sortByValue}
                    label="Age"
                    onChange={sortByHandleInput}
                  >
                    <MenuItem value={10}>Oldest Arrivals</MenuItem>
                    <MenuItem value={20}>Newest Arrivals</MenuItem>
                    <MenuItem value={50}>Price: Low to High</MenuItem>
                    <MenuItem value={60}>Price: High to Low</MenuItem>
                  </Select>
                </FormControl>
              </SortBy>

              <DualRange>
                <h3>Price</h3>
                <Slider
                  getAriaLabel={() => "Price range"}
                  value={dualRangeValue}
                  onChange={handleChangeDual}
                  valueLabelDisplay="auto"
                  // getAriaValueText={valuetext}
                  style={{ color: "#000" }}
                />
                <div className="input">
                  <input
                    className="number-input"
                    type="number"
                    min="0"
                    max="100"
                    value={dualRangeValue[0]}
                    onChange={dualHandle0}
                  />
                  <div style={{ color: "lightgrey" }}> - </div>
                  <input
                    className="number-input"
                    type="number"
                    min="0"
                    max="100"
                    value={dualRangeValue[1]}
                    onChange={dualHandle1}
                  />
                </div>
              </DualRange>
            </div>

            <div className="right">
              <h2>All Products</h2>
              <div className="products">
                {filteredProducts &&
                  filteredProducts.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
              </div>
            </div>
          </Products>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  background: #f1f1f1;
`;

const Profile = styled.div`
  height: 35vh;
  width: 100%;
  background: #fff;
  border: 1px solid lightgrey;
  margin-bottom: 1rem;
  .cover-image {
    height: 55%;
    width: 100%;
    overflow: hidden;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    img {
      height: 155%;
      width: 100%;
    }
  }
  .profile {
    height: 45%;
    width: 100%;
    display: flex;
    .profile-pic {
      height: 100;
      width: 12%;
      position: relative;
      .MuiAvatar-root {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(0%, -50%);
        height: auto;
        min-width: 70%;
        border: 4px solid #fff;
      }
    }
    .details {
      height: 100;
      width: 63%;
      position: relative;
      p {
        margin: 0.2rem 0.5rem;
        font-size: 0.9rem;
        color: grey;
        svg {
          margin-right: 0.1rem;
        }
      }
      .name {
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(0%, -120%);
        background: #fff;
        color: #000;
        font-size: 1rem;
        font-weight: 600;
        padding: 0.3rem 0.5rem;
        border-radius: 0.3rem;
      }
    }
    .contact {
      height: 100%;
      width: 25%;
      position: relative;
      .icons {
        width: 100%;
        display: flex;
        justify-content: end;
        gap: 0.2rem;
        margin-right: 0.5rem;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(0%, -120%);
        .icon {
          height: 2rem;
          width: 2rem;
          background: orange;
          border-radius: 50%;
          img {
            height: 100%;
            width: 100%;
            border-radius: 50%;
          }
        }
      }
      .button {
        width: 60%;
        margin-right: 0.5rem;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
`;

const SubCategory = styled.div`
  width: 100%;
  height: auto;
  ${"" /* border: 1px solid grey; */}

  .all {
    font-size: 1.4rem;
    font-weight: bold;
    margin: 0 0 0.2rem 0;
    background: #000;
    color: #fff;
    padding: 0.2rem 0.3rem;
    cursor: pointer;
  }
  .checkbox .sub-category {
    font-size: 1rem;
    color: grey;
  }
`;

const SortBy = styled.div`
  width: 100%;
  margin: 1.5rem 0;
  .select {
    width: 100%;
  }
`;

const DualRange = styled.div`
  width: 100%;
  margin: 1rem 0;
  ${"" /* border: 1px solid red; */}
  .input {
    max-width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .number-input {
      height: 2rem;
      padding: 0 0.5rem;
      background: #f1f1f1;
      border: none;
    }
  }
`;

const Products = styled.div`
  width: 100%;
  background: #fff;
  border: 1px solid lightgrey;
  display: flex;
  .left {
    height: 100%;
    width: 25%;
    border-right: 1px solid lightgrey;
    padding: 1rem;
  }
  .right {
    height: 100%;
    width: 75%;
    h2 {
      margin: 1rem 0;
    }
    .products {
      width: 100%;
      display: flex;
      justify-content: start;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      padding-bottom: 1rem;
    }
  }
`;

const Button = styled.button`
    width: 100%;
    background: #000;
    color: #fff;
    font-size: 1rem;
    padding: 0.5rem;
    margin: 0.3rem 0; 
    border: none;
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover{
      background: #000000ad;
    }
}
`;

export default SellerProfile;
