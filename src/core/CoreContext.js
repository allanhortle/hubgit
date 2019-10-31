// @flow
import type {ComponentType} from 'react';
import type {StackItemProps} from './data/Stack';

import {createContext, useContext} from 'react';
import Stack from './data/Stack';

export type CoreContextType = {
    pushStack: (ComponentType<StackItemProps>, StackItemProps) => void,
    repo: {owner: string, name: string},
    stack: Stack,
    view: string
};

const CoreContext = createContext<CoreContextType>({
    pushStack: () => {},
    repo: {},
    stack: new Stack([]),
    view: ''
});
export default CoreContext;
export const useCoreContext = () => useContext(CoreContext);
