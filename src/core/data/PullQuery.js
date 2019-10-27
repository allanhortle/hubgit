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
            timelineItems(last: 100) {
                edges { node {
                    __typename
                    ... on PullRequestCommit {
                      commit {
                        id
                        committedDate
                        authoredDate
                        author {user {login}}
                        message
                        oid
                      }
                    }
                    ... on HeadRefForcePushedEvent {
                      createdAt
                      ref {name}
                      beforeCommit {abbreviatedOid}
                      afterCommit {abbreviatedOid}
                      actor {login}
                    }
                    ... on MergedEvent {
                      createdAt
                      mergeRefName
                      commit {abbreviatedOid}
                      actor {login}
                    }
                    ... on ClosedEvent {
                      createdAt
                      actor {login}
                    }
                    ... on ReopenedEvent {
                      createdAt
                      actor {login}
                    }
                    ... on HeadRefDeletedEvent {
                      actor {login}
                      createdAt
                      headRefName
                    }
                    ... on ReferencedEvent {
                      actor {login}
                      createdAt
                      commit {message}
                    }
                    ... on CrossReferencedEvent  {
                      actor {login}
                      createdAt
                      source {
                        ... on PullRequest {
                          title
                          url
                        }
                        ... on Issue {
                          title
                          url
                        }
                      }
                    }
                    ... on LabeledEvent  {
                      createdAt
                      actor {login}
                      label {
                        color
                        name
                      }
                    }
                    ... on PullRequestReview {
                        id
                        state
                        createdAt
                        body
                        author {login}
                        comments(last: 100) {
                            totalCount
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
                    ... on PullRequestCommitCommentThread {
                        commit {
                            authoredDate
                            abbreviatedOid
                            message
                        }
                        comments(first:100) {
                            totalCount
                            edges { node {
                                createdAt
                                author {login}
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
                    ... on RenamedTitleEvent {
                        createdAt
                        actor {login}
                        previousTitle
                        currentTitle
                    }
                    ... on ReviewRequestedEvent {
                        createdAt
                        actor {login}
                        requestedReviewer {
                            ... on User {login}
                        }
                    }
                    ... on ReadyForReviewEvent {
                        createdAt
                        actor {login}
                    }

                    ... on PullRequestRevisionMarker {
                        createdAt
                    }
                }}
            }
        }
    }
}
`;
