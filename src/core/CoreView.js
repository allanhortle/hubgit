// @flow
import React from 'react';
import composeWith from 'unmutable/lib/util/composeWith';
import pipe from 'unmutable/lib/util/pipe';
import {render} from 'react-blessed';

import Api from './EntityApi';
import CoreStructure from './CoreStructure';
import CoreScreen, {initScreen} from './CoreScreen';
import MemoryRouterHoc from './MemoryRouterHoc';
import ErrorBoundaryHoc from './ErrorBoundaryHoc';

import RepoView from '../repo/RepoView';
import PullrequestView from '../pullrequest/PullrequestView';

export default pipe(
    (repoData) => composeWith(
        (Component) => (props) => <Component {...props} repoData={repoData} />,
        ErrorBoundaryHoc(),
        Api.ProviderHoc(),
        MemoryRouterHoc(),
        CoreStructure
    ),
    (Structure) => {
        return render(<Structure />, CoreScreen)
    }
);

