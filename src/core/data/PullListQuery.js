export default `
query ($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    pullRequests(first: 50, orderBy: {field: UPDATED_AT, direction: DESC}) {
      edges {
        node {
          id
          number
          title
          state
          updatedAt
          timelineItems {
            totalCount
          }
          comments {
            totalCount
          }
        }
      }
    }
  }
}
`;
