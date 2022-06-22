import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { BsCart4 } from "react-icons/bs";

import { UserContext } from "../App";

const Product = ({ product }) => {
  // console.log(product)

  const { state, dispatch } = useContext(UserContext);
  // console.log(state);

  const [quantity, setQuantity] = useState(1);

  const [alert, setAlert] = useState(false);
  const [alertDiv, setAlertDiv] = useState({
    class: "",
    message: "",
  });

  let cartItemIDs = [];
  if (state) {
    state.cartItems.map((item) => {
      cartItemIDs.push(item._id);
    });
    //   console.log(cartItemIDs);
  }

  const addToCartFunc = async (product) => {
    // console.log(product);
    setTimeout(() => setAlert(false), 3000);

    if (state) {
      let { data } = await axios.put(`/user/update/addtocart`, product);
      // console.log(data.response);

      if (data.status) {
        await dispatch({ type: "USER", payload: data.response });
        // navigate("/cart");
        setAlertDiv({
          class: "success",
          message: "Item added to cart.",
        });
        setAlert(true);
      }
    } else {
      setAlertDiv({
        class: "error",
        message: "Error: Please login first.",
      });
      setAlert(true);
    }
  };

  const removefromCartFunc = async (product) => {
    // console.log(product);
    setTimeout(() => setAlert(false), 3000);

    if (state) {
      let { data } = await axios.put(`/user/update/updatecart`, product);
      // console.log(data.response);

      if (data.status) {
        await dispatch({ type: "USER", payload: data.response });
        setAlertDiv({
          class: "success",
          message: "Item removed from cart.",
        });
        setAlert(true);
      }
    } else {
      setAlertDiv({
        class: "error",
        message: "Error: Please login first.",
      });
      setAlert(true);
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

      <NavLink
        to={`/product/${product._id}`}
        style={{ textDecoration: "none", color: "#000" }}
      >
        <div className="image">
          <img src={product.image} alt="pic" />
        </div>
        <div className="details">
          <div> {product.title} </div>
          <div style={{ fontWeight: "bold" }}>$ {product.price}</div>
        </div>
      </NavLink>
      <div className="actions">
        {!cartItemIDs.includes(product._id) ? (
          <Button onClick={() => addToCartFunc(product)}>
            Add to Cart
            <BsCart4 size={20} style={{ marginLeft: "0.5rem" }} />
          </Button>
        ) : (
          <Button onClick={() => removefromCartFunc(product)}>
            Remove to Cart
            <BsCart4 size={20} style={{ marginLeft: "0.5rem" }} />
          </Button>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 18rem;
  width: 30%;
  border: 1px solid lightgrey;
  padding: 0.5rem;
  .image {
    height: 65%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: right;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .details {
    width: 100%;
    height: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .actions {
    width: 100%;
    height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Button = styled.button`
    width: 100%;
    background: #000;
    color: #fff;
    font-size: 1rem;
    padding: 0.5rem;
    border: none;
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover{
      background: grey;
    }
}
`;

export default Product;
