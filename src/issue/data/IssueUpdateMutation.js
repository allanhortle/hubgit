// @flow
export default `
mutation UpdateIssue($input: UpdateIssueInput!) {
  updateIssue(input: $input) {
    clientMutationId
  }
}
`;
