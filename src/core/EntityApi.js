// @flow
import {EntityApi} from 'react-enty';
import ApplicationSchema from './ApplicationSchema';
import {graphql as github} from '../service/Github';
import {diff} from '../service/Github';
import {rest} from '../service/Github';
import PullQuery from '../pullrequest/data/PullQuery';
import PullListQuery from '../pullrequest/data/PullListQuery';
import IssueQuery from '../issue/data/IssueItemQuery';
import IssueListQuery from '../issue/data/IssueListQuery';
import ReleaseQuery from './data/ReleaseQuery';
import ReleaseListQuery from './data/ReleaseListQuery';

import PullRequestReviewQuery from '../pullrequest/data/PullRequestReviewQuery';
import PullRequestFromRefQuery from '../pullrequest/data/PullRequestFromRefQuery';
import ReopenPullRequestMutation from '../pullrequest/data/ReopenPullRequestMutation';
import ClosePullRequestMutation from '../pullrequest/data/ClosePullRequestMutation';
import CreatePullRequestMutation from '../pullrequest/data/CreatePullRequestMutation';
import MergePullRequestMutation from '../pullrequest/data/MergePullRequestMutation';

import RefListQuery from '../ref/data/RefListQuery';

import CommitItemQuery from '../commit/data/CommitItemQuery';
import setIn from 'unmutable/setIn';
import pipeWith from 'unmutable/pipeWith';

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

const query = (nn, qq) => takeFirst((pp) => github(nn, pp, qq));

const straightQueries = [
    // repo
    ['repo.pullItem', PullQuery],
    ['repo.pullList', PullListQuery],
    ['repo.pullRequestReview', PullRequestReviewQuery],
    ['repo.pullRequestFromRef', PullRequestFromRefQuery],

    // Releases
    ['release.item', ReleaseQuery],
    ['release.list', ReleaseListQuery],

    // Refs
    ['ref.list', RefListQuery],

    // Issues
    ['issue.item', IssueQuery],
    ['issue.list', IssueListQuery],


    // Pull Requests
    ['pullRequest.create', CreatePullRequestMutation],
    ['pullRequest.close', ClosePullRequestMutation],
    ['pullRequest.reopen', ReopenPullRequestMutation],
    ['pullRequest.merge', MergePullRequestMutation],

    // commit
    ['commitItem', takeFirst(async (props) => {
        const {id, owner, name, oid} = props;
        const [commitItem, diffText] = await Promise.all([
            github('commitItem', {id}, CommitItemQuery),
            diff(`repos/${owner}/${name}/commits/${oid}`)
        ]);
        return setIn(['commitItem', 'diff'], diffText)(commitItem);
    })]
];

const Api = EntityApi(
    pipeWith(
        {},
        ...straightQueries.map(([name, qq]) => setIn(
            name.split('.'),
            typeof qq === 'string' ? query(name, qq) : qq
        )),
    ),
    ApplicationSchema
);

export default Api;
