import React from 'react';
import PropTypes from 'prop-types';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import SwiperCore, {
  Pagination, Navigation,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

import Video from '../Video';
// import 'swiper/css/pagination';

// Install Swiper modules
SwiperCore.use([Pagination, Navigation]);

const SMMFlipbook = ({ data }) => {
  const { enContent, arContent } = data;

  // TODO: Can we make this locale agnostic?
  // Use "first" locale for structure instead of English

  // TODO: Can we make this configurable between toggable languages v dual language?

  // Use first locale (language) for structure
  const { slides } = enContent;
  const { accentColor } = enContent;

  const getAltText = (altObj) => {
    if (altObj) return altObj.altText;
    return 'Image';
  };

  const renderSlides = slides.map((slide, i) => {
    const arSlide = arContent.slides[i];
    return (
      <SwiperSlide key={slide.id} style={{ background: `radial-gradient(93.07% 84.18% at 100% 0%, ${accentColor} 0%, #0d003a 71.35%)` }}>
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
  );
};

SMMFlipbook.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default SMMFlipbook;
