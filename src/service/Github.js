// @flow
import Octokit from '@octokit/rest';

const github = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`
});


export default github;

