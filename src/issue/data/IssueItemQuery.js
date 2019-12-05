// @flow
import TimelineItemsPartial from '../../core/data/TimelineItemsPartial';
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
        assignees { nodes {
            id
            login
        }}
        timelineItems(last: 100) { nodes {
            __typename
            ${TimelineItemsPartial([
        'ClosedEvent',
        'ReopenedEvent',
        'ReferencedEvent',
        'CrossReferencedEvent' ,
        'LabeledEvent' ,
        'IssueComment',
        'RenamedTitleEvent'
    ])}
        }}
        labels(first: 10) { nodes {
            id
            color
            name
        }}
    }
  }
}
`;
