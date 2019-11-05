// @flow
import type {StackItem} from './data/Stack';
import type {CoreContextType} from './CoreContext';

import React from 'react';
import composeWith from 'unmutable/lib/util/composeWith';
import pipe from 'unmutable/lib/util/pipe';
import {render} from 'react-blessed';

import Api from './EntityApi';
import CoreStructure from './CoreStructure';
import CoreScreen from './CoreScreen';
import ErrorBoundaryHoc from './ErrorBoundaryHoc';
import CoreContext from './CoreContext';
import update from 'unmutable/update';

import PullrequestItem from '../pullrequest/PullrequestItem';
import PullrequestItemFromRef from '../pullrequest/PullrequestItemFromRef';
import PullrequestList from '../pullrequest/PullrequestList';
import RepoView from '../repo/RepoView';
import ReleasesView from '../repo/ReleasesView';
import Stack from './data/Stack';
import IssueListView from '../issue/IssueListView';
import IssueItemView from '../issue/IssueItemView';

type Props = {};


function content(repo): StackItem {
    const {view, viewIndex} = repo;
    const item = (component, props): StackItem => ({component, props: {repo, ...props}});
    if(view === 'readme') return item(RepoView);
    if(view === 'releases') return item(ReleasesView);
    if(view === 'pulls' || view === 'pull') {
        return viewIndex ? item(PullrequestItem) : item(PullrequestList, {title: 'Pull Requests'});
    }
    if(view === 'issues' || view === 'issue') {
        return viewIndex ? item(IssueItemView, {number: viewIndex}) : item(IssueListView, {title: 'Issues'});
    }
    if(repo.ref) return item(PullrequestItemFromRef);
    return item(() => <box>404 View not found</box>);
}

export default pipe(
    ({repo}) => composeWith(
        ErrorBoundaryHoc(),
        (Component) => class CoreView extends React.Component<Props, CoreContextType> {
            setContext: (CoreContextType) => void;
            constructor(props) {
                super(props);
                this.setContext = (data) => this.setState(data);
                const updateStack = (fn) => this.setState(update('stack', fn));
                const pushStack = (component, props) => updateStack(_ => _.push({component, props}));
                const replaceStack = (component, props) => updateStack(_ => _.replace({component, props}));
                const popStack = () => updateStack(_ => _.pop());
                const setProps = (fn) => updateStack(s => s.setProps(fn));

                CoreScreen.key(['q'], () => {
                    if(this.state.stack.length === 1) {
                        return process.exit(0);
                    }
                    popStack();
                });
                CoreScreen.key(['p'], () => pushStack(PullrequestList, {title: 'Pull Requests'}));
                CoreScreen.key(['i'], () => pushStack(IssueListView, {title: 'Issues'}));

                this.state = {
                    stack: new Stack([content(repo)]),
                    repo,
                    setContext: this.setContext,
                    pushStack,
                    popStack,
                    replaceStack,
                    setProps,
                    screen: CoreScreen
                };
            }
            render() {
                return <CoreContext.Provider value={this.state}>
                    <Component {...this.props} />
                </CoreContext.Provider>;
            }
        },
        Api.ProviderHoc(),
        CoreStructure
    ),
    (Structure) => {
        return render(<Structure />, CoreScreen);
    }
);

