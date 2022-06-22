import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import EditProduct from "./EditProduct";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@material-ui/core";

import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const MyProducts = () => {
  const [myProducts, setMyProducts] = useState(null);

  const [currentData, setCurrentData] = useState(undefined);
  const [editDataModel, setEditDataModel] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertDiv, setAlertDiv] = useState({
    class: "",
    message: "",
  });

    const [model, setModel] = useState({
      status: false,
      heading: "",
      btnText: "",
      func: "",
    });

  const fetchMyProducts = async () => {
    try {
      let { data } = await axios.get("/product/myproducts");
      //   console.log(data.response);
      if (data.status) {
        setMyProducts(data.response);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const deleteDataFunc = async (_id) => {
    setTimeout(() => setAlert(false), 3000);
    // console.log(_id)
    try {
      let { data } = await axios.get(`/product/delete/${_id}`);
      // console.log(data);
      if (data.status) {
        setAlertDiv({
          class: "success",
          message: data.response,
        });
        setAlert(true);
        fetchMyProducts();
        setModel({ status: false });
      }
    } catch (error) {
      // console.log(error);
      setAlertDiv({
        class: "error",
        message: "Error: Some error!",
      });
      setAlert(true);
    }
  };

  const editDataFunc = async (item) => {
    // console.log(item);
    setCurrentData(item);
    setEditDataModel(true);
  };

  const closeEditModel = () => {
    fetchMyProducts()
    setEditDataModel(false);
  };

  // console.log(myProducts);

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

      {model.status && (
        <Model>
          <h4>{model.heading}</h4>
          <p>You can not undo it</p>
          <div className="buttons">
            <Button
              onClick={() => setModel(false)}
              style={{
                background: "#fff",
                color: "#000",
                border: "1px solid grey",
              }}
            >
              Cancel
            </Button>
            <Button
              style={{ color: "#fff", background: "red" }}
              onClick={() => {
                eval(model.func);
              }}
            >
              {model.icon}
              {model.btnText}
            </Button>
          </div>
        </Model>
      )}

      {editDataModel ? (
        <>
          <EditModel>
            <Button className="close-btn" onClick={() => closeEditModel()}>
              Close{" "}
            </Button>
            <EditProduct product={currentData} />
          </EditModel>
        </>
      ) : (
        <>
          <h2 style={{ margin: "0 0 1rem 0" }}>My Products</h2>
          <Table style={{ overflow: "scroll" }}>
            <TableHead style={{ backgroundColor: "#000" }}>
              <TableRow>
                <TableCell style={{ color: "#fff" }}>Image</TableCell>
                <TableCell style={{ color: "#fff" }}>Title</TableCell>
                <TableCell style={{ color: "#fff" }}>Category</TableCell>
                <TableCell style={{ color: "#fff" }}>price</TableCell>
                <TableCell style={{ color: "#fff" }}>Stock</TableCell>
                <TableCell style={{ color: "#fff" }}>Date</TableCell>
                <TableCell style={{ color: "#fff" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myProducts &&
                myProducts.map((item) => (
                  <TableRow key={item._id}>
                    <NavLink
                      to={`/product/${item._id}`}
                      style={{ textDecoration: "none", color: "#000" }}
                    >
                      <TableCell>
                        <img
                          src={item.image}
                          alt="pic"
                          style={{
                            width: "5rem",
                            height: "5em",
                          }}
                        />
                      </TableCell>
                    </NavLink>

                    <TableCell>
                      <NavLink
                        to={`/product/${item._id}`}
                        style={{ textDecoration: "none", color: "#000" }}
                      >
                        {item.title}
                      </NavLink>
                    </TableCell>

                    <TableCell>{item.subCategory}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>{item.date.slice(0, 12)}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex" }}>
                        <Button onClick={() => editDataFunc(item)}>Edit</Button>
                        <Button
                          onClick={() =>
                            setModel({
                              status: true,
                              heading: "Do you want to delete product?",
                              btnText: "Delete product",
                              func: `deleteDataFunc("${item._id}")`,
                            })
                          }
                          style={{ background: "#f44336" }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const EditModel = styled.div`
  width: 100%;
  position: relative;
  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
`;

const Button = styled.button`
    background: #3151b5;
    color: #fff;
    margin: 0 0 0 0.5rem;
    padding: 0.5rem;
    border: none;
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;
    &:hover{
      background: #2c387e;
    }
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
    justify-content: center;
  }
`;

export default MyProducts;
