// @flow
import {useEffect} from 'react';
import Api from '../core/EntityApi';
import {useCoreContext} from '../core/CoreContext';
import Issue from './data/Issue';

type Props = {
    issue: Issue
};
export default function IssueListCommandView(props: Props) {
    const {issue} = props;
    const {id} = issue;
    const {screen, popStack} = useCoreContext();

    const create = Api.issue.create.useRequest();

    const actionPop = (action, payload) => () => action.onRequest(payload).then(popStack);

    const commands = [
        {row: ['c', 'Create Issue'], action: actionPop(create, {id})}
    ];

    useEffect(() => {
        commands.forEach(({row, action}) => screen.onceKey([row[0]], action));
        () => commands.forEach(({row, action}) => screen.unkey([row[0]], action));
    }, []);

    return create.requestState
        .fetchingMap(() => 'Loading...')
        .refetchingMap(() => 'Loading...')
        .errorMap(() => 'Error!')
        .value();
}

