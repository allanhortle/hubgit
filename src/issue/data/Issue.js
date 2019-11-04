// @flow
type IssueShape = {
    name: string,
    number: number,
    state: string,
    title: string,
    updatedAt: string,
    timelineItems: {
        nodes: Array<{}>
    },
    labels: {
        nodes: Array<{name: string, color: string}>
    }
};

export default class Issue {
    _data: IssueShape;
    constructor(data: IssueShape = {}) {
        this._data = data;
    }

    // getters
    get labels() { return this._data.labels; }
    get name() { return this._data.name; }
    get number() { return this._data.number; }
    get state() { return this._data.state; }
    get timelineItems() { return this._data.timelineItems; }
    get title() { return this._data.title; }
    get updatedAt() { return this._data.updatedAt; }
}