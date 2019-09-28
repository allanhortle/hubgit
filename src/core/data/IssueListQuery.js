export default `
query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    issues(first: 50, orderBy: {field: CREATED_AT, direction: DESC}) {
      edges {
        node {
          id
          number
          title
          state
          createdAt
          updatedAt
        }
      }
    }
  }
}
`;
