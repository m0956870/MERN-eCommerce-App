import React, { useState, useEffect, useContext } from "react";
import { useParams, NavLink } from "react-router-dom";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";

import { UserContext } from "../App";

import AccountDetails from "../components/profile/AccountDetails";
import EditProfile from "../components/profile/EditProfile";
import Security from "../components/profile/Security";

import CartPage from "./CartPage";
import OrderSummery from "./OrderSummery";

// SELLER
import UploadProduct from "../components/seller/UploadProduct";
import MyProducts from "../components/seller/MyProducts";
import EditProduct from "../components/seller/EditProduct";
import SellerOrders from "../components/seller/SellerOrders";

// ADMIN
import AllSellers from "../components/admin/AllSellers";
import AllProducts from "../components/admin/AllProducts";
import AllOrders from "../components/admin/AllOrders";

const Account = () => {
  const { route } = useParams();

  const { state } = useContext(UserContext);
  // console.log(state);

  const [value, setValue] = useState("1");

  const getRoute = () => {
    // console.log(route);
    try {
      if (route === "account-details") {
        setValue("1");
      } else if (route === undefined) {
        setValue("1");
      } else if (route === "edit-details") {
        setValue("2");
      } else if (route === "password-&-security") {
        setValue("3");
        // CUSTOMER
      } else if (route === "cart-items") {
        setValue("11");
      } else if (route === "orders") {
        setValue("12");
        // SELLER
      } else if (route === "upload-product") {
        setValue("21");
      } else if (route === "my-products") {
        setValue("22");
      } else if (route === "order-placed") {
        setValue("23");
      } else if (route === "edit-product") {
        setValue("24");
        // ADMIN
      } else if (route === "all-sellers") {
        setValue("31");
      } else if (route === "all-products") {
        setValue("32");
      } else if (route === "all-orders") {
        setValue("33");
      } else {
        setValue("10");
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getRoute();
  }, [route]);

  //   let verifyUser = async () => {
  //     try {
  //       let { data } = await axios.get("/user/details");
  //       // console.log(data.response);
  //       if (data.status) {
  //         return dispatch({ type: "USER", payload: data.response });
  //       }
  //     } catch (error) {
  //       // console.log(error)
  //       return navigate("/login");
  //     }
  //   };

  // useEffect(() => {
  //   // verifyUser(); //I have varified in navbar component just redirect if needed
  // }, []);

  return (
    <>
      {state && (
        <Container>
          <Left>
            <div className="profile-pic">
              <Avatar alt="Profile Pic" src={state ? state.profilePic : null} />
            </div>

            <div className="acc-links">
              <div className="up-links">
                {state && state.role === "customer" ? (
                  <>
                    <NavLink to="/account/cart-items">Cart Items</NavLink>
                    <NavLink to="/account/orders">My Orders</NavLink>
                  </>
                ) : state.role === "seller" ? (
                  <>
                    <NavLink
                      to="/account/upload-product"
                      onClick={(e) => setValue("21")}
                    >
                      Upload Product
                    </NavLink>
                    <NavLink
                      to="/account/my-products"
                      onClick={(e) => setValue("22")}
                    >
                      My Products
                    </NavLink>
                    <NavLink
                      onClick={(e) => setValue("23")}
                      to="/account/order-placed"
                    >
                      Order Placed
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/account/all-sellers"
                      onClick={(e) => setValue("31")}
                    >
                      All Sellers
                    </NavLink>
                    <NavLink
                      to="/account/all-products"
                      onClick={(e) => setValue("32")}
                    >
                      All Products
                    </NavLink>
                    <NavLink
                      to="/account/all-orders"
                      onClick={(e) => setValue("33")}
                    >
                      All Orders
                    </NavLink>
                  </>
                )}
              </div>

              <div className="down-links">
                {state && state.role === "customer" ? (
                  <>
                    <NavLink to="/account/account-details">
                      Account Details
                    </NavLink>
                    <NavLink
                      to="/account/edit-details"
                      onClick={(e) => setValue("2")}
                    >
                      Edit Details
                    </NavLink>
                    <NavLink
                      to="/account/password-&-security"
                      onClick={(e) => setValue("3")}
                    >
                      Password & Security
                    </NavLink>
                    <NavLink to="/logout">Logout</NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/account/cart-items">Cart Items</NavLink>
                    <NavLink to="/account/orders">My Orders</NavLink>
                    <NavLink to="/account/account-details">
                      Account Details
                    </NavLink>
                    <NavLink
                      to="/account/edit-details"
                      onClick={(e) => setValue("2")}
                    >
                      Edit Details
                    </NavLink>
                    <NavLink
                      to="/account/password-&-security"
                      onClick={(e) => setValue("3")}
                    >
                      Password & Security
                    </NavLink>
                    <NavLink to="/logout">Logout</NavLink>
                  </>
                )}

                {/* <NavLink to="/account/account-details">Account Details</NavLink>
                <NavLink
                  to="/account/edit-details"
                  onClick={(e) => setValue("2")}
                >
                  Edit Details
                </NavLink>
                <NavLink
                  to="/account/password-&-security"
                  onClick={(e) => setValue("3")}
                >
                  Password & Security
                </NavLink>
                <NavLink to="/logout">Logout</NavLink> */}
              </div>
            </div>
          </Left>
          <Right>
            {value === "1" ? <AccountDetails /> : null}
            {value === "2" ? <EditProfile /> : null}
            {value === "3" ? <Security /> : null}

            {value === "11" && <CartPage />}
            {value === "12" && <OrderSummery />}

            {value === "21" && <UploadProduct />}
            {value === "22" && <MyProducts />}
            {value === "23" && <SellerOrders />}
            {value === "24" && <EditProduct />}

            {value === "31" && <AllSellers />}
            {value === "32" && <AllProducts />}
            {value === "33" && <AllOrders />}

            {value === "10" && (
              <h4 style={{ textAlign: "center", margin: "2rem auto" }}>
                Page not found
              </h4>
            )}
          </Right>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  height: 90vh;
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: start;
`;
const Left = styled.div`
  ${"" /* background: #3151b5; */}
  height: 100%;
  width: 19%;
  border-right: 1px solid grey;

  .profile-pic {
    width: 100%;
    height: 20%;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .MuiAvatar-root {
      width: 100%;
      height: 100%;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .acc-links {
    height: 80%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    .up-links {
      height: 50%;
      width: 100%;
      display: flex;
      flex-direction: column;

      a {
        width: 100%;
        border: none;
        text-decoration: none;
        border-bottom: 0.5px solid #fff;
        color: grey;
        padding: 0.5rem 0.5rem 0.5rem 1rem;
        text-align: left;
        transition: all 0.1s ease-in-out;
        &:hover {
          color: #000;
        }
      }
    }
    .down-links {
      height: 50%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: end;
      align-items: end;

      a {
        width: 100%;
        border: none;
        text-decoration: none;
        color: grey;
        padding: 0.5rem 0.5rem 0.5rem 1rem;
        text-align: left;
        ${"" /* background: #3151b5; */}
        transition: all 0.1s ease-in-out;
        &:hover {
          ${"" /* background: #2c387e; */}
          color: #000;
        }
      }
    }
  }
`;

const Right = styled.div`
  height: 100%;
  width: 83%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  overflow-x: hidden;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default Account;
