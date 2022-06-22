import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import { FaEye } from "react-icons/fa";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { UserContext } from "../../App";

const Security = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  // console.log(state);

  const [showPass, setShowPass] = useState({
    pass: false,
    cpass: false,
  });

  const [deleteModel, setDeleteModel] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertDiv, setAlertDiv] = useState({
    class: "",
    message: "",
  });

  const [password, setPassword] = useState({
    password: "",
    cpassword: "",
  });

  const acc = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const [error, setError] = useState({
    password: {
      status: false,
      text: "",
    },
    cpassword: {
      status: false,
      text: "",
    },
  });

  const updatePassFunc = async () => {
    // console.log(password);
    setTimeout(() => setAlert(false), 2000);

    setTimeout(
      () =>
        setError({
          password: {
            status: false,
            text: "",
          },
          cpassword: {
            status: false,
            text: "",
          },
        }),
      3000
    );

    if (password.password.length < 6) {
      if (password.password == "") {
        return setError({
          ...error,
          password: {
            status: true,
            text: "Please fill password feild!",
          },
        });
      }
      return setError({
        ...error,
        password: {
          status: true,
          text: "Password should be 6 letters",
        },
      });
    }

    if (password.password !== password.cpassword) {
      if (password.cpassword == "") {
        return setError({
          ...error,
          cpassword: {
            status: true,
            text: "Please fill password feild!",
          },
        });
      }
      return setError({
        ...error,
        cpassword: {
          status: true,
          text: "Password did not match",
        },
      });
    }

    let dataForPass = {
      _id: state._id,
      password: password.password,
    };
    // console.log(dataForPass);

    try {
      let { data } = await axios.post("/user/update/password", dataForPass);
      // console.log(data);
      if (data.status) {
        setAlertDiv({
          class: "success",
          message: data.response,
        });
        setAlert(true);
        return setPassword({
          password: "",
          cpassword: "",
        });
      }
    } catch (error) {
      // console.log(error);
      // console.log(error.response.data);
      if (!error.response.data.status) {
        setAlertDiv({
          class: "error",
          message: "Error: Try again later!",
        });
        setAlert(true);
      }
    }
  };

  const deleteAccFunc = async () => {
    // console.log("delet func")
    // console.log(state)
    setTimeout(() => setAlert(false), 2000);

    try {
      let { data } = await axios.post("/user/delete", { _id: state._id });
      // console.log(data);
      if (data.status) {
        setAlertDiv({
          class: "success",
          message: data.response,
        });
        setAlert(true);
        await dispatch({ type: "USER", payload: null });
        return navigate("/login");
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
      <h2>Security & Password</h2>
      <Details>
        <p className="label">New Password</p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            className="detail half"
            type={showPass.pass ? "text" : "password"}
            name="password"
            value={password.password}
            onChange={acc}
          />
          <span>
            {showPass.pass ? (
              <BsFillEyeSlashFill
                style={{
                  margin: "0 0.3rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowPass({ ...showPass, pass: false });
                }}
              />
            ) : (
              <FaEye
                style={{
                  margin: "0 0.3rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowPass({ ...showPass, pass: true });
                }}
              />
            )}
          </span>
        </div>

        {error.password.status && (
          <p style={{ color: "red" }}>{error.password.text}</p>
        )}

        <p className="label">Confirm New Password</p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            className="detail"
            type={showPass.cpass ? "text" : "password"}
            name="cpassword"
            value={password.cpassword}
            onChange={acc}
          />
          <span>
            {showPass.cpass ? (
              <BsFillEyeSlashFill
                style={{
                  margin: "0 0.3rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowPass({ ...showPass, cpass: false });
                }}
              />
            ) : (
              <FaEye
                style={{
                  margin: "0 0.3rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowPass({ ...showPass, cpass: true });
                }}
              />
            )}
          </span>
        </div>
        {error.cpassword.status && (
          <p style={{ color: "red" }}>{error.cpassword.text}</p>
        )}

        <Button onClick={() => updatePassFunc()}>Update Password</Button>
      </Details>
      {state.role !== "admin" && (
        <>
          <h2 style={{ margin: "2rem 0 0 0" }}>Delete Account</h2>
          <Button
            onClick={() => setDeleteModel(true)}
            style={{ background: "#f44336" }}
          >
            Delete Account
          </Button>
        </>
      )}
      {deleteModel && (
        <Model>
          <h4 style={{ marginTop: "1rem" }}>Are you sure?</h4>
          <p className="label">You can not undo it</p>
          <div>
            <Button
              onClick={() => setDeleteModel(false)}
              style={{ background: "#fff", color: "#000" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteAccFunc()}
              style={{ background: "#f44336" }}
            >
              Delete
            </Button>
          </div>
        </Model>
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 2rem 3rem;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;

const Details = styled.div`
  height: auto;
  width: 60%;
  margin-top: 1rem;
  font-size: 0.8rem;
  .label {
    color: grey;
    padding: 0.3rem 0.2rem 0.2rem 0;
  }
  .half {
    width: 50%;
  }
  .detail {
    min-height: 25px;
    width: 100%;
    border: 1px solid lightgrey;
    padding: 0.3rem;
    margin: 0 0.2rem 0.2rem 0;
    border-radius: 0.3rem;
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

const Model = styled.div`
  height: auto;
  width: 60%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
    .label {
    color: grey;
    padding: 0.3rem 0.2rem 0.2rem 0;
    font-size: 0.8rem;
`;

export default Security;
