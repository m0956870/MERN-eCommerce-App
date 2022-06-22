import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

// import Carousel from "react-elastic-carousel";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const CategoryCarousel = ({ product }) => {
  // console.log(product);

  // const breakPoints = [
  //   {width: 300, itemsToShow: 1},
  //   {width: 600, itemsToShow: 3},
  //   {width: 900, itemsToShow: 6},
  //   {width: 1200, itemsToShow: 8},
  // ]

  const responsive = {
    xl: {
      breakpoint: { max: 2000, min: 900 },
      items: 6,
    },
    lg: {
      breakpoint: { max: 900, min: 700 },
      items: 5,
    },
    md: {
      breakpoint: { max: 700, min: 500 },
      items: 4,
    },
    sm: {
      breakpoint: { max: 500, min: 300 },
      items: 2,
    },
    xs: {
      breakpoint: { max: 300, min: 0 },
      items: 1,
    },
  };

  return (
    <Container>
      <Carousel
        // swipeable={true}
        draggable={true}
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={1500}
        // showDots={true}
        // keyBoardControl={true}
        // customTransition="all .5"
        // transitionDuration={500}
        // containerClass="carousel-container"
        // removeArrowOnDeviceType={["tablet", "mobile"]}
        // dotListClass="custom-dot-list-style"
        // itemClass="carousel-item-padding-40-px"
      >
        {product.map((item) => (
          <>
            <div className="product">
              {item && (
                <div className="item">
                  <NavLink
                    to={`/product/${item._id}`}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    <div className="image">
                      <img src={item.image} alt="image" />
                    </div>
                    <div className="detail">
                      <div className="title"> {item.title} </div>
                      <div className="desc">
                        {item.description.slice(0, 15)}...
                      </div>
                    </div>
                  </NavLink>
                </div>
              )}
            </div>
          </>
        ))}
      </Carousel>
    </Container>
  );
};

const Container = styled.div`
  height: 12rem;
  width: auto;
  ${"" /* background: lightgrey; */}
  .product {
    height: 12rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
      height: 100%;
      width: 100%;
      margin: 0 0.5rem;
      padding: 0.3rem 0 0.5rem 0;
      border: 1px solid lightgrey;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .image {
        min-height: 10rem;
        max-height: 10rem;
        width: 100%;
        img {
          min-height: 9rem;
          max-height: 9rem;
          width: 100%;
        }
      }
      .detail {
        height: 15%;
        width: 100%;
        .title {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50%;
          width: 100%;
          font-size: 0.7rem;
          font-weight: bold;
          margin: 0.1rem 0;
          margin-bottom: 0;
        }
        .desc {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50%;
          width: 100%;
          color: grey;
          font-size: 0.7rem;
        }
      }
    }
  }
`;

export default CategoryCarousel;
