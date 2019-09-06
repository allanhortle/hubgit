// @flow
import React, {createContext} from 'react';
import composeWith from 'unmutable/lib/util/composeWith';
import pipe from 'unmutable/lib/util/pipe';
import {render} from 'react-blessed';

import Api from './EntityApi';
import CoreStructure from './CoreStructure';
import CoreScreen, {initScreen} from './CoreScreen';
import MemoryRouterHoc from './MemoryRouterHoc';
import ErrorBoundaryHoc from './ErrorBoundaryHoc';
import CoreContext from './CoreContext';

import RepoView from '../repo/RepoView';
import PullrequestView from '../pullrequest/PullrequestView';

type Props = {};
type State = {
    view: string,
    repo: {}
};


export default pipe(
    ({repoData, program}) => composeWith(
        ErrorBoundaryHoc(),
        (Component) => class CoreView extends React.Component<Props, State> {
            constructor(props) {
                super(props);
                this.setContext = (data) => this.setState(data);
                this.state = {
                    view: program.args[0],
                    repo: repoData,
                    setContext: this.setContext
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

