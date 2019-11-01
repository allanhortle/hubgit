// @flow
import React, {useEffect} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
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
    const {screen, repo: {owner, name}, popStack} = useCoreContext();

    const close = Api.pullRequest.close.useRequest();
    const reopen = Api.pullRequest.reopen.useRequest();

    const commands = [
        {row: ['m', 'Merge'], action: () => {}},
        {row: ['a', 'Review - Approve'], action: () => {}},
        {row: ['r', 'Review - Request changes'], action: () => {}},
        {row: ['C', 'Review - Comment'], action: () => {}},
        {row: ['x', 'Close'], action: () => close.onRequest({id}).then(popStack)},
        {row: ['o', 'Re-open'], action: () => reopen.onRequest({id}).then(popStack)},
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

