import React from 'react'
import styled from "styled-components";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const BannerImage = () => {

    const responsive = {
      superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 1,
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
      },
    };
    return (
      <Container>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={2000}
        >
          <img
            src="https://previews.123rf.com/images/pattarasin/pattarasin1608/pattarasin160800029/61300199-sale-banner-template-80-off-vector-concept-of-online-shop.jpg"
            alt="banner"
          />
          <img
            src="https://img.freepik.com/free-vector/black-friday-super-sale-with-balloon-social-media-online-shop-banner-promotion-template-design_7102-570.jpg?w=2000"
            alt="banner"
          />
          <img
            src="https://png.pngtree.com/thumb_back/fw800/background/20201010/pngtree-black-friday-sale-background-design-template-banner-discount-vector-poster-business-image_407567.jpg"
            alt="banner"
          />
          <img
            src="https://images.indianexpress.com/2022/05/Amazon-summer-sale-2022-tech-deals-featured-1.jpg"
            alt="banner"
          />
        </Carousel>
      </Container>
    );
}

const Container = styled.div`
  width: 100%;
  ${'' /* border: 1px solid grey; */}
  padding: 2vh 2vh 0 2vh;
  img{
      width: 100%;
      height: 71vh;
  }
`;

export default BannerImage
