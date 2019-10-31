// @flow
import {EntityApi} from 'react-enty';
import ApplicationSchema from './ApplicationSchema';
import github from '../service/Github';
import PullQuery from '../pullrequest/data/PullQuery';
import PullListQuery from '../pullrequest/data/PullListQuery';
import IssueQuery from './data/IssueQuery';
import IssueListQuery from './data/IssueListQuery';
import ReleaseQuery from './data/ReleaseQuery';
import ReleaseListQuery from './data/ReleaseListQuery';

import PullRequestReviewQuery from '../pullrequest/data/PullRequestReviewQuery';
import PullRequestFromRefQuery from '../pullrequest/data/PullRequestFromRefQuery';

const takeFirst = (request) => {
    let current;
    return async (...args) => {
        if(current) {
            return current.then(
                response => {
                    current = null;

                    return response;
                },
                err => {
                    current = null;
                    throw err;
                }
            );
        }
        current = request(...args);
        return current;
    };
};

const Api = EntityApi({
    repo: {
        pullItem: takeFirst((params) => github('pull', params, PullQuery)),
        pullList: takeFirst((params) => github('pullList', params, PullListQuery)),
        pullRequestReview: takeFirst((params) => github('pullRequestReview', params, PullRequestReviewQuery)),
        pullRequestFromRef: takeFirst((params) => github('pullRequestFromRef', params, PullRequestFromRefQuery)),
        issue: takeFirst((params) => github('issue', params, IssueQuery)),
        issueList: takeFirst((params) => github('issueList', params, IssueListQuery)),
        release: takeFirst((params) => github('release', params, ReleaseQuery)),
        releaseList: takeFirst((params) => github('releaseList', params, ReleaseListQuery)),

        //releases: takeFirst((params) => github('releaseList', params, `

        readme: takeFirst((params) => github('readme', params, `
query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
        object(expression: "master:README.md") {
            ... on Blob {
            text
            }
        }
    }
}
        `))

    }
}, ApplicationSchema);

export default Api;
