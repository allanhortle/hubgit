// @flow
export default `
query RepoItemQuery($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    id
    assignableUsers(first: 10) {
      nodes {
        id
        login
      }
    }
    labels(first: 100) {
      nodes {
        id
        color
        name
      }
    }
  }
}
`;
