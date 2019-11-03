// @flow
export default `
query ($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    pullRequests(first: 50, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          id
          number
          title
          state
          updatedAt
          author {login}
          baseRefName
          headRefName
          timelineItems {
            totalCount
          }
          comments {
            totalCount
          }
          reviewThreads(first: 100) {
            totalCount
            nodes {
              comments {totalCount}
            }
          }
        }
    }
  }
}
`;
