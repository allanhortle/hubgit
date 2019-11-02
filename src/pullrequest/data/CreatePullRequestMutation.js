// @flow
export default `
mutation CreatePullRequestMutation($input: CreatePullRequestInput!) {
  createPullRequest(input: $input) {
    clientMutationId
  }
}
`;
