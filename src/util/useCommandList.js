// @flow
import type {Command} from '../core/CommandList';

import CommandList from '../core/CommandList';
import {useEffect} from 'react';
import {useCoreContext} from '../core/CoreContext';

export default function useCommandList(commands: Array<Command>) {
    const {screen, pushStack} = useCoreContext();
    useEffect(() => {
        const callback = () => pushStack(CommandList, {title: 'commands', commands});
        screen.onceKey([':'], callback);
        return () => screen.unkey([':'], callback);
    }, []);
}
