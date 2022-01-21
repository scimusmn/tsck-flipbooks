import React from 'react';
import {
  graphql, useStaticQuery, Link, navigate,
} from 'gatsby';

function toTitleCase(str) {
  const sentence = str.substring(1).toLowerCase().split('-');
  for (let i = 0; i < sentence.length; i += 1) {
    sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
  return sentence.join(' ');
}

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
    <div className="cards-container">
      <h1>TSCK Flipbooks</h1>
      {allSitePage.edges.map((edge, i) => (
        <div
          role="button"
          onClick={() => navigate(edge.node.path)}
          onKeyPress={() => navigate(edge.node.path)}
          tabIndex={i}
          className="card"
          key={edge.node.path}
        >
          <h1>📖</h1>
          <h2>{toTitleCase(edge.node.path)}</h2>
          <Link to={edge.node.path} key={edge.node.path}>
            {edge.node.path}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default IndexPage;
