/* eslint-disable import/prefer-default-export */
// Don't require a default export. Gatsby's API can't support it here.
import PropTypes from 'prop-types';
import React from 'react';

import '@fontsource/open-sans';
import '@fontsource/tajawal';
import '@fontsource/montserrat';

import './src/styles/index.css';

export const wrapRootElement = ({ element }) => <>{element}</>;

wrapRootElement.propTypes = {
  element: PropTypes.element.isRequired,
};
