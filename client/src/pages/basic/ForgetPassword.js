import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

import { TextField, Button } from "@material-ui/core";
import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const [alert, setAlert] = useState(false);
  const [alertDiv, setAlertDiv] = useState({
    class: "",
    message: "",
  });

  const sendPassFunc = async () => {
    setTimeout(() => setAlert(false), 3000);

    if (email.length === 0) {
      setAlertDiv({
        class: "error",
        message: "Please enter email!",
      });
      return setAlert(true);
    }

    try {
      let { data } = await axios.post("/user/password/forget", { email });
      if (data.status) {
        setAlertDiv({
          class: "success",
          message: data.response,
        });
        setAlert(true);
        return setEmail("");
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
          name="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="outlined-basic"
          label="Email"
          variant="outlined"
          margin="dense"
          size="small"
          autoComplete="off"
          style={{ marginBottom: "1rem" }}
        />
        <Button
          className="button"
          variant="contained"
          size="medium"
          color="primary"
          onClick={() => sendPassFunc()}
        >
          Send Password
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
