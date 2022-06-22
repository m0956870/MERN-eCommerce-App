import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import CartItem from "../components/CartItem";

import { UserContext } from "../App";

const CartPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  // console.log(state);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

    const [alert, setAlert] = useState(false);
    const [alertDiv, setAlertDiv] = useState({
      class: "",
      message: "",
    });

  const getTotolPrice = async () => {
    let total = 0;
    state.cartItems.map((item) => (total += item.price * item.quantity));
    setTotalPrice(total);

        if (total > 20) {
          return setTotalAmount(10);
        }
  };

  const orderFunc = async () => {
    //   console.log(cartItems);
    setTimeout(() => setAlert(false), 3000);

    try {
      if (state.cartItems.length === 0) {
            setAlertDiv({
              class: "error",
              message: "Please add items in cart.",
            });
           return setAlert(true);
      }

      await dispatch({
        type: "LOGIN",
        payload: { ...state, orderItems: state.cartItems },
      });

      navigate("/order");
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getTotolPrice();
  }, [state]);
  useEffect(() => {
    getTotolPrice();
  }, []);

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
      {state && (
        <>
          <CartItems>
            <div className="head">
              <h2>Cart Items</h2>
            </div>
            {state.cartItems.map((item) => (
              <CartItem item={item} />
            ))}
          </CartItems>
          <ItemDetails>
            <div className="head"></div>
            <div className="order-summery">
              <div className="total">
                <div>
                  <div>Total Items:</div>
                  <div>{state && state.cartItems.length}</div>
                </div>

                <div>
                  <div>Item's Total:</div>
                  <div>${totalPrice}</div>
                </div>

                <div>
                  <div>Estimated Tax Charges:</div>
                  <div>0%</div>
                </div>

                <div>
                  <div>Estimated Delivery Charges:</div>
                  <div> ${totalPrice > 20 ? 10 : 0} </div>
                </div>

                <div>
                  <div style={{ color: "#000", fontWeight: "bold" }}>
                    Total Amount:
                  </div>
                  <div style={{ color: "#000", fontWeight: "bold" }}>
                    ${(totalPrice + totalAmount).toFixed(2)}
                  </div>
                </div>
              </div>
              <Button onClick={() => orderFunc()}>Order Now</Button>
            </div>
          </ItemDetails>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 90vh;
  width: 100%;
  display: flex;
`;

const CartItems = styled.div`
  height: 90vh;
  width: 70%;
  border-right: 1px solid lightgrey;
  padding: 0 1rem;
  .head {
    height: 8vh;
    width: 100%;
    display: flex;
    align-items: center;
  }
`;

const ItemDetails = styled.div`
  height: auto;
  width: 30%;
  background: #fafafa;
  padding: 0 1rem;
  .head {
    height: 8vh;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .order-summery {
    width: 100%;
    .total {
      width: 100%;
      div {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: grey;
        margin-bottom: 0.2rem;
      }
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
      background: #grey;
    }
}
`;

export default CartPage;
