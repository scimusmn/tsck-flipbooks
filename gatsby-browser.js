/* eslint-disable import/prefer-default-export */
// Don't require a default export. Gatsby's API can't support it here.
import PropTypes from 'prop-types';
import React from 'react';

import '@fontsource/open-sans';
import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/tajawal';
import '@fontsource/tajawal/300.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';
import '@fontsource/montserrat';
import '@fontsource/montserrat/500.css';

import './src/styles/index.css';

export const wrapRootElement = ({ element }) => <>{element}</>;

wrapRootElement.propTypes = {
  element: PropTypes.element.isRequired,
};
