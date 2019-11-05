// @flow
import type {ConnectionShape as Connection} from '../../core/data/Connection';

type IssueShape = {
    author: {login: string},
    body: string,
    createdAt: string,
    id: string,
    labels: Connection<{name: string, color: string}>,
    name: string,
    number: number,
    state: string,
    timelineItems: Connection<{}>,
    title: string,
    updatedAt: string
};

export default class Issue {
    _data: IssueShape;
    constructor(data: IssueShape = {}) {
        this._data = data;
    }

    // getters
    get author() { return this._data.author; }
    get body() { return this._data.body; }
    get createdAt() { return this._data.createdAt; }
    get labels() { return this._data.labels; }
    get id() { return this._data.id; }
    get name() { return this._data.name; }
    get number() { return this._data.number; }
    get state() { return this._data.state; }
    get timelineItems() { return this._data.timelineItems; }
    get title() { return this._data.title; }
    get updatedAt() { return this._data.updatedAt; }
}
