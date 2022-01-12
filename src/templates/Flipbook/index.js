/* eslint no-console: 0 */
import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import SwiperCore, { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Video from '../../components/Video';

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

SwiperCore.use([Pagination, Navigation]);

export const pageQuery = graphql`
  fragment FlipbookFragment on ContentfulFlipbook {
    slug
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
          localFile {
            publicURL
            childImageSharp {
              gatsbyImageData(
                width: 950
                height: 1080
                layout: FIXED
                placeholder: BLURRED
              )
            }
          }
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

  // Create array of multi-locale slides
  const slides = enContent.slides.map((slide, i) => ({
    en: enContent.slides[i],
    ar: arContent.slides[i],
  }));

  const getAltText = (altObj) => {
    if (altObj) return altObj.altText;
    return 'Image';
  };

  const renderTitleSlide = (slide) => (
    <SwiperSlide key={slide.id}>
      <div className="title-slide">
        <div className="separator" />
        {/* Render title for each locale */}
        {Object.keys(slide).map((locale) => (
          <div className={locale} key={locale}>
            <h1>{slide[locale].title}</h1>
          </div>
        ))}
      </div>
    </SwiperSlide>
  );

  const renderSlides = slides.map((slide) => {
    // If only title field exists, render as a "Title Slide"
    const isTitleSlide = !slide.en.media && !slide.en.body;
    if (isTitleSlide) return (renderTitleSlide(slide));

    return (
      <SwiperSlide key={slide.id}>
        {({ isActive }) => (
          <div>
            {/* Render title/body for each locale */}
            {Object.keys(slide).map((locale) => (
              <div className={locale} key={locale}>
                <h2>{slide[locale].title}</h2>
                <div className="separator" />
                {renderRichText(slide[locale].body)}
              </div>
            ))}
            {/* Media */}
            <div className="media">
              {
              (slide.en.media.media.file.contentType).includes('video')
                ? <Video src={slide.en.media.media.localFile.publicURL} active={isActive} />
                : (
                  <GatsbyImage
                    image={getImage(slide.en.media.media.localFile)}
                    alt={getAltText(slide.en.media.altText)}
                    loading="eager"
                  />
                )
              }
              <span className="credit">{slide.en.media.credit}</span>
            </div>
          </div>
        )}
      </SwiperSlide>
    );
  });

  return (
    <div className={enContent.slug}>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides
        navigation
        direction="vertical"
        pagination={{
          clickable: true,
        }}
      >
        {renderSlides}
      </Swiper>
    </div>
  );
};

Flipbook.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default Flipbook;
