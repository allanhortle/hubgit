// @flow
import React from 'react';
import {MemoryRouter} from 'react-router';
import {Route} from 'react-router';

export default () => (Component: *) => (rootProps: {}) => <MemoryRouter>
    <Route path="/" render={(props) => <Component {...rootProps} {...props} />} />
</MemoryRouter>;
