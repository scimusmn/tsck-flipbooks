const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, './src/components'),
        '@styles': path.resolve(__dirname, './src/styles'),
      },
    },
  });
};

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // language=GraphQL <- Enables code formatting for Gatsby's unique GraphQL function
  const {
    // Query Contentful content types that render to a page
    // The slug field is the bare minimum required for page creation
    data: {
      allFlipbooks,
      allLocales,
    },
  } = await graphql(`
    {
      allFlipbooks: allContentfulFlipbook {
        edges {
          node {
            slug
            node_locale
          }
        }
      }
      allLocales: allContentfulLocale {
        edges {
          node {
            code
            name
            default
          }
        }
      }
    }
  `);

  // TEMP - This var would come from the query above
  // If LANGUAGE_MODE is 'toggle', create a page for each locale
  // If LANGUAGE_MODE is 'single', create a page for the default locale
  // and load all other locales into the page
  const LANGUAGE_MODE = 'toggle'; // 'toggle' or 'single'

  const allLocaleCodes = allLocales.edges.map(({ node }) => node.code);
  console.log('allLocaleCodes:', allLocaleCodes);

  // Define how and where we create pages by pairing
  // Content Types to templates and slug prefixes.
  const pageTypes = [
    {
      entries: allFlipbooks.edges,
      slugPrefix: '/',
      template: './src/templates/Flipbook/index.js',
    },
  ];

  pageTypes.forEach((pageType) => {
    pageType.entries.forEach(({ node }) => {
      // Only create pages when slug is present
      if (node.slug !== null) {
        if (LANGUAGE_MODE === 'toggle') {
          createPage({
            component: path.resolve(pageType.template),
            context: {
              slug: node.slug,
              locales: [node.node_locale],
              toggleLocales: allLocaleCodes.filter((code) => code !== node.node_locale),
            },
            path: `${pageType.slugPrefix + node.node_locale}/${node.slug}`,
          });
        } else if (LANGUAGE_MODE === 'single') {
          createPage({
            component: path.resolve(pageType.template),
            context: {
              slug: node.slug,
              locales: allLocaleCodes,
            },
            path: `${pageType.slugPrefix + node.slug}`,
          });
        }
      }
    });
  });
};
