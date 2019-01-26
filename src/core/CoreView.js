// @flow
import React from 'react';
import blessed from 'neo-blessed';
import composeWith from 'unmutable/lib/util/composeWith';
import pipe from 'unmutable/lib/util/pipe';
import {createBlessedRenderer} from 'react-blessed';

import {EntityProvider} from './EntityApi';
import CoreStructure from './CoreStructure';
import CoreScreen from './CoreScreen';
import MemoryRouterHoc from './MemoryRouterHoc';
import ErrorBoundaryHoc from './ErrorBoundaryHoc';

import RepoView from '../repo/RepoView';
import PullrequestView from '../pullrequest/PullrequestView';

const render = createBlessedRenderer(blessed);

export default pipe(
    () => composeWith(
        ErrorBoundaryHoc(),
        EntityProvider(),
        MemoryRouterHoc(),
        CoreStructure
    ),
    (Structure) => render(<Structure
        repoView={RepoView}
        pullrequestView={PullrequestView}
    />, CoreScreen)
);

