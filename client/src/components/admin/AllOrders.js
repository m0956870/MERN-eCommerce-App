import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@material-ui/core";
import styled from "styled-components";
import axios from "axios";

import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { UserContext } from "../../App";

const AllOrders = () => {
  const navigate = useNavigate();
  const { state } = useContext(UserContext);
  // console.log(state);

  const [myOrders, setMyOrders] = useState([]);
  const [deleteModel, setDeleteModel] = useState(false);
  const [cancelModel, setCancelModel] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertDiv, setAlertDiv] = useState({
    class: "",
    message: "",
  });

  const fetchPlacedOrders = async () => {
    setMyOrders([]);

    try {
      let { data } = await axios.get("/order/allorders");
      // console.log(data.response)

      if (data.status) {
        return setMyOrders(data.response);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const cancelOrderFunc = async (_id) => {
    // console.log(_id);
    setTimeout(() => setAlert(false), 3000);

    try {
      let { data } = await axios.post("/order/cancel", { _id });
      // console.log(data.response)
      if (data.status) {
        setCancelModel(false);
        setAlertDiv({
          class: "success",
          message: data.response,
        });
        setAlert(true);
        fetchPlacedOrders();
      }
    } catch (error) {
      // console.log(error);
      if (!error.response.data.status) {
        setAlertDiv({
          class: "error",
          message: "Error: Try again later!",
        });
        setAlert(true);
      }
    }
  };

  const deleteOrderFunc = async (_id) => {
    // console.log(_id);
    setTimeout(() => setAlert(false), 3000);

    try {
      let { data } = await axios.get(`/order/delete/${_id}`);
      // console.log(data.response)
      if (data.status) {
        setCancelModel(false);
        setAlertDiv({
          class: "success",
          message: data.response,
        });
        setAlert(true);
        fetchPlacedOrders();
      }
    } catch (error) {
      // console.log(error);
      if (!error.response.data.status) {
        setAlertDiv({
          class: "error",
          message: "Error: Try again later!",
        });
        setAlert(true);
      }
    }
  };

  // console.log(myOrders);

  useEffect(() => {
    fetchPlacedOrders();
  }, []);

  return (
    <Container>
      <>
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

        <div className="head">
          <h2>Order Placed</h2>
        </div>

        {myOrders &&
          myOrders.map((item) => (
            <>
              {item.status !== "Canceled" ? (
                <>
                  {cancelModel && (
                    <Model>
                      <h4>Do you want to cancel order?</h4>
                      <p>You can not undo it</p>
                      <div className="buttons">
                        <Button
                          onClick={() => setCancelModel(false)}
                          style={{
                            background: "#fff",
                            color: "#000",
                            border: "1px solid grey",
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => cancelOrderFunc(item._id)}>
                          Cancel Order
                        </Button>
                      </div>
                    </Model>
                  )}

                  {deleteModel && (
                    <Model>
                      <h4>Do you want to delete order?</h4>
                      <p>You can not undo it</p>
                      <div className="buttons">
                        <Button
                          onClick={() => setDeleteModel(false)}
                          style={{
                            background: "#fff",
                            color: "#000",
                            border: "1px solid grey",
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => deleteOrderFunc(item._id)}>
                          Delete Order
                        </Button>
                      </div>
                    </Model>
                  )}

                  <OrderDiv>
                    <OrderDetail>
                      <div className="left">
                        <h2 className="id">Order ID: {item._id} </h2>
                        <div className="date">Order Date: {item.date}</div>
                      </div>
                      <div className="right">
                        <Button onClick={() => setDeleteModel(true)}>
                          Delete Order
                        </Button>
                        <Button onClick={() => setCancelModel(true)}>
                          Cancel Order
                        </Button>
                      </div>
                    </OrderDetail>

                    <OrderItems>
                      {item.items &&
                        item.items.map((order) => (
                          <div className="order">
                            <div className="image">
                              <img src={order.image} alt="pic" />
                            </div>
                            <div className="details">
                              <div className="left">
                                <div className="title"> {order.title} </div>
                                <div className="description">
                                  {order.description}
                                </div>
                                <div className="description">
                                  Category: {order.subCategory}
                                </div>
                              </div>

                              <div className="right">
                                <div className="price">
                                  Item Price: {order.price}
                                </div>
                                <div className="quantity">
                                  Quantity: {order.quantity}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </OrderItems>

                    <DeliveryDetails>
                      <div className="left">
                        <div className="customer">
                          <h4> Personal Detail </h4>
                          <p>Name: {item.customerDetails.name} </p>
                          <p>Email: {item.customerDetails.email} </p>
                          <p>Phone: {item.customerDetails.phone} </p>
                        </div>

                        <div className="address">
                          <h4>Delivery Address</h4>
                          <p>{item.customerDetails.address} </p>
                          <p>
                            {item.customerDetails.city},{" "}
                            {item.customerDetails.state}
                          </p>
                          <p>
                            {item.customerDetails.country},{" "}
                            {item.customerDetails.zip}
                          </p>
                        </div>
                      </div>

                      <div className="right">
                        <div className="payment">
                          Payment Type: {item.paymentType}
                        </div>
                        <div className="status">
                          Order Status: {item.status}{" "}
                        </div>
                        <div className="total">Total Amount: {item.total} </div>
                      </div>
                    </DeliveryDetails>
                  </OrderDiv>
                </>
              ) : (
                <CancelOrderDiv>
                  <OrderDetail>
                    <div className="left">
                      <h2 className="id">Order ID: {item._id} </h2>
                      <div className="date">Order Date: {item.date}</div>
                    </div>
                    <div className="right">
                      <Button
                        style={{ zIndex: 20 }}
                        onClick={() => setDeleteModel(true)}
                      >
                        Delete Order
                      </Button>
                      <Button onClick={() => setCancelModel(true)}>
                        Cancel Order
                      </Button>
                    </div>
                  </OrderDetail>

                  <OrderItems>
                    {item.items &&
                      item.items.map((order) => (
                        <div className="order">
                          <div className="image">
                            <img src={order.image} alt="pic" />
                          </div>
                          <div className="details">
                            <div className="left">
                              <div className="title"> {order.title} </div>
                              <div className="description">
                                {order.description}
                              </div>
                              <div className="description">
                                Category: {order.subCategory}
                              </div>
                            </div>

                            <div className="right">
                              <div className="price">
                                Item Price: {order.price}
                              </div>
                              <div className="quantity">
                                Quantity: {order.quantity}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </OrderItems>

                  <DeliveryDetails>
                    <div className="left">
                      <div className="customer">
                        <h4> Personal Detail </h4>
                        <p>Name: {item.customerDetails.name} </p>
                        <p>Email: {item.customerDetails.email} </p>
                        <p>Phone: {item.customerDetails.phone} </p>
                      </div>

                      <div className="address">
                        <h4>Delivery Address</h4>
                        <p>{item.customerDetails.address} </p>
                        <p>
                          {item.customerDetails.city},{" "}
                          {item.customerDetails.state}
                        </p>
                        <p>
                          {item.customerDetails.country},{" "}
                          {item.customerDetails.zip}
                        </p>
                      </div>
                    </div>

                    <div className="right">
                      <div className="payment">
                        Payment Type: {item.paymentType}
                      </div>
                      <div className="status">Order Status: {item.status} </div>
                      <div className="total">Total Amount: {item.total} </div>
                    </div>
                  </DeliveryDetails>
                </CancelOrderDiv>
              )}
            </>
          ))}
      </>
    </Container>
  );
};

const Container = styled.div`
  height: 90vh;
  width: 100%;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }

  background: #d3d3d350;
  padding: 0 2rem 2rem 2rem;
  .head {
    height: 8vh;
    width: 100%;
    display: flex;
    align-items: center;
  }
`;

const Model = styled.div`
  width: 50%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  p {
    color: grey;
    font-size: 0.8rem;
    padding: 0.4rem 0;
  }
  .buttons {
    width: 70%;
    display: flex;
    justify-content: space-between;
  }
`;

const OrderDiv = styled.div`
  width: 90%;
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const CancelOrderDiv = styled.div`
  width: 90%;
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  &:after {
    content: "Order is canceled.";
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: lightgrey;
    opacity: 0.7;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

const OrderDetail = styled.div`
  height: 4rem;
  width: 100%;
  ${"" /* border: 1px solid lightgrey; */}
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  .left {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    .date {
      color: grey;
      font-size: 0.8rem;
    }
  }
  .right {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
  }
`;
const OrderItems = styled.div`
  width: 100%;
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;

  padding: 0.8rem 0;

  .order {
    height: 6rem;
    width: 100%;
    padding: 0.2rem 0;
    display: flex;
    background: #fff;

    .image {
      height: 100%;
      width: 15%;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .details {
      height: 100%;
      width: 85%;
      display: flex;
      justify-content: center;
      align-items: center;
      .left {
        width: 70%;
        height: 100%;
        .title {
          font-weight: bold;
          font-size: 1.2rem;
          margin-bottom: 0.3rem;
        }
        .description {
          font-size: 0.9rem;
          color: grey;
          margin-bottom: 0.2rem;
        }
      }
      .right {
        width: 30%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: end;
        .price {
          font-weight: bold;
          font-size: 1rem;
          margin-bottom: 0.3rem;
        }
        .quantity {
          font-size: 0.9rem;
          color: grey;
        }
      }
    }
  }
`;

const DeliveryDetails = styled.div`
  height: 10rem;
  width: 100%;
  margin-top: 1rem;
  display: flex;
  .left {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
     .customer {
         h4 {
             font-size: 1rem;
             font-weight: bold;
             margin-bottom: 0.2rem;
           }
         p {
             font-size: 0.8rem;
             color: grey;
           }
         }
           .address {
           h4 {
             font-size: 1rem;
             font-weight: bold;
             margin-bottom: 0.2rem;
           }
           p {
             font-size: 0.8rem;
             color: grey;
           }
       }
  }
  .right {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: end;
     .payment {
       font-size: 0.8rem;
       color: grey;
     }
     .status {
       font-size: 0.8rem;
       color: grey;
       margin-top: 0.1rem;
     }
     .total {
       font-weight: bold;
       font-size: 1.1rem;
       margin-top: 0.3rem;
     }
   }
  }
`;

const Button = styled.button`
    width: 100%;
    background: red;
    color: #fff;
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover{
      background: #e91e63;
    }
}
`;

export default AllOrders;
