// @flow
type CommitShape = {
    additions: number,
    author: string,
    authoredDate: string,
    changedFiles: number,
    committedDate: string,
    deletions: number,
    message: string,
    messageBody: string,
    messageHeadline: string,
    oid: string
};

export default class Commit {
    _data: CommitShape;
    constructor(data: CommitShape) {
        this._data = data;
    }
    toJSON(): CommitShape {
        return this._data;
    }

    /// getters
    get additions() {
        return this._data.additions;
    }
    get author() {
        return this._data.author;
    }
    get authoredDate() {
        return this._data.authoredDate;
    }
    get changedFiles() {
        return this._data.changedFiles;
    }
    get committedDate() {
        return this._data.committedDate;
    }
    get deletions() {
        return this._data.deletions;
    }
    get message() {
        return this._data.message;
    }
    get messageBody() {
        return this._data.messageBody;
    }
    get messageHeadline() {
        return this._data.messageHeadline;
    }
    get oid() {
        return this._data.oid;
    }
}
