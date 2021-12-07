import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';

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
      <pre>Flipbook template page</pre>
      <h1>{slug}</h1>
    </>
  );
};

Flipbook.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default Flipbook;
