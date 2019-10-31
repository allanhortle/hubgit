// @flow
import React, {useEffect} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import getIn from 'unmutable/lib/getIn';
import pipe from 'unmutable/lib/util/pipe';
import PullRequest from './data/PullRequest';
import PullRequestItemStructure from './PullRequestItemStructure';

type Props = {
    repo: {owner: string, name: string, ref: string}
};
export default function PullrequestItemFromRef(props: Props) {
    const {repo} = props;
    const {owner, name, ref} = repo;

    const message = Api.repo.pullRequestFromRef.useRequest();

    useEffect(() => {
        message.onRequest({owner, name, ref});
    }, []);


    return <LoadingBoundary message={message}>
        {pipe(
            getIn(['repository', 'ref', 'associatedPullRequests', 'nodes', 0]),
            _ => new PullRequest(_),
            pullRequest => <PullRequestItemStructure pullRequest={pullRequest} />
        )}
    </LoadingBoundary>;
}

