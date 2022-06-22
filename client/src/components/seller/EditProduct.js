import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { UserContext } from "../../App";

const EditProduct = ({product}) => {
  const navigate = useNavigate();
  const { state } = useContext(UserContext);
  // console.log(state);

  // console.log(product);

  const [url, setUrl] = useState(null);

  const [productItem, setProductItem] = useState({
    _id: product._id,
    image: product.image,
    title: product.title,
    description: product.description,
    category: product.category,
    subCategory: product.subCategory,
    price: product.price,
    stock: product.stock,
    quantity: product.quantity,
    date: product.date,
    postedBy: product.postedBy,
  });

  // const handleInput = (e) => {
  //   let name = e.target.name;
  //   let value = e.target.value;

  //   setProductItem({ ...productItem, [name]: value });
  // };

    const editHandleInput = (e) => {
      setProductItem({ ...productItem, [e.target.name]: e.target.value });
      // console.log(currentData)
    };

  const [alert, setAlert] = useState(false);
  const [alertDiv, setAlertDiv] = useState({
    class: "",
    message: "",
  });

  const [error, setError] = useState({
    title: {
      status: false,
      text: "",
    },
    description: {
      status: false,
      text: "",
    },
    category: {
      status: false,
      text: "",
    },
    subCategory: {
      status: false,
      text: "",
    },
    price: {
      status: false,
      text: "",
    },
    stock: {
      status: false,
      text: "",
    },
  });

  const changePicFunc = async (e) => {
    try {
      const file = e.target.files[0];
      // console.log(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.REACT_APP_CPRESET);
      formData.append("cloud_name", process.env.REACT_APP_CCLOUD);

      let { data } = await axios.post(process.env.REACT_APP_CURL, formData);
      // console.log(data);

      setUrl(data.url);
    } catch (error) {
      // console.log(error);
    }
  };

  const postFunc = async () => {
    setTimeout(() => setAlert(false), 3000);

    setTimeout(
      () =>
        setError({
          ...error,
          status: false,
        }),
      3000
    );

    if (!state) {
      setAlertDiv({
        class: "error",
        message: "Error: Log in first.",
      });
      return setAlert(true);
    }

    if (productItem.title === "") {
      return setError({
        ...error,
        title: {
          status: true,
          text: "Please enter title!",
        },
      });
    }
    if (productItem.description === "") {
      return setError({
        ...error,
        description: {
          status: true,
          text: "Please enter description!",
        },
      });
    }

    if (productItem.category === "") {
      return setError({
        ...error,
        category: {
          status: true,
          text: "Please enter category!",
        },
      });
    }
    if (productItem.subCategory === "") {
      return setError({
        ...error,
        subCategory: {
          status: true,
          text: "Please enter subCategory!",
        },
      });
    }
    if (productItem.price === "") {
      return setError({
        ...error,
        price: {
          status: true,
          text: "Please enter price!",
        },
      });
    }
    if (productItem.stock === "") {
      return setError({
        ...error,
        stock: {
          status: true,
          text: "Please enter stock!",
        },
      });
    }


    let postData = {
      _id: productItem._id,
      image: url || product.image,
      title: productItem.title,
      description: productItem.description,
      category: productItem.category,
      subCategory: productItem.subCategory,
      stock: productItem.stock,
      price: productItem.price,
      postedBy: productItem.postedBy,
    };

    // console.log(postData);

    try {
      let { data } = await axios.post("/product/edit", postData);
      // console.log(data);
      if (data.status) {
        setAlertDiv({
          class: "success",
          message: data.response,
        });
        setAlert(true);
        setTimeout(() => {
          navigate("/account/my-products");
        }, 1000);
      }
    } catch (error) {
      // console.log(error);
      if (!error.response.data.status) {
        setAlertDiv({
          class: "error",
          message: error.response.data.response,
        });
        return setAlert(true);
      }
    }
  };

  return (
    <>
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

        <CreatePostDiv>
          <h2 style={{ margin: "1rem 0" }}>Edit Product</h2>
          <div class="image-upload">
            <label>
              <img
                src={
                  url
                    ? url
                    : product.image
                }
                style={{ width: "100%", height: "20rem" }}
              />

              <input
                type="file"
                onChange={(e) => changePicFunc(e)}
                name="myfile"
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="form">
            <p className="label">Title</p>
            <input
              className="detail"
              type="text"
              name="title"
              value={productItem.title}
              onChange={editHandleInput}
              autoComplete="off"
            />
            {error.title.status && (
              <>
                <BiErrorCircle style={{ color: "red" }} />{" "}
                <span style={{ color: "red" }}>{error.title.text}</span>
              </>
            )}

            <p className="label">Description</p>
            <textarea
              style={{
                minHeight: "4rem",
                maxHeight: "4rem",
                minWidth: "100%",
                maxWidth: "100%",
              }}
              className="detail"
              type="text"
              name="description"
              value={productItem.description}
              onChange={editHandleInput}
              autoComplete="off"
            />
            {error.description.status && (
              <>
                <BiErrorCircle style={{ color: "red" }} />{" "}
                <span style={{ color: "red" }}>{error.description.text}</span>
              </>
            )}

            <div style={{ display: "flex" }}>
              <p className="label half">Category</p>
              <p className="label half">Sub Category</p>
            </div>
            <div style={{ display: "flex" }}>
              <input
                className="detail half"
                type="text"
                name="category"
                value={productItem.category}
                onChange={editHandleInput}
                autoComplete="off"
              />

              <input
                className="detail half"
                type="text"
                name="subCategory"
                value={productItem.subCategory}
                onChange={editHandleInput}
                autoComplete="off"
              />
            </div>

            {error.category.status && (
              <>
                <BiErrorCircle style={{ color: "red" }} />{" "}
                <span style={{ color: "red" }}>{error.category.text}</span>
              </>
            )}
            {error.subCategory.status && (
              <>
                <BiErrorCircle style={{ color: "red" }} />{" "}
                <span style={{ color: "red" }}>{error.subCategory.text}</span>
              </>
            )}

            <div style={{ display: "flex" }}>
              <p className="label half">Price</p>
              <p className="label half">Stock</p>
            </div>
            <div style={{ display: "flex" }}>
              <input
                className="detail half"
                type="text"
                name="price"
                value={productItem.price}
                onChange={editHandleInput}
                autoComplete="off"
              />

              <input
                className="detail half"
                type="text"
                name="stock"
                value={productItem.stock}
                onChange={editHandleInput}
                autoComplete="off"
              />
            </div>

            {error.price.status && (
              <>
                <BiErrorCircle style={{ color: "red" }} />{" "}
                <span style={{ color: "red" }}>{error.price.text}</span>
              </>
            )}
            {error.stock.status && (
              <>
                <BiErrorCircle style={{ color: "red" }} />{" "}
                <span style={{ color: "red" }}>{error.stock.text}</span>
              </>
            )}
          </div>

          <Button
            onClick={() => postFunc()}
            // style={{ margin: "0" }}
          >
            Edit
          </Button>
        </CreatePostDiv>
      </Container>
    </>
  );
};

const Container = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: start;
  width: 100%;
  padding: 0 2rem;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CreatePostDiv = styled.div`
  height: auto;
  width: 60%;
  background: #fff;
  .form {
    width: 100%;
    margin-top: 1rem;
    font-size: 0.8rem;
    &:focus {
      outline: none;
    }
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
`;

const Button = styled.button`
    background: #3151b5;
    color: #fff;
    margin: 0.5rem 0;
    padding: 0.5rem;
    border: none;
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;
    &:hover{
      background: #2c387e;
    }
}
`;

export default EditProduct;
