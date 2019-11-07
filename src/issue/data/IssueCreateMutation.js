// @flow
export default `
mutation CreateIssue($input: CreateIssueInput!) {
  createIssue(input: $input) {
    clientMutationId
  }
}
`;
