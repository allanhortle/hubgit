// @flow
export default `
mutation ReopenIssue($id: ID!) {
  reopenIssue(input: {issueId: $id}) {
    issue {
      id
    }
  }
}
`;
