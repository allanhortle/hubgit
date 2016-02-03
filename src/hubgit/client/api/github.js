import GitHubApi from 'github';

var github = new GitHubApi({
    version: "3.0.0",
});

github.authenticate({
    type: "oauth",
    token: process.env.HUBGIT_GITHUB_TOKEN
});

export default github;
