// @flow

const idDate = `
id
createdAt
`;

export default function TimelineItemsPartial(types: Array<string>): string {
    const typeMap = {
        PullRequestCommit: `... on PullRequestCommit {
            commit {
                id
                committedDate
                authoredDate
                author {user {login}}
                message
                oid
            }
        }`,
        HeadRefForcePushedEvent: `... on HeadRefForcePushedEvent {
            ${idDate}
            ref {name}
            beforeCommit {abbreviatedOid}
            afterCommit {abbreviatedOid}
            actor {login}
        }`,
        MergedEvent: `... on MergedEvent {
            ${idDate}
            mergeRefName
            commit {abbreviatedOid}
            actor {login}
        }`,
        ClosedEvent: `... on ClosedEvent {
            ${idDate}
            actor {login}
        }`,
        ReopenedEvent: `... on ReopenedEvent {
            ${idDate}
            actor {login}
        }`,
        HeadRefDeletedEvent: `... on HeadRefDeletedEvent {
            actor {login}
            ${idDate}
            headRefName
        }`,
        ReferencedEvent: `... on ReferencedEvent {
            actor {login}
            ${idDate}
            commit {message}
        }`,
        CrossReferencedEvent: `... on CrossReferencedEvent  {
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
        }`,
        LabeledEvent: `... on LabeledEvent  {
            ${idDate}
            actor {login}
            label {
            color
            name
            }
        }`,
        PullRequestReview: `... on PullRequestReview {
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
        }`,
        PullRequestCommitCommentThread: `... on PullRequestCommitCommentThread {
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
        }`,
        IssueComment: `... on IssueComment {
            ${idDate}
            body
            author {login}
        }`,
        RenamedTitleEvent: `... on RenamedTitleEvent {
            ${idDate}
            actor {login}
            previousTitle
            currentTitle
        }`,
        ReviewRequestedEvent: `... on ReviewRequestedEvent {
            ${idDate}
            actor {login}
            requestedReviewer {
                ... on User {login}
            }
        }`,
        ReadyForReviewEvent: `... on ReadyForReviewEvent {
            ${idDate}
            actor {login}
        }`,
        PullRequestRevisionMarker: `... on PullRequestRevisionMarker {
            createdAt
        }`
    };

    return types.map(ii => typeMap[ii]).join('\n');
}
