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
    repo: {owner: string, name: string}
};
export default function PullItem(props: Props) {
    const {viewIndex} = props;
    const {owner, name} = props.repo;

    const message = Api.repo.pullItem.useRequest();

    useEffect(() => {
        message.onRequest({number: parseInt(viewIndex), owner, name});
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

