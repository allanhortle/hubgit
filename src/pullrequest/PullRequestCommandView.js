// @flow
import React, {useEffect} from 'react';
import Api from '../core/EntityApi';
import PullRequestCommandStructure from './PullRequestCommandStructure';
import {useCoreContext} from '../core/CoreContext';
import PullRequest from './data/PullRequest';

type Props = {
    pullRequest: PullRequest
};
export default function PullRequestCommandView(props: Props) {
    const {pullRequest} = props;
    const {id} = pullRequest;
    const {screen, popStack} = useCoreContext();

    const close = Api.pullRequest.close.useRequest();
    const reopen = Api.pullRequest.reopen.useRequest();
    const merge = Api.pullRequest.merge.useRequest();

    const actionPop = (action, payload) => () => action.onRequest(payload).then(popStack);

    const commands = [
        {row: ['m', 'Merge'], action: actionPop(merge, {id})},
        {row: ['a', 'Review - Approve'], action: () => {}},
        {row: ['r', 'Review - Request changes'], action: () => {}},
        {row: ['C', 'Review - Comment'], action: () => {}},
        {row: ['x', 'Close'], action: actionPop(close, {id})},
        {row: ['o', 'Re-open'], action: actionPop(reopen, {id})},
        {row: ['c', 'Comment'], action: popStack},
        {row: ['s', 'Merge - Squash'], action: () => {}},
        {row: ['R', 'Merge - Rebase'], action: () => {}},
    ];

    useEffect(() => {
        commands.forEach(({row, action}) => screen.onceKey([row[0]], action));
        () => commands.forEach(({row, action}) => screen.unkey([row[0]], action));
    }, []);

    return close.requestState
        .emptyFlatMap(() => reopen.requestState)
        .emptyFlatMap(() => merge.requestState)
        .emptyMap(() => {
            return <PullRequestCommandStructure
                pullRequest={pullRequest}
                commands={commands}
            />;
        })
        .fetchingMap(() => 'Loading...')
        .refetchingMap(() => 'Loading...')
        .errorMap(() => 'Error!')
        .value();
}

