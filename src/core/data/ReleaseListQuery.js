// @flow
export default `
query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    releases(first: 50, orderBy: {field: CREATED_AT, direction: DESC}) {
      edges {
        node {
          id
          createdAt
          updatedAt
          tagName
          name
        }
      }
    }
  }
}
`;
