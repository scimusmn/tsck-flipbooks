import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allSitePage(sort: {fields: path, order: ASC}) {
        edges {
          node {
            path
          }
        }
      }
    }
  `);

  const { allSitePage } = data;

  return (
    <>
      <h1>TSCK Flipbooks</h1>
      <ul>
        {allSitePage.edges.map((edge) => (
          <li key={edge.node.path}>
            <Link to={edge.node.path}>{edge.node.path}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default IndexPage;
