// @flow
import type {ComponentType} from 'react';
import type {StackItemProps} from './data/Stack';

import {createContext, useContext} from 'react';
import Stack from './data/Stack';

export type CoreContextType = {
    popStack: () => void,
    pushStack: (ComponentType<StackItemProps>, StackItemProps) => void,
    repo: {owner: string, name: string},
    screen: {},
    stack: Stack,
    view: string
};

const CoreContext = createContext<CoreContextType>({
    popStack: () => {},
    pushStack: () => {},
    repo: {},
    screen: {},
    stack: new Stack([]),
    view: ''
});
export default CoreContext;
export const useCoreContext = () => useContext(CoreContext);
