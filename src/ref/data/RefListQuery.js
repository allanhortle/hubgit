//@flow
export default `
query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    refs(refPrefix: "refs/heads/", last:100) {
      nodes {
        name
      }
    }
  }
}
`;
