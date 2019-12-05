// @flow
import type {ComponentType} from 'react';
import type {Message} from 'react-enty';

import React from 'react';
import {RequestState} from 'react-enty';
import {useEffect} from 'react';
import {useCoreContext} from './CoreContext';
import ListTable from '../affordance/ListTable';

type ActionCommand = {
    +row: Array<string>,
    +disabled?: boolean,
    +message?: Message<mixed>,
    +payload?: any
};
type ViewCommand = {
    +row: Array<string>,
    +disabled?: boolean,
    +view?: ComponentType<any>,
    +props?: any
};

export type Command = ActionCommand & ViewCommand;

type Props = {
    commands: Array<Command>
};

export default function (props: Props) {
    // Commands
    const {commands} = props;
    const activeCommands = commands.filter(ii => !ii.disabled && ii.message);
    const {screen, popStack, replaceStack} = useCoreContext();

    // Key binding
    const action = (cc: Command) => {
        if(cc.disabled) return;

        if(cc.view) {
            replaceStack(cc.view, cc.props);
        } else {
            cc.message && cc.message.onRequest(cc.payload).then(popStack);
        }
    };
    const callback = (method: 'onceKey'|'unkey') => (cc: Command) => screen[method]([cc.row[0]], () => action(cc));

    useEffect(() => {
        activeCommands.forEach(callback('onceKey'));
        () => activeCommands.forEach(callback('unkey'));
    }, []);

    // Rendering
    return activeCommands
        .map(_ => _.message ? _.message.requestState : RequestState.empty())
        .reduce((rr, ii) => rr.emptyFlatMap(() => ii))
        .emptyMap(() => {
            return <ListTable
                head={['Shortcut', 'Command', 'Description']}
                rows={commands.map(({row, disabled}) => row.map(value => ({value, tag: disabled ? 'grey' : undefined})))}
                onSelect={(_, index) => {
                    action(commands[index]);
                }}
            />;
        })
        .fetchingMap(() => 'Loading...')
        .refetchingMap(() => 'Loading...')
        .errorMap(() => 'Error!')
        .value();

}

