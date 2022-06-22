import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import { TextField, Button, InputAdornment } from "@material-ui/core";
import { FaEye } from "react-icons/fa";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    password: "",
    cpassword: "",
  });

    const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const [alert, setAlert] = useState(false);
  const [alertDiv, setAlertDiv] = useState({
    class: "",
    message: "",
  });

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

    const [showPass, setShowPass] = useState({
    pass: false,
    cpass: false,
  });

  const updatePassFunc = async () => {
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
      2000
    );

    if (user.password.length < 6) {
      if (user.password === "") {
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

    if (user.password !== user.cpassword) {
      return setError({
        ...error,
        cpassword: {
          status: true,
          text: "Password did not match",
        },
      });
    }


    try {
      let { data } = await axios.post("/user/password/reset", {password: user.password} );
      // console.log(data);
          if(data.status){
         setAlertDiv({
        class: "success",
        message: data.response,
      });
       setAlert(true);
       return setTimeout(() => {
         navigate("/login")
       }, 2000); 
      }
    } catch (error) {
      //   console.log(error);
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
      <h2 style={{ margin: "2rem 0" }}>Forget password</h2>
      <FormDiv>
        <TextField
          name="password"
          type={showPass.pass ? "text" : "password"}
          value={user.password}
          onChange={handleInput}
          fullWidth="true"
          size="small"
          id="outlined-basic"
          label="Password"
          variant="outlined"
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {showPass.pass ? (
                  <BsFillEyeSlashFill
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowPass({ ...showPass, pass: false });
                    }}
                  />
                ) : (
                  <FaEye
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowPass({ ...showPass, pass: true });
                    }}
                  />
                )}
              </InputAdornment>
            ),
          }}
          error={error.password.status}
          helperText={error.password.status ? error.password.text : null}
        />
        <TextField
          name="cpassword"
          type={showPass.cpass ? "text" : "password"}
          value={user.cpassword}
          onChange={handleInput}
          fullWidth="true"
          size="small"
          id="outlined-basic"
          label="Confirm Password"
          variant="outlined"
          margin="dense"
          style={{ marginBottom: "1rem" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {showPass.cpass ? (
                  <BsFillEyeSlashFill
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowPass({ ...showPass, cpass: false });
                    }}
                  />
                ) : (
                  <FaEye
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowPass({ ...showPass, cpass: true });
                    }}
                  />
                )}
              </InputAdornment>
            ),
          }}
          error={error.cpassword.status}
          helperText={error.cpassword.status ? error.cpassword.text : null}
        />
        <Button
          className="button"
          variant="contained"
          size="medium"
          color="primary"
          onClick={() => updatePassFunc()}
        >
          Update Password
        </Button>
      </FormDiv>
    </Container>
  );
};

const Container = styled.div`
  height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;

const FormDiv = styled.div`
border: 1px solid lightgrey;
border-radius: 0.5rem;
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
`;

export default ForgetPassword;
