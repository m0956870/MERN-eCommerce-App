import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import { Avatar, TextField } from "@material-ui/core";
import { FaEdit } from "react-icons/fa";

import { BiErrorCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { UserContext } from "../../App";

const EditProfile = () => {
  const navigate = useNavigate();

  const { state, dispatch } = useContext(UserContext);
  // console.log(state);

  const [url, setUrl] = useState(null);

  const [accDetails, setAccDetails] = useState({
    _id: state._id,
    name: state.name || "",
    lastName: state.lastName || "",
    phone: state.phone || "",
    gender: state.gender || "Male",
    birthday: state.birthday || "",

    address: (state.address && state.address.address) || "",
    city: (state.address && state.address.city) || "",
    state: (state.address && state.address.state) || "",
    zip: (state.address && state.address.zip) || "",
    country: (state.address && state.address.country) || "",
  });

  const acc = (e) => {
    setAccDetails({ ...accDetails, [e.target.name]: e.target.value });
  };

  const [alert, setAlert] = useState(false);
  const [alertDiv, setAlertDiv] = useState({
    class: "",
    message: "",
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

  const updatePicFunc = async () => {
    setTimeout(() => setAlert(false), 3000);

    if (!url) {
      setAlertDiv({
        class: "error",
        message: "Error: Please select image first!",
      });
      return setAlert(true);
    }

    // console.log(state);
    try {
      let updatePicData = {
        _id: state._id,
        profilePic: url || state.profilePic,
      };
      // console.log(updatePicData);
      let { data } = await axios.post("/user/update/profilepic", updatePicData);
      // console.log(data);
      if (data.status) {
        await dispatch({ type: "USER", payload: data.response });
        setAlertDiv({
          class: "success",
          message: "Success: rofile pic updated",
        });
        setAlert(true);
        return setTimeout(() => navigate("/account/account-details"), 1000);

      }
    } catch (error) {
      // console.log(error);
      // console.log(error.response.data);
      if (!error.response.data.status) {
        setAlertDiv({
          class: "error",
          message: "Error: Some error! Try again",
        });
        setAlert(true);
      }
    }
  };

  const updateAccFunc = async () => {
    setTimeout(() => setAlert(false), 3000);

    // console.log(accDetails);
    // console.log(state) // ERROR - Cannot access 'state' before initialization
    let {
      _id,
      name,
      lastName,
      phone,
      gender,
      birthday,
      address,
      city,
      state,
      zip,
      country,
    } = accDetails;

    try {
      let updateAccData = {
        _id,
        name,
        lastName,
        phone,
        gender,
        birthday,
        address: {
          address,
          city,
          state,
          zip,
          country,
        },
      };
      // console.log(updateAccData);
      let { data } = await axios.post(
        "/user/update/account-details",
        updateAccData
      );
      // console.log(data);
      if (data.status) {
        await dispatch({ type: "USER", payload: data.response });
        setAlertDiv({
          class: "success",
          message: "Success: Account details updated",
        });
        setAlert(true);
        return setTimeout(() => navigate("/account/account-details"), 1000);
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
        <h2>Edit Profile</h2>

        <ChangePic>
          <Avatar
            alt="Profile Pic"
            src={url ? url : state.profilePic}
            style={{ width: "5rem", height: "5rem" }}
          />

          <div class="image-upload">
            <label>
              <FaEdit size={28} />

              <input
                type="file"
                onChange={(e) => changePicFunc(e)}
                name="myfile"
                style={{ display: "none" }}
              />
            </label>
          </div>
        </ChangePic>
        <Button
          onClick={() => updatePicFunc()}
          style={{ margin: "0px 0px 8px 0px" }}
        >
          Update profile pic
        </Button>
        <Details>
          <p className="label">ID</p>
          <p className="detail" style={{ color: "grey" }}>
            {state._id && state._id}
          </p>
          <div style={{ display: "flex" }}>
            <p className="label half">First Name</p>
            <p className="label half">Last Name</p>
          </div>
          <div style={{ display: "flex" }}>
            <input
              type="text"
              className="detail half"
              name="name"
              value={accDetails.name}
              onChange={acc}
            />
            <input
              type="text"
              className="detail half"
              name="lastName"
              value={accDetails.lastName}
              onChange={acc}
              placeholder="Optional"
            />
          </div>
          <p className="label">Email</p>
          <p className="detail" style={{ color: "grey" }}>
            {state.email && state.email}
          </p>
          <p className="label">Phone</p>
          <input
            className="detail"
            type="number"
            name="phone"
            value={accDetails.phone}
            onChange={acc}
            placeholder="Optional"
          />

          <h2 style={{ margin: "2rem 0 1rem 0" }}>Personal Details</h2>
          <div style={{ display: "flex" }}>
            <p className="label half">Gender</p>
            <p className="label half">Birthday (mm-dd-yyyy)</p>
          </div>
          <div style={{ display: "flex" }}>
            <select
              className="detail half"
              name="gender"
              value={accDetails.gender}
              onChange={acc}
            >
              <option value="Male" selected>
                Male
              </option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              className="detail half"
              type="date"
              name="birthday"
              value={accDetails.birthday}
              onChange={acc}
              placeholder="Optional"
            />
          </div>
          <p className="label">address</p>
          <input
            className="detail"
            type="text"
            name="address"
            value={accDetails.address}
            onChange={acc}
            placeholder="Optional"
          />
          <div style={{ display: "flex" }}>
            <p className="label half">City</p>
            <p className="label half">State</p>
          </div>
          <div style={{ display: "flex" }}>
            <input
              className="detail half"
              type="text"
              name="city"
              value={accDetails.city}
              onChange={acc}
              placeholder="Optional"
            />
            <input
              className="detail half"
              type="text"
              name="state"
              value={accDetails.state}
              onChange={acc}
              placeholder="Optional"
            />
          </div>
          <div style={{ display: "flex" }}>
            <p className="label half">ZIP</p>
            <p className="label half">Country</p>
          </div>
          <div style={{ display: "flex" }}>
            <input
              className="detail half"
              type="number"
              name="zip"
              value={accDetails.zip}
              onChange={acc}
              placeholder="Optional"
            />
            <input
              className="detail half"
              type="text"
              name="country"
              value={accDetails.country}
              onChange={acc}
              placeholder="Optional"
            />
          </div>

          <Button onClick={() => updateAccFunc()} style={{margin: "1rem 0"}}>
            Update account details
          </Button>
        </Details>
      </Container>
    </>
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

const ChangePic = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: start;
  align-items: end;
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
    width: 100%;
    min-height: 25px;
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

export default EditProfile;
 