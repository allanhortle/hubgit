// @flow
import type {ComponentType} from 'react';
import update from 'unmutable/update';

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
    // $FlowFixMe
    [Symbol.iterator]() {
        return this._data.values();
    }

    //
    // Getters
    get head() {
        return this._data[0];
    }
    get last() {
        return this._data[this.length - 1];
    }
    get length() {
        return this._data.length;
    }
    get tail() {
        return new Stack(this._data.slice(1));
    }
    get init() {
        return new Stack(this._data.slice(0, -1));
    }


    //
    // Methods
    push(item: StackItem) {
        return new Stack([...this._data, item]);
    }
    pop() {
        return this.init;
    }
    replace(item: StackItem) {
        return this.init.push(item);
    }
    setProps<A,B>(stateFn: (A) => B) {
        const nextState = update('props', stateFn)(this.last);
        return this.init.push(nextState);
    }
    toArray<A>(fn: (item: StackItem, index: number) => A): Array<A> {
        return this._data.map(fn);
    }
}


