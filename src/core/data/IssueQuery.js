export default `
query ($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    issue(number: $number) {
        id
        number
        title
        body
        state
        createdAt
        updatedAt
        url
        author {login}
        timelineItems(last: 50, itemTypes: [ISSUE_COMMENT]) {
        edges {
            node {
            __typename
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
        labels(first: 10) {
        edges {
            node {
            color
            name
            }
        }
      }
    }
  }
}
`;
