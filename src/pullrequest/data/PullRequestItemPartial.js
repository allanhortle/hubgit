//@flow
const idDate = `
id
createdAt
`;
import TimelineItemsPartial from '../../core/data/TimelineItemsPartial';
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
        ${TimelineItemsPartial([
        'PullRequestCommit',
        'HeadRefForcePushedEvent',
        'MergedEvent',
        'ClosedEvent',
        'ReopenedEvent',
        'HeadRefDeletedEvent',
        'ReferencedEvent',
        'CrossReferencedEvent' ,
        'LabeledEvent' ,
        'PullRequestReview',
        'PullRequestCommitCommentThread',
        'IssueComment',
        'RenamedTitleEvent',
        'ReviewRequestedEvent',
        'ReadyForReviewEvent',
        'PullRequestRevisionMarker'
        ])}
    }}
`;
