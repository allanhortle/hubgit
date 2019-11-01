// @flow
import type {ComponentType} from 'react';

// $FlowFixMe
export type StackItemProps = any;

export type StackItem = {
    component: ComponentType<StackItemProps>,
    props: StackItemProps
};

export default class Stack {
    _data: Array<StackItem>;
    constructor(data: Array<StackItem>) {
        this._data = data;
    }
    push(item: StackItem) {
        return new Stack([...this._data, item]);
    }
    pop() {
        return new Stack(this._data.slice(0, -1));
    }
    toArray<A>(fn: (item: StackItem, index: number) => A): Array<A> {
        return this._data.map(fn);
    }
    get last(): Array<StackItem> {
        return this._data.slice(this._data.length - 1);
    }
    get length() {
        return this._data.length;
    }
}


