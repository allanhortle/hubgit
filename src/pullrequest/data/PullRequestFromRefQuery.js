// @flow
import PullRequestItemPartial from './PullRequestItemPartial';

export default `
query PullRequestFromRefQuery($owner: String!, $name: String!, $ref: String!) {
  repository(owner: $owner, name: $name) {
    ref(qualifiedName: $ref) {
      id
      associatedPullRequests(first:1) {
        nodes {
            ${PullRequestItemPartial}
        }
      }
    }
  }
}
`;
