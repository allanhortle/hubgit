import {pipe} from 'unfunctional';
import update from 'unmutable/update';
import updateIn from 'unmutable/updateIn';
import {nodes} from '../../util/edgeList';

type PullRequestShape = {
    additions: number,
    author: {login: string},
    baseRefName: string,
    body: string,
    createdAt: string,
    deletions: string,
    headRefName: string,
    id: string,
    number: number,
    state: string,
    title: string,
    updatedAt: string,
    url: string
};

export default class PullRequest {
    _data: PullRequestShape;
    constructor(data: PullRequestShape) {

        // Make a map of comment lists keyed by their first items review id
        const threadMap = (data.reviewThreads.nodes || []).reduce((rr, ii) => {
            const commentNodes = ii.comments.nodes || [];
            const {id} = commentNodes[0].pullRequestReview;
            rr[id] = (rr[id] || []).concat(commentNodes);
            return rr;
        }, {});

        this._data = pipe(
            //update('createdAt', _ => new Date(_)),
            //update('updatedAt', _ => new Date(_)),
            update('pullRequestReviewThreadMap', () => threadMap),
            updateIn(['timelineItems', 'nodes'], [],  _ => {

                // Get the comments for a PullRequestReview from the review thread
                return _.map(ii => {
                    if(ii.__typename === 'PullRequestReview') {
                        ii.comments.nodes = threadMap[ii.id];
                        ii.comments.totalCount = (ii.comments.nodes || []).length;
                    }
                    return ii;
                });
            })
        )(data);

    }
    toJSON(): PullRequestShape {
        return this._data;
    }
    unit(data) {
        return new this.constructor(data);
    }
    flatPipe(...fns) {
        return pipeWith(this._data, ...fns);
    }
    pipe(...fns) {
        return pipeWith(this._data, ...fns.concat(this.unit));
    }

    /// getters
    get author() {
        return this._data.author;
    }
    get additions() {
        return this._data.additions;
    }
    get baseRefName() {
        return this._data.baseRefName;
    }
    get body() {
        return this._data.body;
    }
    get createdAt() {
        return this._data.createdAt;
    }
    get deletions() {
        return this._data.deletions;
    }
    get headRefName() {
        return this._data.headRefName;
    }
    get id() {
        return this._data.id;
    }
    get number() {
        return this._data.number;
    }
    get pullRequestReviewThreadMap() {
        return this._data.pullRequestReviewThreadMap;
    }
    get state() {
        return this._data.state;
    }
    get timelineItems() {
        return this._data.timelineItems;
    }
    get title() {
        return this._data.title;
    }
    get updatedAt() {
        return this._data.updatedAt;
    }
    get url() {
        return this._data.url;
    }
}
