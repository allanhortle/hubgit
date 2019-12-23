// @flow
export default `
mutation CloseIssue($id: ID!) {
  closeIssue(input: {issueId: $id}) {
    issue {
      id
    }
  }
}
`;
