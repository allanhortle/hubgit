// @flow
import type {ConnectionShape as Connection} from '../../core/data/Connection';
type CommitShape = {
    additions: number,
    author: {name: string, email: string, date: string},
    committer: {name: string, email: string, date: string},
    changedFiles: number,
    checkSuites: Connection<{
        status: string,
        conclusion: string
    }>,
    deletions: number,
    diff: string,
    message: string,
    messageBody: string,
    messageHeadline: string,
    oid: string,
    url: string
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
    get changedFiles() {
        return this._data.changedFiles;
    }
    get checkSuites() {
        return this._data.checkSuites;
    }
    get committer() {
        return this._data.committer;
    }
    get deletions() {
        return this._data.deletions;
    }
    get diff() {
        return this._data.diff;
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
    get url() {
        return this._data.url;
    }
}
