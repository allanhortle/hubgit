//@flow
const idDate = `
id
createdAt
`;
export default `
    ${idDate}
    additions
    author {login}
    baseRefName
    body
    deletions
    headRefName
    number
    state
    title
    updatedAt
    url
    reviewThreads(last: 100) { nodes {
        comments(last:100) { nodes {
            author {login}
            body
            createdAt
            diffHunk
            id
            outdated
            path
            pullRequestReview {id}
        }}
    }}
    timelineItems(last: 100) { nodes {
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
            ${idDate}
            ref {name}
            beforeCommit {abbreviatedOid}
            afterCommit {abbreviatedOid}
            actor {login}
        }
        ... on MergedEvent {
            ${idDate}
            mergeRefName
            commit {abbreviatedOid}
            actor {login}
        }
        ... on ClosedEvent {
            ${idDate}
            actor {login}
        }
        ... on ReopenedEvent {
            ${idDate}
            actor {login}
        }
        ... on HeadRefDeletedEvent {
            actor {login}
            ${idDate}
            headRefName
        }
        ... on ReferencedEvent {
            actor {login}
            ${idDate}
            commit {message}
        }
        ... on CrossReferencedEvent  {
            actor {login}
            ${idDate}
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
            ${idDate}
            actor {login}
            label {
            color
            name
            }
        }
        ... on PullRequestReview {
            ${idDate}
            state
            body
            author {login}
            url
            comments(last: 100) {
                totalCount
                nodes {
                    id
                    __typename
                    diffHunk
                    outdated
                    path
                    author {login}
                    createdAt
                    body
                }
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
                nodes {
                    createdAt
                    author {login}
                    body
                }
            }
        }
        ... on IssueComment {
            ${idDate}
            body
            author {login}
        }
        ... on RenamedTitleEvent {
            ${idDate}
            actor {login}
            previousTitle
            currentTitle
        }
        ... on ReviewRequestedEvent {
            ${idDate}
            actor {login}
            requestedReviewer {
                ... on User {login}
            }
        }
        ... on ReadyForReviewEvent {
            ${idDate}
            actor {login}
        }

        ... on PullRequestRevisionMarker {
            createdAt
        }
    }}
`;
