import React, { useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import { Avatar, Menu, MenuItem, Badge } from "@material-ui/core";
import { BsCart4 } from "react-icons/bs";

import { UserContext } from "../App";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  // console.log(state);

  // console.log(window.location.href); // for full url
  // console.log(window.location.pathname); // for pathname

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let verifyUser = async () => {
    try {
      let { data } = await axios.get("/user/details");
      // console.log(data.response);
      if (data.status) {
        return dispatch({ type: "USER", payload: data.response });
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <>
      <Container>
        <Logo>
          <NavLink to="/">eCommerce</NavLink>
        </Logo>
        <Links>
          <ul>
            {state ? (
              <>
                <NavLink to="/cart">
                  <Badge badgeContent={state.cartItems.length} color="error">
                    <BsCart4 size={32} />
                  </Badge>
                </NavLink>
                <Avatar
                  style={{ marginLeft: "1rem" }}
                  alt="Profile Pic"
                  src={state ? state.profilePic : null}
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                />

                <Menu
                  className="menu"
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  PaperProps={{
                    style: {
                      marginTop: "50px",
                    },
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <NavLink
                      style={{ textDecoration: "none", color: "#000" }}
                      to="/account/account-details"
                    >
                      Account
                    </NavLink>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <NavLink
                      style={{ textDecoration: "none", color: "#000" }}
                      to="/logout"
                    >
                      Logout
                    </NavLink>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    style={{
                      background: "#fff",
                      padding: "0.6rem 1rem",
                      fontWeight: "bold",
                    }}
                    to="/seller/signup"
                  >
                    Become a Seller
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/signup">Signup</NavLink>
                </li>
                <li>
                  <NavLink
                    className={`${
                      window.location.pathname === "/" ? "active" : ""
                    }`}
                    to="/login"
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </Links>
      </Container>
    </>
  );
};

const Container = styled.div`
  height: 10vh;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid #d3d3d3;
  ${"" /* box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; */}
`;

const Logo = styled.div`
  a {
    color: #000;
    font-weight: bold;
    font-size: 1.8rem;
    font-family: sans-serif;
    text-decoration: none;
  }
`;

const Links = styled.div`
  ul {
    display: flex;
    justify-content: center;
    align-items: center;

    li {
      list-style: none;

      a {
        text-decoration: none;
        padding: 0.6rem 1.5rem;
        margin: 0 0 0 1rem;
        color: #000;
        background: lightgrey;
        font-weight: 300;
        font-family: sans-serif;
        border-radius: 6px;
        &:hover {
          box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px,
            rgba(0, 0, 0, 0.23) 0px 3px 6px;
        }
      }
      .active {
        background: #3151b5;
        color: #fff;
      }
    }
  }
`;

export default Navbar;
