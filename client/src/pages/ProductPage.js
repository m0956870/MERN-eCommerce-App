import React, { useState, useEffect, useContext } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";

import styled from "styled-components";
import axios from "axios";

import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { BsCart4, BsNodePlusFill } from "react-icons/bs";

import { UserContext } from "../App";

const ProductPage = () => {
  const navigate = useNavigate();

  const params = useParams();
  // console.log(params._id);

  const { state, dispatch } = useContext(UserContext);
  // console.log(state);

  let cartItemIDs = [];
  if (state) {
    state.cartItems.map((item) => {
      cartItemIDs.push(item._id);
    });
    //   console.log(cartItemIDs);
  }

  const [productItem, setProductItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  //   const [cartStatus, setCartStatus] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertDiv, setAlertDiv] = useState({
    class: "",
    message: "",
  });

  const fetchProductDetails = async () => {
    try {
      let { data } = await axios.get(`/product/find/${params._id}`);
      //   console.log(data);
      if (data.status) {
        setProductItem(data.response);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const FetchName = ({ id }) => {
    // console.log(id);

    let [name, SetName] = useState("");

    let getName = async () => {
      try {
        let { data } = await axios.get(`/user/find/${id}`);
        // console.log(data.response);

        data.response.map((user) => SetName(user.name));
      } catch (error) {
        // console.log(error);
      }
    };

    useEffect(() => {
      getName();
    }, []);
    return (
      <>
        <span>{name ? name : "Unknown"}</span>
      </>
    );
  };

  const minusQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const plusQuantity = () => {
    if (quantity <= 9) {
      setQuantity(quantity + 1);
    }
  };

  const addToCartFunc = async (product) => {
    // console.log(product);
    setTimeout(() => setAlert(false), 3000);

    let newProduct = { ...product, quantity };
    // console.log(newProduct);

    if (state) {
      let { data } = await axios.put(`/user/update/addtocart`, newProduct);
      // console.log(data.response);

      if (data.status) {
        await dispatch({ type: "USER", payload: data.response });
        // navigate("/cart");
      }
    } else {
      setAlertDiv({
        class: "error",
        message: "Errro: Please login first.",
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

        // navigate("/cart");
      }
    } else {
      setAlertDiv({
        class: "error",
        message: "Errro: Please login first.",
      });
      setAlert(true);
    }
  };

  const orderFunc = async () => {
    // console.log(productItem);
    setTimeout(() => setAlert(false), 3000);

    let newItem = { ...productItem, quantity };
    // console.log(newItem)

    try {
      if (state) {
        await dispatch({
          type: "LOGIN",
          payload: { ...state, orderItems: [newItem] },
        });
        navigate("/order");
      } else {
        setAlertDiv({
          class: "error",
          message: "Errro: Please login first.",
        });
        setAlert(true);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  // console.log(productItem);

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

      {productItem && (
        <>
          <Image>
            <div className="big-image">
              <img src={productItem.image} alt="pic" />
            </div>
            <div className="small-image">
              <div className="image"></div>
              <div className="image"></div>
              <div className="image"></div>
              <div className="image"></div>
            </div>
          </Image>
          <Details>
            <div className="head">
              <div className="details">
                <div className="title">{productItem.title}</div>
                <div className="postedBy">
                  Product by:{" "}
                  <NavLink
                    to={`/seller/profile/${productItem.postedBy}`}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    <FetchName id={productItem.postedBy} />
                  </NavLink>
                </div>
                <div className="description">{productItem.description}</div>
                <div className="price">${productItem.price} </div>
                <div className="product-detail">
                  <div>Product Details</div>
                  <p>
                    Burgundy solid casual shirt, has a spread collar, long
                    sleeves, button placket, curved hem, and 1 patch pocket
                  </p>
                </div>
                <div className="offers">
                  <p>Best Offers</p>
                  <ul>
                    <li>100% Original Products</li>
                    <li>Pay on delivery might be available</li>
                    <li>Try & Buy might be available</li>
                    <li>Easy 30 days returns and exchanges</li>
                    <li>Bank Offer5% Cashback on Flipkart Axis Bank Card</li>
                  </ul>
                </div>
              </div>
              <div className="actions">
                <div>
                  <span>Quantity</span>
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
              </div>
            </div>

            <div className="buttons">
              {!cartItemIDs.includes(productItem._id) ? (
                <button onClick={() => addToCartFunc(productItem)}>
                  Add to Cart
                </button>
              ) : (
                <button onClick={() => removefromCartFunc(productItem)}>
                  Remove to Cart
                </button>
              )}

              <button
                style={{ color: "#fff", background: "#000" }}
                onClick={() => orderFunc()}
              >
                Order Now
              </button>
            </div>
          </Details>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  ${"" /* background: red; */}
  height: 90vh;
  width: 100%;
  display: flex;
  padding: 2rem;
`;
const Image = styled.div`
  ${"" /* background: yellow; */}
  height: 100%;
  width: 50%;
  border-right: 1px solid lightgrey;
  padding-right: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: end;

  .big-image {
    ${"" /* background: yellow;  */}
    height: 80%;
    width: 100%;
    img {
      height: 100%;
      width: 100%;
      padding-bottom: 1rem;
    }
  }
  .small-image {
    ${"" /* background: orange; */}
    height: 20%;
    width: 95%;
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 1rem;
    .image {
      width: 100px;
      height: 100px;
      background: lightgrey;
    }
  }
`;
const Details = styled.div`
  ${"" /* background: orange; */}
  height: 100%;
  width: 50%;
  padding-left: 1.5rem;
  .head {
    height: 85%;
    width: 100%;
    .details {
      height: 90%;
      width: 100%;
      border-bottom: 1px solid grey;
      .title {
        font-size: 2rem;
        font-weight: bold;
        margin: 0;
      }
      .postedBy {
        font-size: 0.8rem;
        color: grey;
        span {
          font-size: 01rem;
          color: #067db5;
          font-weight: bold;
        }
      }
      .description {
        font-weight: bold;
        color: grey;
        margin: 0.5rem 0;
      }
      .price {
        font-size: 1.5rem;
        font-weight: bold;
      }
      .product-detail {
        margin: 1rem 0;
        div {
          margin: 0.5rem 0;
        }
        p {
          color: grey;
        }
      }
      .offers {
        margin: 1rem 0;
        ul {
          margin: 0.5rem 0 0 1rem;
          li {
            color: grey;
          }
        }
      }
    }
    .actions {
      ${"" /* background: grey; */}
      height: 10%;
      width: 100%;
      display: flex;
      justify-content: start;
      align-items: end;
      div span {
        margin-right: 1rem;
        font-size: 0.9rem;
        color: grey;
        font-weight: bold;
      }
      div button {
        width: 2rem;
        height: 2rem;
        font-size: 1rem;
        font-weight: bold;
      }
      div input {
        width: 2rem;
        height: 2rem;
        font-size: 1rem;
        text-align: center;
      }
    }
  }
  .buttons {
    ${"" /* background: grey; */}
    height: 15%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: end;
    button {
      width: 45%;
      height: 70%;
      color: #000;
      background: #fff;
      font-size: 1.2rem;
      &:hover {
        color: #fff;
        background: #000;
      }
    }
  }
`;

export default ProductPage;
