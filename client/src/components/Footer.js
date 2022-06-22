import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import {
  RiFacebookCircleLine,
  RiTwitterLine,
  RiWhatsappLine,
} from "react-icons/ri";
import { AiOutlineInstagram } from "react-icons/ai";

import { HiOutlineHome } from "react-icons/hi";
import { MdOutlineMail } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { FaFax } from "react-icons/fa";

import { UserContext } from "../App";

const Footer = () => {

  return (
    <Container>
      <div className="upper">
        <div>
          <h4>Company</h4>
          <p>
            Our website is a eCommerce platform to provide servies for both
            customer and seller. Lorem, ipsum dolor sit amet consectetur
            adipisicing elit. Perspiciatis maxime nesciunt.
          </p>
        </div>
        <div>
          <h4>Useful Links</h4>
          <p>Help?</p>
          <p>FAQ</p>
          <p>Become A Seller</p>
          <p>About Us</p>
        </div>
        <div>
          <h4>Legal</h4>
          <p>Return Policy</p>
          <p>Security</p>
          <p>Privacy Policy</p>
          <p>Terms & Conditions</p>
        </div>
        <div>
          <h4>Contact Us</h4>
          <p>
            <HiOutlineHome /> New Delhi, India, 248007
          </p>
          <p>
            <MdOutlineMail /> m0956870@gmail.com
          </p>
          <p>
            <IoIosCall /> +91-9876543210
          </p>
          <p>
            <FaFax /> +01 234 567 89
          </p>
        </div>
      </div>

      <div className="lower">
        <div className="copyright">&#169; 2022 Copyright By Manish</div>
        <div className="icons">
          <div className="icon">
            {/* <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0tbWDOV1GMSZDtBFEiAKjxTWpbJicWWZTzA&usqp=CAU"
              alt="fb"
            /> */}
            <RiFacebookCircleLine />
          </div>
          <div className="icon">
            {/* <img
              src="https://prod-cdn-03.storenvy.com/product_photos/94711105/file_fec9f9cd7d_original.png"
              alt="insta"
            /> */}
            <AiOutlineInstagram />
          </div>
          <div className="icon">
            {/* <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMUZpSqWDzo2aBAFN3lDM1FCsQyY302dBkcg&usqp=CAU"
              alt="twitter"
            /> */}
            <RiTwitterLine />
          </div>
          <div className="icon">
            {/* <img
              src="https://cdn-icons-png.flaticon.com/512/124/124034.png"
              alt="whatsapp"
            /> */}
            <RiWhatsappLine />
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 12rem;
  width: 100%;
  background: #000;
  padding: 1.5rem 1.5rem 0 1.5rem;
  .upper {
    height: 80%;
    width: 100%;
    border-bottom: 1px solid grey;
    display: flex;
    justify-content: space-between;
    align-items: start;
    div {
      height: 100%;
      width: 24%;
      ${'' /* border: 1px solid white; */}
      h4 {
        color: #fff;
        margin-bottom: 0.5rem;
      }
      p {
        color: lightgrey;
        font-size: 0.75rem;
        margin: 0.3rem 0;
        svg {
            height: 100%;
            margin: auto auto;
          font-size: 0.8rem;
          color: #fff;
        }
      }
    }
  }

  .lower {
    height: 20%;
    width: 100%;
    ${"" /* background: orange; */}
    ${"" /* border: 1px solid grey; */}
    display: flex;
    justify-content: space-between;
    align-items: center;

    .copyright {
      width: 50%;
      color: #fff;
      font-size: 0.9rem;
    }
    .icons {
      width: 50%;
      display: flex;
      justify-content: end;
      align-items: center;
      gap: 0.5rem;
      svg {
        height: 100%;
        width: 100%;
        color: #fff;
      }
      .icon {
        height: 1.5rem;
        width: 1.5rem;
        background: #000;
        border-radius: 50%;
        img {
          height: 100%;
          width: 100%;
          border-radius: 50%;
        }
      }
    }
  }
`;

export default Footer;
