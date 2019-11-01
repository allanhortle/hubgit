// @flow
export default `
query CommitItemQuery($id: ID!) {
    commitItem: node(id: $id) {
        id
        __typename
        ... on Commit {
                abbreviatedOid
                additions
                author {email, name, date}
                changedFiles
                committer {email, name, date}
                deletions
                message
                messageBody
                messageHeadline
                oid
                url
            }
    }
}
`;
