/* eslint no-console: 0 */
// import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
// import { GatsbyImage, getImage } from 'gatsby-plugin-image';
// import { renderRichText } from 'gatsby-source-contentful/rich-text';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import Video from '../../components/Video';

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

  console.log('enContent', enContent);
  console.log('arContent', arContent);
  // const { slides } = contentfulFlipbook;

  return null;

  // const getAltText = (altObj) => {
  //   if (altObj) return altObj.altText;
  //   return 'Image';
  // };

  // const renderSlides = slides.map((slide) => (
  //   <SwiperSlide key={slide.id}>
  //     {({ isActive }) => (
  //       <div>
  //         <h1>{slide.title}</h1>
  //         {renderRichText(slide.body)}
  //         {(slide.media.media.file.contentType).includes('image') && (
  //         <GatsbyImage
  //           image={getImage(slide.media.media)}
  //           alt={getAltText(slide.media.altText)}
  //           loading="eager"
  //         />
  //         )}
  //         {(slide.media.media.file.contentType).includes('video') && (
  //         <Video src={slide.media.media.file.url} active={isActive} />
  //         )}
  //         <pre>{slide.media.credit}</pre>
  //       </div>
  //     )}
  //   </SwiperSlide>
  // ));

  // return (
  //   <>
  //     <Swiper
  //       spaceBetween={0}
  //       slidesPerView={1}
  //       centeredSlides
  //     >
  //       {renderSlides}
  //     </Swiper>
  //   </>
  // );
};

Flipbook.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default Flipbook;
