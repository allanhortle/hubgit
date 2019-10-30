import PullRequestItemPartial from './PullRequestItemPartial';
export default `
query ($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name) {
        pullRequest(number: $number) {
            ${PullRequestItemPartial}
        }
    }
}
`;
