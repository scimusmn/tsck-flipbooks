/* eslint no-console: 0 */
import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import SwiperCore, {
  Pagination,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Video from '../../components/Video';

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
// import 'swiper/css/pagination';

// install Swiper modules
SwiperCore.use([Pagination]);

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

  // Use English for iterating over structure
  const { slides } = enContent;

  const getAltText = (altObj) => {
    if (altObj) return altObj.altText;
    return 'Image';
  };

  const renderSlides = slides.map((slide, i) => {
    const arSlide = arContent.slides[i];
    return (
      <SwiperSlide key={slide.id}>
        {({ isActive }) => (
          <div>
            {/* Arabic */}
            <div className="ar">
              <h2>{arSlide.title}</h2>
              {renderRichText(arSlide.body)}
            </div>
            {/* English */}
            <div className="en">
              <h2>{slide.title}</h2>
              {renderRichText(slide.body)}
            </div>
            {/* Media */}
            <div className="media">
              {
              (slide.media.media.file.contentType).includes('video')
                ? <Video src={slide.media.media.file.url} active={isActive} />
                : (
                  <GatsbyImage
                    image={getImage(slide.media.media)}
                    alt={getAltText(slide.media.altText)}
                    loading="eager"
                  />
                )
              }
              <pre>{slide.media.credit}</pre>
            </div>

          </div>
        )}
      </SwiperSlide>
    );
  });

  return (
    <>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides
        // navigation
        // direction="vertical"
        // pagination={{
        //   clickable: true,
        // }}
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
