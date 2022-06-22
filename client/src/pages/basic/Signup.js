import React, { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { TextField, Button, InputAdornment } from "@material-ui/core";
import styled from "styled-components";
import axios from "axios";

import { GoogleLogin } from "react-google-login";

import loginImage from "../../images/login.svg";
import { FaEye } from "react-icons/fa";
import { BsFillEyeSlashFill } from "react-icons/bs";

import { UserContext } from "../../App";

const Signup = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    date: new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const [showPass, setShowPass] = useState({
    pass: false,
    cpass: false,
  });

  const [alert, setAlert] = useState(false);
  const [alertDiv, setAlertDiv] = useState({
    class: "success",
    message: "success",
  });

  const [error, setError] = useState({
    name: {
      status: false,
      text: "",
    },
    email: {
      status: false,
      text: "",
    },
    password: {
      status: false,
      text: "",
    },
    cpassword: {
      status: false,
      text: "",
    },
  });

  const signUpFunc = async () => {
    setTimeout(() => setAlert(false), 3000);

    setTimeout(
      () =>
        setError({
          name: {
            status: false,
            text: "",
          },
          email: {
            status: false,
            text: "",
          },
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

    if (user.name.length === 0) {
      return setError({
        ...error,
        name: {
          status: true,
          text: "Please enter name",
        },
      });
    }

    let re = /\S+@\S+\.\S+/;

    if (!re.test(user.email)) {
      if (user.email.length === 0) {
        return setError({
          ...error,
          email: {
            status: true,
            text: "Please fill email feild!",
          },
        });
      }
      return setError({
        ...error,
        email: {
          status: true,
          text: "Invalid Email!",
        },
      });
    }

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
      // console.log(user)
      let { data } = await axios.post("/user/signup", user);
      // console.log(data);

      if (data.status) {
        setAlertDiv({
          class: "success",
          message: data.response,
        });
        setAlert(true);
        return setTimeout(() => navigate("/login"), 1000);
      }
    } catch (error) {
      // console.log(error.response.data);

      if (!error.response.data.status) {
        setAlertDiv({
          class: "error",
          message: error.response.data.response,
        });
        return setAlert(true);
      }
    }
  };

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
            <div className={alertDiv.class}>{alertDiv.message}</div>
          </div>
        )}
        <FormDiv>
          <Image>
            <img src={loginImage} alt="loginImg" />
          </Image>
          <SignupForm>
            <Form>
              <Title>Create Account</Title>
              <FormFeilds>
                <GoogleLogin
                  className="google-login"
                  clientId={process.env.REACT_APP_GCID}
                  buttonText="Signup with Google"
                  onSuccess={successGoogle}
                  onFailure={failureGoogle}
                  // isSignedIn={true}
                  cookiePolicy={"single_host_origin"}
                />

                <LineThrough>
                  <div className="text">or</div>
                </LineThrough>

                <TextField
                  name="name"
                  value={user.name}
                  onChange={handleInput}
                  fullWidth
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  margin="normal"
                  size="small"
                  autoComplete="off"
                  error={error.name.status}
                  helperText={error.name.status ? error.name.text : null}
                />
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
                  autoComplete="off"
                  error={error.email.status}
                  helperText={error.email.status ? error.email.text : null}
                />
                <TextField
                  name="password"
                  type={showPass.pass ? "text" : "password"}
                  value={user.password}
                  onChange={handleInput}
                  fullWidth
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
                  helperText={
                    error.password.status ? error.password.text : null
                  }
                />
                <TextField
                  name="cpassword"
                  type={showPass.cpass ? "text" : "password"}
                  value={user.cpassword}
                  onChange={handleInput}
                  fullWidth
                  size="small"
                  id="outlined-basic"
                  label="Confirm Password"
                  variant="outlined"
                  margin="dense"
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
                  helperText={
                    error.cpassword.status ? error.cpassword.text : null
                  }
                />
                <Button
                  className="button"
                  fullWidth
                  variant="contained"
                  size="medium"
                  color="primary"
                  onClick={() => signUpFunc()}
                >
                  Sign Up
                </Button>
                <div className="footer-link">
                  Already have an account?{" "}
                  <NavLink to="/login" className="link">
                    Log In
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
  }
  .button {
    margin: 0.5rem 0;
  }
  .footer-link {
    font-family: sans-serif;
    position: absolute;
    bottom: 0;
    color: #777;
    font-size: 0.8rem;
    a {
      text-decoration: none;
      font-weight: 600;
    }
  }
`;

export default Signup;
