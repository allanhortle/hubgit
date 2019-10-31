// @flow
export default `
query CommitItemQuery($id: ID!) {
    commitItem: node(id: $id) {
        id
        __typename
        ... on Commit {
                abbreviatedOid
                additions
                deletions
                authoredDate
                author {user {login}}
                authoredByCommitter
                changedFiles
                committedDate
                message
                messageBody
                messageHeadline
                oid
                tree {
                    id
                    entries {
                        name
                        type
                        object {
                            __typename
                            ... on Blob {
                                text
                            }
                        }
                    }
                }
            }
    }
}
`;
