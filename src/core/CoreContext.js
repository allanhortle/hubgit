// @flow
import type {ComponentType} from 'react';
import type {StackItemProps} from './data/Stack';

import {createContext, useContext} from 'react';
import Stack from './data/Stack';
import Ref from '../ref/data/Ref';

type KeyHandler = (Array<string>, () => void) => void;

export type CoreContextType = {
    popStack: () => void,
    pushStack: (ComponentType<StackItemProps>, StackItemProps) => void,
    replaceStack: (ComponentType<StackItemProps>, StackItemProps) => void,
    setProps: <A>(A) => void,
    repo: {
        owner: string,
        name: string,
        view: string,
        viewIndex: number,
        ref: Ref
    },
    screen: {
        key: KeyHandler,
        onceKey: KeyHandler,
        unkey: KeyHandler
    },
    stack: Stack
};

const CoreContext = createContext<CoreContextType>({
    popStack: () => {},
    pushStack: () => {},
    replaceStack: () => {},
    setProps: () => {},
    repo: {},
    screen: {},
    stack: new Stack([]),
    view: ''
});
export default CoreContext;
export const useCoreContext = () => useContext(CoreContext);
