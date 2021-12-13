/* eslint no-console: 0 */
import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import { Swiper, SwiperSlide } from 'swiper/react';
import Video from '../../components/Video';

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

export const pageQuery = graphql`
  fragment FlipbookFragment on ContentfulFlipbook {
    slides {
      id
      title
      body {
        raw
      }
      media {
        credit
        altText {
          altText
        }
        media {
          file {
            contentType
            url
          }
          gatsbyImageData(
            width: 250
            layout: FIXED
            placeholder: BLURRED
          )
        }
      }
    }
  } 
  query ($slug: String!) {
    enContent:contentfulFlipbook(
      node_locale: {eq:"en-US"},
      slug: { eq: $slug }) {
        ...FlipbookFragment
      }
    arContent:contentfulFlipbook(
      node_locale: {eq:"ar"},
      slug: { eq: $slug }) {
        ...FlipbookFragment
      }
  }
`;

const Flipbook = ({ data }) => {
  const { enContent, arContent } = data;

  // Construct slide array containing both languages
  const slides = enContent.slides.map((slide, i) => ({ en: slide, ar: arContent.slides[i] }));

  const getAltText = (altObj) => {
    if (altObj) return altObj.altText;
    return 'Image';
  };

  const renderSlides = slides.map((slide) => (
    <SwiperSlide key={slide.en.id}>
      {({ isActive }) => (
        <div>
          <h1>{slide.en.title}</h1>
          <h2>{slide.ar.title}</h2>
          {renderRichText(slide.en.body)}
          {renderRichText(slide.ar.body)}
          {(slide.en.media.media.file.contentType).includes('image') && (
            <GatsbyImage
              image={getImage(slide.en.media.media)}
              alt={getAltText(slide.en.media.altText)}
              loading="eager"
            />
          )}
          {(slide.en.media.media.file.contentType).includes('video') && (
            <Video src={slide.en.media.media.file.url} active={isActive} />
          )}
          <pre>{slide.en.media.credit}</pre>
        </div>
      )}
    </SwiperSlide>
  ));

  return (
    <>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides
      >
        {renderSlides}
      </Swiper>
    </>
  );
};

Flipbook.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default Flipbook;
