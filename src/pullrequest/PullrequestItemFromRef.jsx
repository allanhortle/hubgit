// @flow
import React, {useEffect} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import getIn from 'unmutable/lib/getIn';
import pipe from 'unmutable/lib/util/pipe';
import {maybePipe} from 'unfunctional';
import PullRequest from './data/PullRequest';
import Ref from '../ref/data/Ref';
import PullRequestItemStructure from './PullRequestItemStructure';
import PullRequestCreate from './PullRequestCreate';

type Props = {
    repo: {owner: string, name: string, ref: Ref}
};
export default function PullrequestItemFromRef(props: Props) {
    const {repo} = props;
    const {owner, name, ref} = repo;

    const message = Api.repo.pullRequestFromRef.useRequest();

    useEffect(() => {
        message.onRequest({owner, name, ref: ref.prefix + ref.name});
    }, []);



    return <LoadingBoundary message={message}>
        {pipe(
            maybePipe(
                getIn(['repository', 'ref', 'associatedPullRequests', 'nodes', 0]),
                _ => new PullRequest(_),
                pullRequest => <PullRequestItemStructure pullRequest={pullRequest} />
            ),
            (structure) => {
                const {id} = message.response.repository;
                return structure || <PullRequestCreate reference={ref} id={id} />;
            }
        )}
    </LoadingBoundary>;
}

