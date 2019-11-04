// @flow
export default `
query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    issues(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) { nodes {
        id
        number
        title
        state
        createdAt
        updatedAt
        labels(last: 10) { nodes {
            name
            color
        }}
      }
    }
  }
}
`;
