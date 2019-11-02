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

type Props = {};


function content(view, viewIndex, repo): StackItem {
    const item = (component): StackItem => ({component, props: {view, viewIndex, repo}});
    if(view === 'readme') return item(RepoView);
    if(view === 'releases') return item(ReleasesView);
    if(view === 'pulls' || view === 'pull') {
        return item(viewIndex ? PullrequestItem : PullrequestList);
    }
    if(repo.ref) return item(PullrequestItemFromRef);
    return item(() => <box>404 View not found</box>);
}

export default pipe(
    ({repoData, view, viewIndex}) => composeWith(
        ErrorBoundaryHoc(),
        (Component) => class CoreView extends React.Component<Props, CoreContextType> {
            setContext: (CoreContextType) => void;
            constructor(props) {
                super(props);
                this.setContext = (data) => this.setState(data);
                const pushStack = (component, props) => this.setState(update('stack', _ => _.push({component, props})));
                const replaceStack = (component, props) => this.setState(update('stack', _ => _.replace({component, props})));
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
                    popStack,
                    replaceStack,
                    screen: CoreScreen
                };
            }
            render() {
                return <CoreContext.Provider value={this.state}>
                    <Component {...this.props} repoData={repoData} />
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

