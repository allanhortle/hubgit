// @flow
export default `
mutation ReopenPullRequest($id: ID!) {
  reopenPullRequest(input: {pullRequestId: $id}) {
    pullRequest {
      id
    }
  }
}
`;
