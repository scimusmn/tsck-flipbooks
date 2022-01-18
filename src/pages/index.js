import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allSitePage(
        filter: {path: {nin: ["/", "/404.html", "/404.html", "/404/", "/dev-404-page/"]}},
        sort: {fields: path, order: ASC}) {
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
    <div style={{ padding: '15% 15%' }}>
      <h1>TSCK Flipbooks</h1>
      <ul>
        {allSitePage.edges.map((edge) => (
          <li key={edge.node.path}>
            <Link to={edge.node.path}>
              <h2>{edge.node.path}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndexPage;
