import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import {
  Avatar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@material-ui/core";

import { MdBlock, MdDeleteForever } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const AllSelers = () => {
  const [allSellers, setAllSeller] = useState(null);

  const [model, setModel] = useState({
    status: false,
    heading: "",
    btnText: "",
    func: "",
  });

  //   const [deleteModel, setDeleteModel] = useState(false);
  //   const [blockModel, setBlockModel] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertDiv, setAlertDiv] = useState({
    class: "",
    message: "",
  });

  const fetchAllSellers = async () => {
    try {
      let { data } = await axios.get("/user/seller");
      // console.log(data.response);
      if (data.status) {
        setAllSeller(data.response);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchAllSellers();
  }, []);

  const deleteDataFunc = async (item) => {
    setTimeout(() => setAlert(false), 3000);
    // console.log(item)

    try {
      //   let { data } = await axios.get(`/user/delete/${item._id}`);
      //   console.log(data);
      //   if (data.status) {
      //     setAlertDiv({
      //       class: "success",
      //       message: data.response,
      //     });
      //     setAlert(true);
      //     fetchAllSellers();
      //   }
    } catch (error) {
      // console.log(error);
      setAlertDiv({
        class: "error",
        message: "Error: Some error!",
      });
      setAlert(true);
    }
  };

  const blockUserFunc = async (_id) => {
    // console.log(_id);
    setTimeout(() => setAlert(false), 3000);

    try {
      let { data } = await axios.get(`/user/block/${_id}`);
      // console.log(data);
      if (data.status) {
        setAlertDiv({
          class: "success",
          message: data.response,
        });
        setAlert(true);
        setModel({ status: false });
        fetchAllSellers();
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

  const unblockUserFunc = async (_id) => {
    // console.log(_id);
    setTimeout(() => setAlert(false), 3000);

    try {
      let { data } = await axios.get(`/user/unblock/${_id}`);
      // console.log(data);
      if (data.status) {
        setAlertDiv({
          class: "success",
          message: data.response,
        });
        setAlert(true);
        setModel({ status: false });
        fetchAllSellers();
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

  // console.log(allSellers);

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

      <h2 style={{ margin: "0 0 1rem 0" }}>My Products</h2>
      <Table style={{ overflow: "scroll" }}>
        <TableHead style={{ backgroundColor: "#000" }}>
          <TableRow>
            <TableCell style={{ color: "#fff" }}></TableCell>
            <TableCell style={{ color: "#fff" }}>Name</TableCell>
            <TableCell style={{ color: "#fff" }}>Email</TableCell>
            <TableCell style={{ color: "#fff" }}>Phone</TableCell>
            <TableCell style={{ color: "#fff" }}>Date</TableCell>
            <TableCell style={{ color: "#fff" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allSellers &&
            allSellers.map((item) => (
              <>
                <TableRow key={item._id}>
                    <TableCell>
                  <NavLink
                    to={`/seller/profile/${item._id}`}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                      <Avatar src={item.profilePic} alt="pic" />
                  </NavLink>
                    </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    {item.phone ? item.phone : "Not available"}
                  </TableCell>
                  <TableCell>{item.date.slice(0, 11)}</TableCell>
                  <TableCell style={{ display: "flex", justifyContent: "end" }}>
                    {item.blocked === false ? (
                      <Button
                        onClick={() =>
                          setModel({
                            status: true,
                            heading: "Do you want to block user?",
                            btnText: "Block User",
                            func: `blockUserFunc("${item._id}")`,
                          })
                        }
                      >
                        <MdBlock /> Block
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          setModel({
                            status: true,
                            heading: "Do you want to unblock user?",
                            btnText: "Unblock User",
                            func: `unblockUserFunc("${item._id}")`,
                          })
                        }
                      >
                        <CgUnblock /> Unblock
                      </Button>
                    )}

                    <Button
                      onClick={() =>
                        setModel({
                          status: true,
                          heading: "Do you want to delete user?",
                          btnText: "Delete User",
                          func: `deleteDataFunc("${item._id}")`,
                        })
                      }
                    >
                      <MdDeleteForever /> Delete
                    </Button>
                  </TableCell>
                </TableRow>

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
                          // console.log(typeof model.func);
                          // console.log(model.func);
                          eval(model.func);
                          //   blockUserFunc("62a09e993ea6b4d856615bc7") // _id insde "" to work
                        }}
                      >
                        {model.icon}
                        {model.btnText}
                      </Button>
                    </div>
                  </Model>
                )}
              </>
            ))}
        </TableBody>
      </Table>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    ${"" /* display: none; */}
  }
`;

// const Product = styled.div`
//   height: 25vh;
//   width: 100%;
//   margin: 1rem 0;
//   border: 1px solid lightgrey;
//   ${"" /* border-radius: 0.5rem; */}
// `;

const Button = styled.button`
    background: #f44336;
    color: #fff;
    margin: 0 0 0 0.5rem;
    padding: 0.5rem;
    border: none;
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        font-size: 1rem;
        margin-right: 0.3rem;
    }
    &:hover{
      background: #e91e63;
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

export default AllSelers;
