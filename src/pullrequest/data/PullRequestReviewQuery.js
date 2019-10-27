export default `
query PullRequestReviewQuery($id: ID!) {
  pullRequestReview: node(id: $id) {
    id
    __typename
    ... on PullRequestReview {
      author {login}
      comments(last: 100) {
        edges {
          node {
            __typename
            author {login}
            body
            createdAt
            diffHunk
            id
            outdated
            path
          }
        }
      }
    }
  }
}
`;
