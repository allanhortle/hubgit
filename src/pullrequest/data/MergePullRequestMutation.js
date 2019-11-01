// @flow
export default `
mutation MergePullRequest($id: ID!, $method: PullRequestMergeMethod) {
  mergePullRequest(input: {pullRequestId: $id, mergeMethod: $method}) {
    pullRequest {
      id
    }
  }
}
`;
