import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

export const pageQuery = graphql`
  query ($slug: String!) {
    contentfulFlipbook(slug: { eq: $slug }) {
        slug
    }
  }
`;

const Flipbook = ({ data }) => {
  const { contentfulFlipbook } = data;
  const { slug } = contentfulFlipbook;

  return (
    <>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides
      >
        <SwiperSlide>
          Slide 1--
          {slug}
        </SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
      </Swiper>
    </>
  );
};

Flipbook.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default Flipbook;
