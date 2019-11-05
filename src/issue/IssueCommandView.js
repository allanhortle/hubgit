// @flow
import React, {useEffect} from 'react';
import Api from '../core/EntityApi';
import IssueCommandStructure from './IssueCommandStructure';
import {useCoreContext} from '../core/CoreContext';
import Issue from './data/Issue';

type Props = {
    issue: Issue
};
export default function IssueCommandView(props: Props) {
    const {issue} = props;
    const {id} = issue;
    const {screen, popStack} = useCoreContext();

    log('asdasd', issue.id);

    const close = Api.issue.close.useRequest();
    const reopen = Api.issue.reopen.useRequest();

    const actionPop = (action, payload) => () => action.onRequest(payload).then(popStack);

    const commands = [
        {row: ['x', 'Close'], action: actionPop(close, {id})},
        {row: ['o', 'Re-open'], action: actionPop(reopen, {id})},
        {row: ['e', 'Edit'], action: popStack}
    ];

    useEffect(() => {
        commands.forEach(({row, action}) => screen.onceKey([row[0]], action));
        () => commands.forEach(({row, action}) => screen.unkey([row[0]], action));
    }, []);

    return close.requestState
        .emptyFlatMap(() => reopen.requestState)
        .emptyMap(() => {
            return <IssueCommandStructure
                issue={issue}
                commands={commands}
            />;
        })
        .fetchingMap(() => 'Loading...')
        .refetchingMap(() => 'Loading...')
        .errorMap(() => 'Error!')
        .value();
}

