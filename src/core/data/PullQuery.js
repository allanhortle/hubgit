export default `
query ($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      id
      number
      title
      state
      createdAt
      updatedAt
      url
      author {
        login
      }
      additions
      deletions
      timelineItems(last: 50, itemTypes: [PULL_REQUEST_REVIEW, ISSUE_COMMENT]) {
        edges {
          node {
            __typename
            ... on PullRequestReview {
              id
              state
              createdAt
              body
              author {
                login
              }
              comments(last: 20) {
                edges {
                  node {
                    id
                    __typename
                    diffHunk
                    outdated
                    path
                    author {
                      login
                    }
                    createdAt
                    body
                  }
                }
              }
            }
            ... on IssueComment {
              id
              body
              createdAt
              author {
                login
              }
            }
          }
        }
      }
    }
  }
}
`;
