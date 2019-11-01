// @flow
export default `
mutation ClosePullRequest($id: ID!) {
  closePullRequest(input: {pullRequestId: $id}) {
    pullRequest {
      id
    }
  }
}
`;
