import React, { useContext } from "react";
import styled from "styled-components";

import { UserContext } from "../../App";

const AccountDetails = () => {
  const { state } = useContext(UserContext);
  // console.log(state);

  return (
    <Container>
      <h2> Account Details </h2>
      <Details>
        <p className="label">ID</p>
        <p className="detail">{state._id && state._id}</p>
        <div style={{ display: "flex" }}>
          <p className="label half">First Name</p>
          <p className="label half">Last Name</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="detail half">{state.name && state.name}</p>
          <p className="detail half">{state.lastName && state.lastName}</p>
        </div>
        <p className="label">Email</p>
        <p className="detail">{state.email && state.email}</p>
        <p className="label">Phone</p>
        <p className="detail">{state.phone && state.phone}</p>
        <h2 style={{ margin: "2rem 0 1rem 0" }}>Personal Details</h2>
        <div style={{ display: "flex" }}>
          <p className="label half">Gender</p>
          <p className="label half">Birthday (yyyy-mm-dd)</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="detail half">{state.gender && state.gender}</p>
          <p className="detail half">{state.birthday && state.birthday}</p>
        </div>
        <p className="label">address</p>
        <p className="detail">{state.address && state.address.address}</p>
        <div style={{ display: "flex" }}>
          <p className="label half">City</p>
          <p className="label half">State</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="detail half">{state.address && state.address.city}</p>
          <p className="detail half">{state.address && state.address.state}</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="label half">ZIP</p>
          <p className="label half">Country</p>
        </div>
        <div style={{ display: "flex" }}>
          <p className="detail half">{state.address && state.address.zip}</p>
          <p className="detail half">
            {state.address && state.address.country}
          </p>
        </div>
         <div style={{margin:"1rem 0"}}><span style={{marginRight: "0.3rem"}}>Date Joined:</span><span style={{color: "grey"}}>{state.date && state.date}</span></div>
      </Details>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 2rem 3rem;
  font-family: sans-serif;
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
    border: 1px solid lightgrey;
    padding: 0.3rem;
    margin: 0 0.2rem 0.2rem 0;
    border-radius: 0.3rem;
  }
`;

export default AccountDetails;
