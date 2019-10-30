export default `
query PullRequestReviewQuery($id: ID!) {
  pullRequestReview: node(id: $id) {
    id
    __typename
    ... on PullRequestReview {
        author {login}
        pullRequest {
            reviewThreads(first:100) { nodes {
                comments(first:100) { nodes {
                    author {login}
                    body
                    createdAt
                    diffHunk
                    id
                    outdated
                    originalPosition
                    path
                    pullRequestReview {id}
                }}
            }}
        }
    }
  }
}
`;
