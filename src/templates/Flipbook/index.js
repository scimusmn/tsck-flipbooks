/* eslint no-console: 0 */
import React from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
// import { GatsbyImage, getImage } from 'gatsby-plugin-image';
// import { renderRichText } from 'gatsby-source-contentful/rich-text';
import SwiperCore, { Pagination, Navigation } from 'swiper';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { useIdleTimer } from 'react-idle-timer';
// import Video from '../../components/Video';

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
    node_locale
    slides {
      ...SlideTypes
    }
  } 
  query ($slug: String!, $locales: [String]) {
    allContentfulLocale {
      edges {
        node {
          code
          name
          default
        }
      }
    }
    allContentfulFlipbook(
      filter: {
        slug: { eq: $slug }
        node_locale: { in: $locales }
      }
    ) {
      edges {
        node {
          ...FlipbookFragment
        }
      }
    }
  }
`;

const Flipbook = ({ data, pageContext, location }) => {
  console.log('Page data:', data);
  console.log('Page context:', pageContext);
  console.log('Page location:', location);

  const localeNodes = data.allContentfulFlipbook.edges.map((edge) => edge.node);
  console.log('Locale nodes:', localeNodes);

  const localesInfo = data.allContentfulLocale.edges.map((edge) => edge.node);
  const otherLocales = localesInfo.filter((locale) => !pageContext.locales.includes(locale.code));
  console.log('localesInfo:', localesInfo);
  console.log('otherLocales:', otherLocales);

  const intlNames = new Intl.DisplayNames('en', { type: 'language', languageDisplay: 'dialect' });

  return (
    <div>
      {localeNodes.map((locale) => (
        <div key={locale.node_locale} className={locale.node_locale}>
          <h1>
            {intlNames.of(locale.node_locale)}
          </h1>
          {locale.slides.map((slide) => (
            <p key={slide.id}>{slide.title}</p>
          ))}
        </div>
      ))}
      { otherLocales && otherLocales.map((localeInfo) => (
        <Link
          key={localeInfo.code}
          to={`/${localeInfo.code}/${pageContext.slug}`}
          className={`locale-toggle ${localeInfo.code}`}
        >
          {intlNames.of(localeInfo.code)}
          {/* {localeInfo.name} */}
        </Link>
      ))}
    </div>
  );

  // Array of multi-locale slides
  // const slides = enContent.slides.map((slide, i) => ({
  //   en: enContent.slides[i],
  //   ar: arContent.slides[i],
  // }));

  // // Inactivity timeout
  // const { inactivityTimeout } = enContent;
  // useIdleTimer({
  //   timeout: inactivityTimeout * 1000,
  //   debounce: 500,
  //   startOnMount: false,
  //   onIdle: () => window.location.reload(false),
  // });

  // const getAltText = (altObj) => {
  //   if (altObj) return altObj.altText;
  //   return 'Image';
  // };

  // const renderTitleSlide = (slide) => (
  //   <SwiperSlide key={slide.en.id} className="title-slide">
  //     <div className="separator" />
  //     {Object.keys(slide).map((locale) => (
  //       <h1 className={locale} key={locale}>{slide[locale].title}</h1>
  //     ))}
  //   </SwiperSlide>
  // );

  // const renderSlides = slides.map((slide) => {
  //   // eslint-disable-next-line no-underscore-dangle
  //   if (slide.en.__typename === 'ContentfulTitleSlide') return renderTitleSlide(slide);

  //   return (
  //     <SwiperSlide key={slide.en.id}>
  //       {({ isActive }) => (
  //         <div>
  //           {/* Title and body for each locale */}
  //           {Object.keys(slide).map((locale) => (
  //             <div className={`${locale} text-container`} key={locale}>
  //               <h2>{(slide[locale].title && slide[locale].title) || null}</h2>
  //               <div className="separator" />
  //               <div className="body">
  //                 {(slide[locale].body && renderRichText(slide[locale].body)) || null}
  //               </div>
  //             </div>
  //           ))}
  //           {/* Media */}
  //           {(slide.en.media && slide.en.media.media) && (
  //             <div className="media">
  //               {
  //               (slide.en.media.media.file.contentType).includes('video')
  //                 ? <Video src={slide.en.media.media.localFile.publicURL} active={isActive} />
  //                 : (
  //                   <GatsbyImage
  //                     image={getImage(slide.en.media.media.localFile)}
  //                     alt={getAltText(slide.en.media.altText)}
  //                     loading="eager"
  //                   />
  //                 )
  //               }
  //               <span className="credit">{slide.en.media.credit}</span>
  //             </div>
  //           )}
  //         </div>
  //       )}
  //     </SwiperSlide>
  //   );
  // });

  // return (
  //   <Swiper
  //     spaceBetween={0}
  //     slidesPerView={1}
  //     centeredSlides
  //     navigation
  //     direction="vertical"
  //     pagination={{
  //       clickable: true,
  //     }}
  //     className={enContent.slug}
  //   >
  //     {renderSlides}
  //   </Swiper>
  // );
};

Flipbook.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
  pageContext: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Flipbook;
