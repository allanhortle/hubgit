// @flow
import React, {useEffect} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import getIn from 'unmutable/lib/getIn';
import pipe from 'unmutable/lib/util/pipe';
import PullRequest from './data/PullRequest';
import PullRequestItemStructure from './PullRequestItemStructure';

type Props = {
    viewIndex: number,
    repo: {owner: string, name: string, viewIndex: number}
};
export default function PullItem(props: Props) {
    const {owner, name, viewIndex} = props.repo;

    const message = Api.repo.pullItem.useRequest();

    useEffect(() => {
        message.onRequest({number: viewIndex, owner, name});
    }, []);

    return <LoadingBoundary message={message}>
        {pipe(
            getIn(['repository', 'pullRequest']),
            _ => new PullRequest(_),
            pullRequest => <PullRequestItemStructure pullRequest={pullRequest} />
        )}
    </LoadingBoundary>;
}

PullItem.label = ({viewIndex, title}) => `#${viewIndex}${title ? ` ${title}` : ''}`;

