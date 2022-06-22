import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import { UserContext } from "../App";

const CartItem = ({ item }) => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  // console.log(state);

  const [cartItems, setCartItems] = useState(state.cartItems);
  const [quantity, setQuantity] = useState(1);

  const minusQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      let newCartItems = cartItems.map((product) => {
        if (item._id === product._id) {
          product.quantity = quantity - 1;
          return product;
        }
        return product;
      });
      //   console.log(newCartItems);

      dispatch({
        type: "USER",
        payload: { ...state, cartItems: newCartItems },
      });
    }
  };

  const plusQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
      let newCartItems = cartItems.map((product) => {
        if (item._id === product._id) {
          product.quantity = quantity + 1;
          return product;
        }
        return product;
      });
      //   console.log(newCartItems);

      dispatch({
        type: "USER",
        payload: { ...state, cartItems: newCartItems },
      });
    }
  };

  const removefromCartFunc = async (product) => {
    // console.log(product);

    if (state) {
      let { data } = await axios.put(`/user/update/updatecart`, product);
      // console.log(data.response);

      if (data.status) {
        await dispatch({ type: "USER", payload: data.response });
        // navigate("/cart");
      }
    } else {
      window.alert("Please Login First");
    }
  };

  const oneOrderFunc = async (item) => {
    // console.log("oneOrderFunc");
    // console.log(item);

    try {
      await dispatch({
        type: "USER",
        payload: { ...state, orderItems: [item] },
      });

      navigate("/order");
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    let product = state.cartItems.find((product) => item._id === product._id);
    // console.log(product);
    setQuantity(product.quantity);
  }, []);

  // console.log(cartItems);

  return (
    <Container>
      <div className="image">
        <img src={item.image} alt="pic" />
      </div>

      <div className="details">
        <h4> {item.title} </h4>
        <p className="desc"> {item.description} </p>
        <p className="price">Price: ${item.price} </p>
        <div>
          <button
            className="detail-btn"
            onClick={() => removefromCartFunc(item)}
            style={{ background: "red" }}
          >
            Remove from Cart
          </button>
        </div>
        <div>
          <button className="detail-btn" onClick={() => oneOrderFunc(item)}>
            Order
          </button>
        </div>
      </div>

      <div className="quantity">
        <button onClick={() => minusQuantity()}>-</button>

        <input
          type="text"
          value={quantity}
          // onChange={(e) => setQuantity(e.target.value)}
          name="quantity"
          min="1"
          max="10"
        />
        <button onClick={() => plusQuantity()}>+</button>
      </div>

      <div className="total">
        <p className="price"> Total: ${item.price * quantity} </p>
      </div>
    </Container>
  );
};

const Container = styled.div`
  ${"" /* height: 10rem; */}
  width: 100%;
  ${"" /* background: grey; */}
  border: 1px solid lightgrey;
  margin-bottom: 1rem;
  display: flex;
  padding: 0.5rem;
  border-radius: 0.5rem;
  .image {
    ${"" /* height: 100%; */}
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 10rem;
      width: 100%;
    }
  }
  .details {
    height: 100%;
    width: 35%;
    padding: 0 0.5rem;
    .desc {
      color: grey;
      font-size: 0.8rem;
    }
    .price {
      font-weight: bold;
      font-size: 0.9rem;
      margin: 0.2rem 0;
    }
    .detail-btn {
      width: 60%;
      background: #000;
      color: #fff;
      font-size: 0.8rem;
      padding: 0.5rem;
      border: none;
      border-radius: 0.25rem;
      transition: all 0.1s ease-in-out;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 0.2rem;
      &:hover {
        background: #080808b3;
      }
    }
  }
  .quantity {
    height: 100%;
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: start;
    button {
      width: 2rem;
      height: 2rem;
      font-size: 1rem;
      font-weight: bold;
      border: none;
    }
    input {
      width: 2rem;
      height: 2rem;
      font-size: 1rem;
      text-align: center;
      outline: grey;
    }
  }
  .total {
    height: 100%;
    width: 20%;
    display: flex;
    justify-content: end;
    align-items: start;
    .price {
      font-weight: bold;
      font-size: 1rem;
    }
  }
`;

export default CartItem;
