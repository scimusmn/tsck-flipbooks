/* eslint no-console: 0 */
import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import SwiperCore, { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useIdleTimer } from 'react-idle-timer';
import Video from '../../components/Video';

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

SwiperCore.use([Pagination, Navigation]);

export const slideTypes = graphql`
  fragment SlideTypes on ContentfulSlideContentfulTitleSlideUnion {
    ... on ContentfulTitleSlide {
      __typename
      id
      title
    }
    ... on ContentfulSlide {
      __typename
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
`;

export const pageQuery = graphql`
  fragment FlipbookFragment on ContentfulFlipbook {
    slug
    inactivityTimeout
    slides {
      ...SlideTypes
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

  // Array of multi-locale slides
  const slides = enContent.slides.map((slide, i) => ({
    en: enContent.slides[i],
    ar: arContent.slides[i],
  }));

  // Inactivity timeout
  const { inactivityTimeout } = enContent;
  useIdleTimer({
    timeout: 1000 * inactivityTimeout,
    debounce: 500,
    startOnMount: false,
    onIdle: () => window.location.reload(false),
  });

  const getAltText = (altObj) => {
    if (altObj) return altObj.altText;
    return 'Image';
  };

  const renderTitleSlide = (slide) => (
    <SwiperSlide key={slide.en.id} className="title-slide">
      <div className="separator" />
      {Object.keys(slide).map((locale) => (
        <h1 className={locale} key={locale}>{slide[locale].title}</h1>
      ))}
    </SwiperSlide>
  );

  const renderSlides = slides.map((slide) => {
    // eslint-disable-next-line no-underscore-dangle
    if (slide.en.__typename === 'ContentfulTitleSlide') return renderTitleSlide(slide);

    return (
      <SwiperSlide key={slide.en.id}>
        {({ isActive }) => (
          <div>
            {/* Title and body for each locale */}
            {Object.keys(slide).map((locale) => (
              <div className={locale} key={locale}>
                <h2>{(slide[locale].title && slide[locale].title) || null}</h2>
                <div className="separator" />
                <div className="body">
                  {(slide[locale].body && renderRichText(slide[locale].body)) || null}
                </div>
              </div>
            ))}
            {/* Media */}
            {slide.en.media && (
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
            )}
          </div>
        )}
      </SwiperSlide>
    );
  });

  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      centeredSlides
      navigation
      direction="vertical"
      pagination={{
        clickable: true,
      }}
      className={enContent.slug}
    >
      {renderSlides}
    </Swiper>
  );
};

Flipbook.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default Flipbook;
