import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { UserContext } from "../App";

// PAYMENTS
import StripeCheckout from "react-stripe-checkout";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import GooglePayButton from "@google-pay/button-react";

// Stripe
const publicKey = process.env.REACT_APP_STRIPE;

// Paypal
const clientID = process.env.REACT_APP_PAYAPL;

const OrderPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  // console.log(state);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [onlinePayment, setOnlinePayment] = useState("");
  const [COD, setCOD] = useState(true);

  const [accDetails, setAccDetails] = useState({
    name: (state.name && state.name) || "",
    lastName: (state.lastName && state.lastName) || "",
    email: (state.email && state.email) || "",
    phone: (state.phone && state.phone) || "",

    address: (state.address && state.address.address) || "",
    city: (state.address && state.address.city) || "",
    state: (state.address && state.address.state) || "",
    zip: (state.address && state.address.zip) || "",
    country: (state.address && state.address.country) || "",
  });

  const handleInput = (e) => {
    setAccDetails({ ...accDetails, [e.target.name]: e.target.value });
  };

  const [alert, setAlert] = useState(false);
  const [alertDiv, setAlertDiv] = useState({
    class: "",
    message: "",
  });

  const [error, setError] = useState({
    phone: {
      status: false,
      text: "",
    },
    address: {
      status: false,
      text: "",
    },
    city: {
      status: false,
      text: "",
    },
    state: {
      status: false,
      text: "",
    },
    zip: {
      status: false,
      text: "",
    },
    country: {
      status: false,
      text: "",
    },
  });

  const getTotolPrice = async () => {
    let total = 0;
    if (state) {
      state.orderItems.map((item) => (total += item.price * item.quantity));
      setTotalPrice(total);

      if (total > 20) {
        return setTotalAmount(total + 10);
      } else {
        setTotalAmount(total);
      }
    }
  };

  const orderFunc = async () => {
    // console.log(state.orderItems);
    setTimeout(() => setAlert(false), 3000);
    setTimeout(
      () =>
        setError({
          ...error,
          status: false,
        }),
      3000
    );

    if (accDetails.phone.length < 10) {
      if (accDetails.phone == "") {
        return setError({
          ...error,
          phone: {
            status: true,
            text: "Please provide phone number!",
          },
        });
      }
      return setError({
        ...error,
        phone: {
          status: true,
          text: "Phone Number should be 10 digits!",
        },
      });
    }

    if (accDetails.address == "") {
      return setError({
        ...error,
        address: {
          status: true,
          text: "Please provide address!",
        },
      });
    }

    if (accDetails.city == "") {
      return setError({
        ...error,
        city: {
          status: true,
          text: "Please provide city!",
        },
      });
    }

    if (accDetails.state == "") {
      return setError({
        ...error,
        state: {
          status: true,
          text: "Please provide state!",
        },
      });
    }

    if (accDetails.zip < 6) {
      if (accDetails.zip == "") {
        return setError({
          ...error,
          zip: {
            status: true,
            text: "Please provide zip code!",
          },
        });
      }
      return setError({
        ...error,
        zip: {
          status: true,
          text: "Please provide valid zip code!",
        },
      });
    }

    if (accDetails.country == "") {
      return setError({
        ...error,
        country: {
          status: true,
          text: "Please provide valid country!",
        },
      });
    }

    let orderItem = {
      items: state.orderItems,
      customerID: state._id,
      customerDetails: accDetails,
      total: totalAmount.toFixed(2),
      paymentType: `${COD ? "COD" : "Paid"}`,
      date: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    // console.log(orderItem);
    
    try {
      let { data } = await axios.post("/order/place", orderItem);
      // console.log(data);

      if (data.status) {
        setAlertDiv({
          class: "success",
          message: data.response,
        });
        setAlert(true);
      }

      // console.log(state.orderItems.length);
      state.orderItems.map(async (item) => {
        // console.log(item);

        let { data } = await axios.put(`/user/update/updatecart`, item);
        // console.log(data.response);

        dispatch({ type: "USER", payload: data.response });
      });

      navigate("/order-summery");
    } catch (error) {
      // console.log(error);
      setAlertDiv({
        class: "error",
        message: error.response.data.response,
      });
      setAlert(true);
    }
  };

  const onlinePaymentFunc = async () => {
       // console.log(state.orderItems);
    setTimeout(() => setAlert(false), 3000);
    setTimeout(
      () =>
        setError({
          ...error,
          status: false,
        }),
      3000
    );

   let orderItem = {
     items: state.orderItems,
     customerID: state._id,
     customerDetails: accDetails,
     total: totalAmount.toFixed(2),
     paymentType:  "Paid" ,
     date: new Date().toLocaleDateString("en-IN", {
       year: "numeric",
       month: "long",
       day: "2-digit",
       hour: "2-digit",
       minute: "2-digit",
     }),
   };
  //  console.log(orderItem);

   try {
     let { data } = await axios.post("/order/place", orderItem);
    //  console.log(data);

     if (data.status) {
       setAlertDiv({
         class: "success",
         message: data.response,
       });
       setAlert(true);
     }

    //  console.log(state.orderItems.length);
     state.orderItems.map(async (item) => {
      //  console.log(item);

       let { data } = await axios.put(`/user/update/updatecart`, item);
      //  console.log(data.response);

       dispatch({ type: "USER", payload: data.response });
     });

     navigate("/order-summery");
   } catch (error) {
    //  console.log(error);
     setAlertDiv({
       class: "error",
       message: error.response.data.response,
     });
     setAlert(true);
   }

  }

  // STRIPE
  const handlePaymentInput = (e) => {
    // console.log(e.target.value)
    setOnlinePayment(e.target.value);
    setCOD(false);
  };

  const handleClick = async (token) => {
    // console.log(token);

    try {
      let { data } = await axios.post("/user/payment", token);
      // console.log(data);
      // console.log(data.status);

      if (data.status === "succeeded") {
        console.log("succeeded");

        onlinePaymentFunc();
      } else {
        console.log("Payment failed! Try again later");
      }
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

  // console.log(COD);

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
          <Checkout>
            <div className="head">
              <h2>Online Payment Method</h2>
            </div>

            <div className="payment-methods">
              <div className="online-payment" onChange={handlePaymentInput}>
                <div>
                  <input type="radio" name="payment" value="card" />
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHWOkdP54f9JsN5N39P_b6Olxc9fX249uUDM0JQkQNJoMfCqtU9LSdIb7BWDniFK9o7A&usqp=CAU"
                    alt="card"
                  />
                </div>
                <div>
                  <input type="radio" name="payment" value="paypal" />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png"
                    alt="paypal"
                  />
                </div>
                <div>
                  <input type="radio" name="payment" value="gpay" />
                  <img
                    style={{ height: "60%", width: "40%" }}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxypYHbwQQ-dIMMmQkXri_udlUtCgpoOVuckzns9wcTvoc4aOjXCkC0LRHAno2P9jofXc&usqp=CAU"
                    alt="gpay"
                  />
                </div>
              </div>
              <div className="online-method">
                {onlinePayment === "card" ? (
                  <div className="method">
                    <StripeCheckout
                      style={{ width: "30%" }}
                      token={handleClick}
                      stripeKey={publicKey}
                      name="eCommerce App" // the pop-in header title
                      description="Pay with card" // the pop-in header subtitle
                      panelLabel="Pay" // prepended to the amount in the bottom pay button
                      amount={totalPrice * 100} // paisa or cents
                      currency="USD"
                      // zipCode={false}
                      shippingAddress
                      billingAddress
                    />
                  </div>
                ) : onlinePayment === "paypal" ? (
                  <div className="method">
                    <PayPalScriptProvider options={{ "client-id": clientID }}>
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          //  console.log(data);
                          //  console.log(actions);
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: `${totalPrice}.00`,
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order.capture().then((details) => {
                            const name = details.payer.name.given_name;
                            // alert(`Transaction completed by ${name}`);
                            // console.log("Complete payment " + name);
                            // console.log(data); // transaction data
                            // console.log(actions);
                            // console.log(details); // payer informations
                            // console.log(details.status); // status

                            if (details.status === "COMPLETED") {
                              // console.log(details); // payer informations
                              onlinePaymentFunc();
                            } else {
                              window.alert("Payment failed!");
                              // console.log("Payment failed!");
                            }
                          });
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                ) : onlinePayment === "gpay" ? (
                  <div className="method">
                    <GooglePayButton
                      environment="TEST"
                      paymentRequest={{
                        apiVersion: 2,
                        apiVersionMinor: 0,
                        allowedPaymentMethods: [
                          {
                            type: "CARD",
                            parameters: {
                              allowedAuthMethods: [
                                "PAN_ONLY",
                                "CRYPTOGRAM_3DS",
                              ],
                              allowedCardNetworks: ["MASTERCARD", "VISA"],
                            },
                            tokenizationSpecification: {
                              type: "PAYMENT_GATEWAY",
                              parameters: {
                                gateway: "example",
                                gatewayMerchantId: "exampleGatewayMerchantId",
                              },
                            },
                          },
                        ],
                        merchantInfo: {
                          merchantId: "12345678901234567890",
                          merchantName: "Demo Merchant",
                        },
                        transactionInfo: {
                          totalPriceStatus: "FINAL",
                          totalPriceLabel: "Total",
                          totalPrice: "100.00",
                          currencyCode: "USD",
                          countryCode: "US",
                        },
                      }}
                      onLoadPaymentData={(paymentRequest) => {
                        // console.log("load payment data", paymentRequest);
                      }}
                      // onPaymentDataChanged={(paymentRequest) => {
                      //   console.log("payment data changed", paymentRequest);
                      // }}
                      // onPaymentAuthorized={(paymentRequest) => {
                      //   console.log("payment data authorized", paymentRequest)
                      //   {return onlinePaymentFunc();}
                      // }}
                    />
                  </div>
                ) : null}
              </div>

              <LineThrough>
                <div className="text">or</div>
              </LineThrough>

              <CODDiv>
                <h2 style={{ marginBottom: "1rem" }}>Cash On Delivery</h2>
                <div className="form">
                  <div style={{ display: "flex" }}>
                    <p className="label half">First Name</p>
                    <p className="label half">Last Name</p>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      className="detail half"
                      name="name"
                      value={accDetails.name}
                      onChange={handleInput}
                      autoComplete="off"
                    />
                    <input
                      type="text"
                      className="detail half"
                      name="lastName"
                      value={accDetails.lastName}
                      onChange={handleInput}
                      placeholder="Optional"
                      autoComplete="off"
                    />
                  </div>

                  <p className="label">Email</p>
                  <input
                    className="detail"
                    type="text"
                    name="email"
                    value={accDetails.email}
                    onChange={handleInput}
                    placeholder="Optional"
                    autoComplete="off"
                  />
                  <p className="label">Phone</p>
                  <input
                    className="detail"
                    type="number"
                    name="phone"
                    value={accDetails.phone}
                    onChange={handleInput}
                    autoComplete="off"
                  />
                  {error.phone.status && (
                    <>
                      <BiErrorCircle style={{ color: "red" }} />{" "}
                      <span style={{ color: "red" }}>{error.phone.text}</span>
                    </>
                  )}

                  <h2 style={{ margin: "2rem 0 1rem 0" }}>
                    Shipping Address Details
                  </h2>

                  <p className="label">Address</p>
                  <textarea
                    style={{
                      minHeight: "4rem",
                      maxHeight: "4rem",
                      minWidth: "100%",
                      maxWidth: "100%",
                    }}
                    className="detail"
                    type="text"
                    name="address"
                    value={accDetails.address}
                    onChange={handleInput}
                    autoComplete="off"
                  />
                  {error.address.status && (
                    <>
                      <BiErrorCircle style={{ color: "red" }} />{" "}
                      <span style={{ color: "red" }}>{error.address.text}</span>
                    </>
                  )}

                  <div style={{ display: "flex" }}>
                    <p className="label half">City</p>
                    <p className="label half">State</p>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      className="detail half"
                      type="text"
                      name="city"
                      value={accDetails.city}
                      onChange={handleInput}
                      autoComplete="off"
                    />

                    <input
                      className="detail half"
                      type="text"
                      name="state"
                      value={accDetails.state}
                      onChange={handleInput}
                      autoComplete="off"
                    />
                  </div>

                  {error.city.status && (
                    <>
                      <BiErrorCircle style={{ color: "red" }} />{" "}
                      <span style={{ color: "red" }}>{error.city.text}</span>
                    </>
                  )}
                  {error.state.status && (
                    <>
                      <BiErrorCircle style={{ color: "red" }} />{" "}
                      <span style={{ color: "red" }}>{error.state.text}</span>
                    </>
                  )}

                  <div style={{ display: "flex" }}>
                    <p className="label half">ZIP</p>
                    <p className="label half">Country</p>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      className="detail half"
                      type="number"
                      name="zip"
                      value={accDetails.zip}
                      onChange={handleInput}
                      autoComplete="off"
                    />
                    <input
                      className="detail half"
                      type="text"
                      name="country"
                      value={accDetails.country}
                      onChange={handleInput}
                      autoComplete="off"
                    />
                  </div>
                  {error.zip.status && (
                    <>
                      <BiErrorCircle style={{ color: "red" }} />{" "}
                      <span style={{ color: "red" }}>{error.zip.text}</span>
                    </>
                  )}
                  {error.country.status && (
                    <>
                      <BiErrorCircle style={{ color: "red" }} />{" "}
                      <span style={{ color: "red" }}>{error.country.text}</span>
                    </>
                  )}
                  <Button
                    onClick={() => orderFunc()}
                    style={{ margin: "1rem 0" }}
                  >
                    Order Now
                  </Button>
                </div>
              </CODDiv>
            </div>
          </Checkout>

          <Summary>
            <div className="head">
              <h2>Order Summary</h2>
            </div>
            <div className="order-summery">
              {state.orderItems &&
                state.orderItems.map((item) => (
                  <div className="order-item">
                    <div className="image">
                      <img src={item.image} alt="pic" />
                    </div>

                    <div className="detail">
                      <div className="up">
                        <div className="title">{item.title}</div>
                        <div className="desc">{item.description}</div>
                      </div>
                      <div className="down">
                        <div className="quantity">
                          Quantity: {item.quantity}
                        </div>
                        <div className="price">Price: ${item.price}</div>
                      </div>
                    </div>
                  </div>
                ))}

              <div className="total">
                <div>
                  <div>Total Items:</div>
                  <div>{state.orderItems && state.orderItems.length}</div>
                </div>

                <div>
                  <div>Item Total:</div>
                  <div>{totalPrice}</div>
                </div>

                <div>
                  <div>Tax Charges:</div>
                  <div>0%</div>
                </div>

                <div
                  style={{
                    borderBottom: "1px solid grey",
                    paddingBottom: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div>Delivery Charges:</div>
                  <div> {totalPrice > 20 ? 10 : 0} </div>
                </div>

                <div
                  style={{
                    borderBottom: "1px solid grey",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <div style={{ color: "#000", fontWeight: "bold" }}>
                    Total Amount:
                  </div>
                  <div style={{ color: "#000", fontWeight: "bold" }}>
                    {totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* <button onClick={() => orderFunc()}>Order Now</button> */}
            </div>
          </Summary>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
height: auto;
`;

const Checkout = styled.div`
height: auto;
  width: 70%;
  border-right: 1px solid lightgrey;
  padding: 0 1rem;
  .head {
    height: 10%;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .payment-methods {
    width: 100%;
    .online-payment {
      width: 100%;
      ${"" /* background: yellow; */}
      display: flex;
      div {
        width: 33.3%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid grey;
        img {
          width: 50%;
          height: 50%;
          margin-left: 0.5rem;
        }
      }
    }
    .online-method {
      width: 100%;
      .method {
        padding-top: 1rem;
      }
    }
    .cod {
      width: 100%;
      .form {
        width: 100%;
        margin: 1rem 0;
        font-size: 0.8rem;
        .label {
          color: grey;
          padding: 0.3rem 0.2rem 0.2rem 0;
        }
        .half {
          width: 50%;
        }
        .detail {
          width: 100%;
          min-height: 25px;
          border: 1px solid lightgrey;
          padding: 0.3rem;
          margin: 0 0.2rem 0.2rem 0;
          border-radius: 0.3rem;
        }
      }
    }
  }
`;

const Summary = styled.div`
  width: 30%;
  padding: 0 1rem;
  .head {
    height: 10%;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .order-summery {
    width: 100%;
    .order-item {
      height: 6rem;
      width: 100%;
      ${"" /* margin-bottom: 0.5rem; */}
      border: 1px solid #dedede;
      display: flex;
      .image {
        height: 100%;
        width: 30%;
        padding: 0.3rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .detail {
        height: 100%;
        width: 70%;
        padding: 0.3rem 0.4rem 0.3rem 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;
        .up {
          ${"" /* background: orange; */}
          width: 100%;

          .title {
            font-weight: bold;
            font-size: 12px;
          }
          .desc {
            font-size: 10px;
            color: grey;
          }
        }
        .down {
          ${"" /* background: blue; */}
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .quantity {
            font-size: 12px;
            color: grey;
          }
          .price {
            font-weight: bold;
            font-size: 14px;
          }
        }
      }
    }
  }

  .total {
    width: 100%;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid lightgrey;
    div {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: grey;
      margin-bottom: 0.2rem;
    }
  }
`;

const CODDiv = styled.div`
      width: 100%;
      height: 36rem;
      .form {
        width: 100%;
        margin: 1rem 0;
        font-size: 0.8rem;
        .label {
          color: grey;
          padding: 0.3rem 0.2rem 0.2rem 0;
        }
        .half {
          width: 50%;
        }
        .detail {
          width: 100%;
          min-height: 25px;
          border: 1px solid lightgrey;
          padding: 0.3rem;
          margin: 0 0.2rem 0.2rem 0;
          border-radius: 0.3rem;
        }
      }
`

const LineThrough = styled.div`
  width: 100%;
  height: 1px;
  background-color: grey;
  position: relative;
  margin: 2rem 0;
  z-index: -1;
  .text {
    position: absolute;
    top: -0.7rem;
    left: 50%;
    font-family: sans-serif;
    color: grey;
    text-align: center;
    z-index: 1;
    border-radius: 50%;
    background-color: #fff;
    padding: 0.3rem 0.4rem;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
`;

const Button = styled.button`
    background: #000;
    width: 100%;
    color: #fff;
    margin: 0.5rem 0;
    padding: 0.5rem;
    border: none;
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;
    &:hover{
      background: grey;
    }
}
`;

export default OrderPage;
