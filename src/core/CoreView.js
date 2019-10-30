// @flow
import type {ComponentType} from 'react';

import React, {createContext} from 'react';
import composeWith from 'unmutable/lib/util/composeWith';
import pipe from 'unmutable/lib/util/pipe';
import {render} from 'react-blessed';

import Api from './EntityApi';
import CoreStructure from './CoreStructure';
import CoreScreen from './CoreScreen';
import MemoryRouterHoc from './MemoryRouterHoc';
import ErrorBoundaryHoc from './ErrorBoundaryHoc';
import CoreContext from './CoreContext';
import update from 'unmutable/update';

import PullrequestItem from '../pullrequest/PullrequestItem';
import PullrequestItemFromRef from '../pullrequest/PullrequestItemFromRef';
import PullrequestList from '../pullrequest/PullrequestList';
import IssuesView from '../repo/IssuesView';
import RepoView from '../repo/RepoView';
import ReleasesView from '../repo/ReleasesView';

type Props = {};
type State = {
    view: string,
    viewIndex: string,
    repo: {}
};


type StackItem = {
    component: React.ComponentType<any>,
    props: mixed
};

class Stack {
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
    get last() {
        return this._data.slice(this._data.length - 1);
    }
    get length() {
        return this._data.length;
    }
}

function content(view, viewIndex, repo) {
    const item = (component) => ({component, props: {view, viewIndex, repo}});
    if(repo.ref) return item(PullrequestItemFromRef);
    if(view === 'readme') return item(RepoView);
    if(view === 'releases') return item(ReleasesView);
    if(view === 'pulls' || view === 'pull') {
        return item(viewIndex ? PullrequestItem : PullrequestList);
    }
    return item(() => <box>404 View not found</box>);
}

export default pipe(
    ({repoData, program, view, viewIndex}) => composeWith(
        ErrorBoundaryHoc(),
        (Component) => class CoreView extends React.Component<Props, State> {
            constructor(props) {
                super(props);
                this.setContext = (data) => this.setState(data);
                const pushStack = (component, props) => this.setState(update('stack', _ => _.push({component, props})));
                const popStack = () => this.setState(update('stack', _ => _.pop()));

                CoreScreen.key(['q'], () => {
                    if(this.state.stack.length === 1) {
                        return process.exit(0);
                    }
                    popStack();
                });
                CoreScreen.key(['p'], () => {
                    pushStack(PullrequestList, {repo: repoData, title: 'Pull Requests'});
                });


                this.state = {
                    stack: new Stack([content(view, viewIndex, repoData)]),
                    view,
                    viewIndex,
                    repo: repoData,
                    setContext: this.setContext,
                    pushStack,
                    popStack
                };
            }
            render() {
                return <CoreContext.Provider value={this.state}>
                    <Component {...this.props} repoData={repoData} />
                </CoreContext.Provider>;
            }
        },
        Api.ProviderHoc(),
        MemoryRouterHoc(),
        CoreStructure
    ),
    (Structure) => {
        return render(<Structure />, CoreScreen)
    }
);

