import React, { useContext, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { TextField, Button, InputAdornment } from "@material-ui/core";
import styled from "styled-components";
import axios from "axios";

import { GoogleLogin } from "react-google-login";

import loginImage from "../../images/login.svg";
import { FaEye } from "react-icons/fa";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { UserContext } from "../../App";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  const [user, setUser] = useState({
    email: "",
    password: "",
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
    email: {
      status: false,
      text: "",
    },
    password: {
      status: false,
      text: "",
    },
  });

  const [showPass, setShowPass] = useState(false);

  const fetchUser = async () => {
    try {
      let { data } = await axios.get("/user/details");
      // console.log(data);

      navigate("/");
      if (data.status) {
        return dispatch({ type: "USER", payload: data.response });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loginFunc = async () => {
    setTimeout(() => setAlert(false), 3000);

    setTimeout(
      () =>
        setError({
          email: {
            status: false,
            text: "",
          },
          password: {
            status: false,
            text: "",
          },
        }),
      3000
    );

    if (user.email.length === 0) {
      return setError({
        ...error,
        email: {
          status: true,
          text: "Please enter email",
        },
      });
    }
    if (user.password.length === 0) {
      return setError({
        ...error,
        password: {
          status: true,
          text: "Please enter password",
        },
      });
    }

    try {
      let { data } = await axios.post("/user/login", user);
      // console.log(data);

      if (data.status) {
        setAlertDiv({
          class: "success",
          message: data.response,
        });
        setAlert(true);
        await fetchUser();
        // setTimeout(() => navigate("/"), 1000);
      }
    } catch (error) {
      if (!error.response.data.status) {
        setAlertDiv({
          class: "error",
          message: error.response.data.response,
        });
        return setAlert(true);
      }
    }
  };

  const successGoogle = async (response) => {
    // console.log(response);
    setTimeout(() => setAlert(false), 3000);

    let gUser = {
      googleId: response.profileObj.googleId,
      name: response.profileObj.name,
      email: response.profileObj.email,
      profilePic: response.profileObj.imageUrl,
      date: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    // console.log(gUser)

    try {
      let { data } = await axios.post("/user/login/google", gUser);
      // console.log(data);
      if (data.status) {
        setAlertDiv({
          class: "success",
          message: data.response,
        });
        setAlert(true);
        return fetchUser();
      }
    } catch (error) {
      if (!error.response.data.status) {
        setAlertDiv({
          class: "error",
          message: error.response.data.response,
        });
        return setAlert(true);
      }
    }
  };

  const failureGoogle = (response) => {
    // console.log(response);
    setTimeout(() => setAlert(false), 3000);

    setAlertDiv({
      class: "error",
      message: "Error: Google login failed.",
    });
    setAlert(true);
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
        <FormDiv>
          <Image>
            <img src={loginImage} alt="loginImg" />
          </Image>
          <SignupForm>
            <Form>
              <Title>Log In</Title>
              <FormFeilds>
                <GoogleLogin
                  className="google-login"
                  clientId={process.env.REACT_APP_GCID}
                  buttonText="Login with Google"
                  onSuccess={successGoogle}
                  onFailure={failureGoogle}
                  // isSignedIn={true}
                  cookiePolicy={"single_host_origin"}
                />

                <LineThrough>
                  <div className="text">or</div>
                </LineThrough>

                <TextField
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleInput}
                  fullWidth
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  margin="dense"
                  size="small"
                  // autoComplete="off"
                  error={error.email.status}
                  helperText={error.email.status ? error.email.text : null}
                />
                <TextField
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={user.password}
                  onChange={handleInput}
                  fullWidth
                  size="small"
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  margin="dense"
                  error={error.password.status}
                  helperText={
                    error.password.status ? error.password.text : null
                  }
                  // InputProps={{
                  //   endAdornment: <FaEye />,
                  // }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {showPass ? (
                          <BsFillEyeSlashFill
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPass(false)}
                          />
                        ) : (
                          <FaEye
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPass(true)}
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  className="button"
                  fullWidth
                  variant="contained"
                  size="medium"
                  color="primary"
                  onClick={() => loginFunc()}
                >
                  Log In
                </Button>
                <div className="footer-link">
                  Forget Password?{" "}
                  <NavLink to="/forget-password" className="link">
                    Click here
                  </NavLink>
                </div>
                <div className="footer-link">
                  Don't have an account?{" "}
                  <NavLink to="/signup" className="link">
                    Sign Up
                  </NavLink>
                </div>
              </FormFeilds>
            </Form>
          </SignupForm>
        </FormDiv>
      </Container>
    </>
  );
};

const Container = styled.div`
  height: 90vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormDiv = styled.div`
  height: 80%;
  width: 60%;
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;
const Image = styled.div`
  height: 100%;
  width: 45%;
  background: #3151b5;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SignupForm = styled.div`
  height: 100%;
  width: 55%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.div`
  height: 90%;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h2`
  height: 10%;
  width: 100%;
  text-align: center;
  font-family: sans-serif;
`;

const LineThrough = styled.div`
  width: 100%;
  height: 1px;
  background-color: grey;
  position: relative;
  margin: 1.5rem 0 1.2rem 0;
  z-index: -1;
  .text {
    position: absolute;
    top: -0.7rem;
    left: 45%;
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

const FormFeilds = styled.div`
  height: 90%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  position: relative;
  .google-login {
    margin: 0.8rem 0 0 0;
    width: 100%;
  }
  .button {
    margin: 0.5rem 0;
  }
  .footer-link {
    font-family: sans-serif;
    ${
      "" /* position: absolute;
    bottom: 0; */
    }
    margin: 1rem 0;
    color: #777;
    font-size: 0.8rem;
    a {
      text-decoration: none;
      font-weight: 600;
    }
  }
`;

export default Login;
