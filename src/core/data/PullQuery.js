export default `
query ($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name) {
        pullRequest(number: $number) {
            additions
            author {login}
            baseRefName
            body
            createdAt
            deletions
            headRefName
            id
            number
            state
            title
            updatedAt
            url
            timelineItems(last: 50, itemTypes: [PULL_REQUEST_REVIEW, ISSUE_COMMENT]) {
                edges { node {
                    __typename
                    ... on PullRequestReview {
                        id
                        state
                        createdAt
                        body
                        author {login}
                        comments(last: 21) {
                            edges { node {
                                id
                                __typename
                                diffHunk
                                outdated
                                path
                                author {login}
                                createdAt
                                body
                            }}
                        }
                    }
                    ... on IssueComment {
                        id
                        body
                        createdAt
                        author {login}
                    }
                }}
            }
        }
    }
}
`;
