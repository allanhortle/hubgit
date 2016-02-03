import React from 'react';
import { Route, IndexRoute } from 'react-router';

import AppHandler from 'hubgit/client/components/AppHandler';
import MainPage from 'hubgit/client/components/MainPage';

var routes = (
    <Route component={AppHandler} path="/" >
        <IndexRoute component={MainPage} />
    </Route>
);

module.exports = routes;

//
        //<Route path="other" component={OtherPage} />
        //<Route path="*" component={ErrorHandler}/>
