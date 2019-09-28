export default `
query($owner: String!, $name: String!, $tagName: String!) {
  repository(owner: $owner, name: $name) {
    release(tagName: $tagName) {
        id
        createdAt
        updatedAt
        isDraft
        isPrerelease
        url
        author {login}
        tagName
        tag {id}
        name
        description
        publishedAt
    }
  }
}
`;
